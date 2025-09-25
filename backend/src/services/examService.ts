import { getFirestore } from '../utils/firebase';
import { Exam, ExamSubmission, CreateExamRequest, UpdateExamRequest, SubmitExamRequest, GradeExamRequest } from '../models/Exam';
import { Timestamp } from 'firebase-admin/firestore';
import { GoogleDriveService } from './googleDriveService';

export class ExamService {
  private db = getFirestore();
  private googleDriveService = new GoogleDriveService();

  // Create a new exam
  async createExam(examData: CreateExamRequest, professorId: string): Promise<Exam> {
    const now = new Date();
    const examRef = this.db.collection('exams').doc();
    
    const exam: Exam = {
      id: examRef.id,
      branchId: examData.branchId,
      professorId,
      title: examData.title,
      description: examData.description,
      instructions: examData.instructions,
      totalPoints: examData.totalPoints,
      timeLimit: examData.timeLimit,
      dueDate: Timestamp.fromDate(new Date(examData.dueDate)),
      isActive: true,
      allowLateSubmission: examData.allowLateSubmission,
      maxAttempts: examData.maxAttempts,
      questions: examData.questions.map((q, index) => ({
        ...q,
        id: `q${index + 1}`
      })),
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now)
    };

    await examRef.set(exam);
    return exam;
  }

  // Get exam by ID
  async getExamById(examId: string): Promise<Exam | null> {
    const examDoc = await this.db.collection('exams').doc(examId).get();
    if (!examDoc.exists) {
      return null;
    }
    return examDoc.data() as Exam;
  }

  // Get exams by branch
  async getExamsByBranch(branchId: string, isActive?: boolean): Promise<Exam[]> {
    let query = this.db.collection('exams').where('branchId', '==', branchId);
    
    if (isActive !== undefined) {
      query = query.where('isActive', '==', isActive);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data() as Exam);
  }

  // Get exams by professor
  async getExamsByProfessor(professorId: string, isActive?: boolean): Promise<Exam[]> {
    let query = this.db.collection('exams').where('professorId', '==', professorId);
    
    if (isActive !== undefined) {
      query = query.where('isActive', '==', isActive);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data() as Exam);
  }

  // Update exam
  async updateExam(examId: string, updateData: UpdateExamRequest): Promise<Exam> {
    const examRef = this.db.collection('exams').doc(examId);
    const examDoc = await examRef.get();

    if (!examDoc.exists) {
      throw new Error('Exam not found');
    }

    const currentExam = examDoc.data() as Exam;
    const now = new Date();

    const updatedExam: any = {
      ...updateData,
      updatedAt: Timestamp.fromDate(now)
    };

    // Handle questions update
    if (updateData.questions) {
      updatedExam.questions = updateData.questions.map((q, index) => ({
        ...q,
        id: (q as any).id || `q${index + 1}`
      }));
    }

    // Handle due date update
    if (updateData.dueDate) {
      updatedExam.dueDate = Timestamp.fromDate(new Date(updateData.dueDate));
    }

    await examRef.update(updatedExam);
    return { ...currentExam, ...updatedExam } as Exam;
  }

  // Delete exam (soft delete)
  async deleteExam(examId: string): Promise<void> {
    const examRef = this.db.collection('exams').doc(examId);
    await examRef.update({
      isActive: false,
      updatedAt: Timestamp.fromDate(new Date())
    });
  }

  // Submit exam
  async submitExam(examId: string, studentId: string, studentName: string, submissionData: SubmitExamRequest): Promise<ExamSubmission> {
    const exam = await this.getExamById(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }

    if (!exam.isActive) {
      throw new Error('Exam is not active');
    }

    // Check if exam is past due date
    const now = new Date();
    const dueDate = exam.dueDate.toDate();
    const isLate = now > dueDate && !exam.allowLateSubmission;

    if (isLate) {
      throw new Error('Exam submission deadline has passed');
    }

    // Check attempt limits
    if (exam.maxAttempts) {
      const existingSubmissions = await this.getExamSubmissions(examId, studentId);
      if (existingSubmissions.length >= exam.maxAttempts) {
        throw new Error('Maximum attempts reached');
      }
    }

    // Calculate points (for auto-gradable questions)
    let totalEarnedPoints = 0;
    const gradedAnswers = submissionData.answers.map(answer => {
      const question = exam.questions.find(q => q.id === answer.questionId);
      if (!question) return answer;

      let points = 0;
      if (question.type === 'multiple_choice' || question.type === 'true_false') {
        if (question.correctAnswer && answer.answer === question.correctAnswer) {
          points = question.points;
          totalEarnedPoints += points;
        }
      }

      return {
        ...answer,
        points
      };
    });

    const percentage = (totalEarnedPoints / exam.totalPoints) * 100;
    const grade = this.calculateGrade(percentage);

    const submission: ExamSubmission = {
      id: this.db.collection('examSubmissions').doc().id,
      examId,
      studentId,
      studentName,
      answers: gradedAnswers,
      totalPoints: exam.totalPoints,
      earnedPoints: totalEarnedPoints,
      percentage,
      grade,
      submittedAt: Timestamp.fromDate(now),
      isLate: now > dueDate,
      attemptNumber: await this.getNextAttemptNumber(examId, studentId),
      status: 'submitted'
    };

    await this.db.collection('examSubmissions').doc(submission.id).set(submission);
    return submission;
  }

  // Get exam submissions
  async getExamSubmissions(examId: string, studentId?: string): Promise<ExamSubmission[]> {
    let query = this.db.collection('examSubmissions').where('examId', '==', examId);
    
    if (studentId) {
      query = query.where('studentId', '==', studentId);
    }

    const snapshot = await query.orderBy('submittedAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data() as ExamSubmission);
  }

  // Grade exam submission
  async gradeExamSubmission(submissionId: string, gradeData: GradeExamRequest, gradedBy: string): Promise<ExamSubmission> {
    const submissionRef = this.db.collection('examSubmissions').doc(submissionId);
    const submissionDoc = await submissionRef.get();

    if (!submissionDoc.exists) {
      throw new Error('Submission not found');
    }

    const submission = submissionDoc.data() as ExamSubmission;
    const now = new Date();

    // Update answers with grades
    const updatedAnswers = submission.answers.map(answer => {
      const gradeInfo = gradeData.answers.find(g => g.questionId === answer.questionId);
      if (gradeInfo) {
        return {
          ...answer,
          points: gradeInfo.points,
          feedback: gradeInfo.feedback
        };
      }
      return answer;
    });

    // Calculate total points
    const totalEarnedPoints = updatedAnswers.reduce((sum, answer) => sum + (answer.points || 0), 0);
    const percentage = (totalEarnedPoints / submission.totalPoints) * 100;
    const grade = this.calculateGrade(percentage);

    const updatedSubmission: ExamSubmission = {
      ...submission,
      answers: updatedAnswers,
      earnedPoints: totalEarnedPoints,
      percentage,
      grade,
      status: 'graded',
      feedback: gradeData.overallFeedback,
      gradedBy,
      gradedAt: Timestamp.fromDate(now)
    };

    await submissionRef.update(updatedSubmission as any);
    return updatedSubmission;
  }

  // Upload file for exam question
  async uploadExamFile(userId: string, fileBuffer: Buffer, fileName: string, mimeType: string): Promise<{ success: boolean; fileId?: string; error?: string }> {
    try {
      // Create exam files folder in Google Drive
      const folderResult = await this.googleDriveService.createFolder(userId, 'Exam Files');
      if (!folderResult.success) {
        throw new Error('Failed to create exam files folder');
      }

      // Upload file
      const uploadResult = await this.googleDriveService.uploadFile(
        userId,
        fileBuffer,
        fileName,
        mimeType,
        folderResult.folderId
      );

      return uploadResult;
    } catch (error) {
      console.error('Error uploading exam file:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'File upload failed'
      };
    }
  }

  // Helper methods
  private calculateGrade(percentage: number): string {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
  }

  private async getNextAttemptNumber(examId: string, studentId: string): Promise<number> {
    const submissions = await this.getExamSubmissions(examId, studentId);
    return submissions.length + 1;
  }
}
