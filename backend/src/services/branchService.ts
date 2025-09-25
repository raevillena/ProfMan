import { getFirestore } from '../utils/firebase';
import { Branch, CreateBranchRequest, UpdateBranchRequest } from '../models/Branch';

export class BranchService {
  private db = getFirestore();

  // Get all branches with pagination and filtering
  async getBranches(params: {
    page?: number;
    limit?: number;
    subjectId?: string;
    professorId?: string;
    isActive?: boolean;
    search?: string;
  }): Promise<{ branches: Branch[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 10, subjectId, professorId, isActive, search } = params;
    const offset = (page - 1) * limit;

    let query: any = this.db.collection('branches');

    // Apply filters
    if (subjectId) {
      query = query.where('subjectId', '==', subjectId);
    }
    if (professorId) {
      query = query.where('professorId', '==', professorId);
    }
    if (isActive !== undefined) {
      query = query.where('isActive', '==', isActive);
    }

    // Get total count
    const totalSnapshot = await query.get();
    const total = totalSnapshot.size;

    // Apply pagination
    query = query.limit(limit).offset(offset);

    const snapshot = await query.get();
    const branches: Branch[] = [];

    snapshot.forEach((doc: any) => {
      const branchData = doc.data() as Branch;
      branchData.id = doc.id;
      branches.push(branchData);
    });

    // Apply search filter if provided
    let filteredBranches = branches;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredBranches = branches.filter(branch => 
        branch.title.toLowerCase().includes(searchLower) ||
        branch.description.toLowerCase().includes(searchLower)
      );
    }

    return {
      branches: filteredBranches,
      total: filteredBranches.length,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Get branch by ID
  async getBranchById(branchId: string): Promise<Branch | null> {
    const doc = await this.db.collection('branches').doc(branchId).get();
    
    if (!doc.exists) {
      return null;
    }

    const branchData = doc.data() as Branch;
    branchData.id = doc.id;
    return branchData;
  }

  // Create new branch
  async createBranch(branchData: CreateBranchRequest): Promise<Branch> {
    const { subjectId, professorId, title, description, weekStructure } = branchData;

    // Verify subject exists
    const subjectDoc = await this.db.collection('subjects').doc(subjectId).get();
    if (!subjectDoc.exists) {
      throw new Error('Subject not found');
    }

    // Verify professor exists
    const professorDoc = await this.db.collection('users').doc(professorId).get();
    if (!professorDoc.exists) {
      throw new Error('Professor not found');
    }

    const professorData = professorDoc.data();
    if (professorData?.role !== 'professor') {
      throw new Error('User is not a professor');
    }

    const now = new Date();
    const branchRef = this.db.collection('branches').doc();

    const branch: Branch = {
      id: branchRef.id,
      subjectId,
      professorId,
      title,
      description,
      weekStructure: weekStructure || [],
      isActive: true,
      createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
      updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
    };

    await branchRef.set(branch);
    return branch;
  }

  // Update branch
  async updateBranch(branchId: string, updates: UpdateBranchRequest): Promise<Branch> {
    const branchRef = this.db.collection('branches').doc(branchId);
    const branchDoc = await branchRef.get();

    if (!branchDoc.exists) {
      throw new Error('Branch not found');
    }

    const updateData: Partial<Branch> = {
      ...updates,
      updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    };

    await branchRef.update(updateData);

    const updatedBranch = await this.getBranchById(branchId);
    if (!updatedBranch) {
      throw new Error('Failed to retrieve updated branch');
    }

    return updatedBranch;
  }

  // Soft delete branch
  async deleteBranch(branchId: string): Promise<void> {
    const branchRef = this.db.collection('branches').doc(branchId);
    const branchDoc = await branchRef.get();

    if (!branchDoc.exists) {
      throw new Error('Branch not found');
    }

    await branchRef.update({
      isActive: false,
      updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    });
  }

  // Restore branch
  async restoreBranch(branchId: string): Promise<void> {
    const branchRef = this.db.collection('branches').doc(branchId);
    const branchDoc = await branchRef.get();

    if (!branchDoc.exists) {
      throw new Error('Branch not found');
    }

    await branchRef.update({
      isActive: true,
      updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    });
  }

  // Permanently delete branch
  async permanentlyDeleteBranch(branchId: string): Promise<void> {
    const branchRef = this.db.collection('branches').doc(branchId);
    const branchDoc = await branchRef.get();

    if (!branchDoc.exists) {
      throw new Error('Branch not found');
    }

    await branchRef.delete();
  }

  // Get branches by professor
  async getBranchesByProfessor(professorId: string): Promise<Branch[]> {
    const snapshot = await this.db.collection('branches')
      .where('professorId', '==', professorId)
      .where('isActive', '==', true)
      .get();

    const branches: Branch[] = [];
    snapshot.forEach((doc: any) => {
      const branchData = doc.data() as Branch;
      branchData.id = doc.id;
      branches.push(branchData);
    });

    return branches;
  }

  // Get branches by subject
  async getBranchesBySubject(subjectId: string): Promise<Branch[]> {
    const snapshot = await this.db.collection('branches')
      .where('subjectId', '==', subjectId)
      .where('isActive', '==', true)
      .get();

    const branches: Branch[] = [];
    snapshot.forEach((doc: any) => {
      const branchData = doc.data() as Branch;
      branchData.id = doc.id;
      branches.push(branchData);
    });

    return branches;
  }

  // Get active branches
  async getActiveBranches(): Promise<Branch[]> {
    const snapshot = await this.db.collection('branches')
      .where('isActive', '==', true)
      .get();

    const branches: Branch[] = [];
    snapshot.forEach((doc: any) => {
      const branchData = doc.data() as Branch;
      branchData.id = doc.id;
      branches.push(branchData);
    });

    return branches;
  }

  // Clone branch (create a new branch based on existing one)
  async cloneBranch(branchId: string, newProfessorId: string, newTitle: string): Promise<Branch> {
    const originalBranch = await this.getBranchById(branchId);
    if (!originalBranch) {
      throw new Error('Original branch not found');
    }

    // Verify new professor exists
    const professorDoc = await this.db.collection('users').doc(newProfessorId).get();
    if (!professorDoc.exists) {
      throw new Error('Professor not found');
    }

    const professorData = professorDoc.data();
    if (professorData?.role !== 'professor') {
      throw new Error('User is not a professor');
    }

    const now = new Date();
    const branchRef = this.db.collection('branches').doc();

    const newBranch: Branch = {
      id: branchRef.id,
      subjectId: originalBranch.subjectId,
      professorId: newProfessorId,
      title: newTitle,
      description: originalBranch.description,
      weekStructure: originalBranch.weekStructure,
      isActive: true,
      createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
      updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
    };

    await branchRef.set(newBranch);
    return newBranch;
  }
}
