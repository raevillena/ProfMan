import { getFirestore } from '../utils/firebase';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest, AssignSubjectRequest, SubjectAssignment } from '../models/Subject';
import { Timestamp } from 'firebase-admin/firestore';

export class SubjectService {
  private db = getFirestore();

  // Get all subjects with pagination and filtering
  async getSubjects(params: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
  }): Promise<{ subjects: Subject[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 10, isActive, search } = params;
    const offset = (page - 1) * limit;

    let query: any = this.db.collection('subjects');

    // Apply filters
    if (isActive !== undefined) {
      query = query.where('isActive', '==', isActive);
    }

    // Get total count
    const totalSnapshot = await query.get();
    const total = totalSnapshot.size;

    // Apply pagination
    query = query.limit(limit).offset(offset);

    const snapshot = await query.get();
    const subjects: Subject[] = [];

    snapshot.forEach((doc: any) => {
      const subjectData = doc.data() as Subject;
      subjectData.id = doc.id;
      subjects.push(subjectData);
    });

    // Apply search filter if provided
    let filteredSubjects = subjects;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredSubjects = subjects.filter(subject => 
        subject.code.toLowerCase().includes(searchLower) ||
        subject.title.toLowerCase().includes(searchLower) ||
        subject.description.toLowerCase().includes(searchLower)
      );
    }

    return {
      subjects: filteredSubjects,
      total: filteredSubjects.length,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Get subject by ID
  async getSubjectById(subjectId: string): Promise<Subject | null> {
    const doc = await this.db.collection('subjects').doc(subjectId).get();
    
    if (!doc.exists) {
      return null;
    }

    const subjectData = doc.data() as Subject;
    subjectData.id = doc.id;
    return subjectData;
  }

  // Get subject by code
  async getSubjectByCode(code: string): Promise<Subject | null> {
    const query = await this.db.collection('subjects').where('code', '==', code).get();
    
    if (query.empty) {
      return null;
    }

    const doc = query.docs[0];
    if (!doc) {
      return null;
    }
    const subjectData = doc.data() as Subject;
    subjectData.id = doc.id;
    return subjectData;
  }

  // Create new subject
  async createSubject(subjectData: CreateSubjectRequest, createdBy: string): Promise<Subject> {
    const { code, title, description, credits } = subjectData;

    // Check if subject with this code already exists
    const existingSubject = await this.getSubjectByCode(code);
    if (existingSubject) {
      throw new Error('Subject with this code already exists');
    }

    const now = new Date();
    const subjectRef = this.db.collection('subjects').doc();

    const subject: Subject = {
      id: subjectRef.id,
      code,
      title,
      description,
      credits,
      isActive: true,
      assignedProfessors: [],
      createdBy: createdBy,
      createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
      updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
    };

    await subjectRef.set(subject);
    return subject;
  }

  // Update subject
  async updateSubject(subjectId: string, updates: UpdateSubjectRequest): Promise<Subject> {
    const subjectRef = this.db.collection('subjects').doc(subjectId);
    const subjectDoc = await subjectRef.get();

    if (!subjectDoc.exists) {
      throw new Error('Subject not found');
    }

    // Check if code is being updated and if it conflicts
    if (updates.code) {
      const existingSubject = await this.getSubjectByCode(updates.code);
      if (existingSubject && existingSubject.id !== subjectId) {
        throw new Error('Subject with this code already exists');
      }
    }

    const updateData: Partial<Subject> = {
      ...updates,
      updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    };

    await subjectRef.update(updateData);

    const updatedSubject = await this.getSubjectById(subjectId);
    if (!updatedSubject) {
      throw new Error('Failed to retrieve updated subject');
    }

    return updatedSubject;
  }

  // Soft delete subject
  async deleteSubject(subjectId: string): Promise<void> {
    const subjectRef = this.db.collection('subjects').doc(subjectId);
    const subjectDoc = await subjectRef.get();

    if (!subjectDoc.exists) {
      throw new Error('Subject not found');
    }

    await subjectRef.update({
      isActive: false,
      updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    });
  }

  // Restore subject
  async restoreSubject(subjectId: string): Promise<void> {
    const subjectRef = this.db.collection('subjects').doc(subjectId);
    const subjectDoc = await subjectRef.get();

    if (!subjectDoc.exists) {
      throw new Error('Subject not found');
    }

    await subjectRef.update({
      isActive: true,
      updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    });
  }

  // Permanently delete subject
  async permanentlyDeleteSubject(subjectId: string): Promise<void> {
    const subjectRef = this.db.collection('subjects').doc(subjectId);
    const subjectDoc = await subjectRef.get();

    if (!subjectDoc.exists) {
      throw new Error('Subject not found');
    }

    await subjectRef.delete();
  }

  // Get active subjects
  async getActiveSubjects(): Promise<Subject[]> {
    const snapshot = await this.db.collection('subjects')
      .where('isActive', '==', true)
      .get();

    const subjects: Subject[] = [];
    snapshot.forEach((doc: any) => {
      const subjectData = doc.data() as Subject;
      subjectData.id = doc.id;
      subjects.push(subjectData);
    });

    return subjects;
  }

  // Get subjects by professor (through branches)
  async getSubjectsByProfessor(professorId: string): Promise<Subject[]> {
    // First get all branches for this professor
    const branchesSnapshot = await this.db.collection('branches')
      .where('professorId', '==', professorId)
      .where('isActive', '==', true)
      .get();

    if (branchesSnapshot.empty) {
      return [];
    }

    // Get unique subject IDs
    const subjectIds = [...new Set(branchesSnapshot.docs.map(doc => doc.data().subjectId))];

    // Get subjects
    const subjects: Subject[] = [];
    for (const subjectId of subjectIds) {
      const subject = await this.getSubjectById(subjectId);
      if (subject && subject.isActive) {
        subjects.push(subject);
      }
    }

    return subjects;
  }

  // Assign subject to professors
  async assignSubjectToProfessors(subjectId: string, assignmentData: AssignSubjectRequest, assignedBy: string): Promise<Subject> {
    const subjectRef = this.db.collection('subjects').doc(subjectId);
    const subjectDoc = await subjectRef.get();

    if (!subjectDoc.exists) {
      throw new Error('Subject not found');
    }

    const now = new Date();
    const currentSubject = subjectDoc.data() as Subject;
    
    // Update assigned professors
    const updatedSubject = {
      ...currentSubject,
      assignedProfessors: assignmentData.professorIds,
      updatedAt: Timestamp.fromDate(now),
    };

    await subjectRef.update(updatedSubject);

    // Create assignment records for audit trail
    const batch = this.db.batch();
    for (const professorId of assignmentData.professorIds) {
      const assignmentRef = this.db.collection('subjectAssignments').doc();
      const assignment: SubjectAssignment = {
        subjectId,
        professorId,
        assignedAt: Timestamp.fromDate(now),
        assignedBy,
      };
      batch.set(assignmentRef, assignment);
    }
    await batch.commit();

    return { ...updatedSubject, id: subjectId };
  }

  // Get professors assigned to a subject
  async getAssignedProfessors(subjectId: string): Promise<{ professorId: string; assignedAt: Timestamp; assignedBy: string }[]> {
    const assignmentsSnapshot = await this.db.collection('subjectAssignments')
      .where('subjectId', '==', subjectId)
      .orderBy('assignedAt', 'desc')
      .get();

    const assignments: { professorId: string; assignedAt: Timestamp; assignedBy: string }[] = [];
    assignmentsSnapshot.forEach((doc: any) => {
      const data = doc.data();
      assignments.push({
        professorId: data.professorId,
        assignedAt: data.assignedAt,
        assignedBy: data.assignedBy,
      });
    });

    return assignments;
  }

  // Get subjects assigned to a professor
  async getSubjectsAssignedToProfessor(professorId: string): Promise<Subject[]> {
    const assignmentsSnapshot = await this.db.collection('subjectAssignments')
      .where('professorId', '==', professorId)
      .get();

    const subjectIds = assignmentsSnapshot.docs.map(doc => doc.data().subjectId);
    const subjects: Subject[] = [];

    for (const subjectId of subjectIds) {
      const subject = await this.getSubjectById(subjectId);
      if (subject && subject.isActive) {
        subjects.push(subject);
      }
    }

    return subjects;
  }

  // Remove professor assignment from subject
  async removeProfessorAssignment(subjectId: string, professorId: string): Promise<void> {
    const subjectRef = this.db.collection('subjects').doc(subjectId);
    const subjectDoc = await subjectRef.get();

    if (!subjectDoc.exists) {
      throw new Error('Subject not found');
    }

    const currentSubject = subjectDoc.data() as Subject;
    const updatedProfessors = currentSubject.assignedProfessors.filter(id => id !== professorId);

    await subjectRef.update({
      assignedProfessors: updatedProfessors,
      updatedAt: Timestamp.fromDate(new Date()),
    });

    // Remove assignment record
    const assignmentQuery = await this.db.collection('subjectAssignments')
      .where('subjectId', '==', subjectId)
      .where('professorId', '==', professorId)
      .get();

    const batch = this.db.batch();
    assignmentQuery.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}
