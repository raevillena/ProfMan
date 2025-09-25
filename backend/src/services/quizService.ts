import { getFirestore } from '../utils/firebase';
import { Quiz, CreateQuizRequest, UpdateQuizRequest, QuizAttempt, SubmitQuizAttemptRequest, QuizQuestion } from '../models/Quiz';
import { Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import admin from 'firebase-admin';

export class QuizService {
  private db = getFirestore();

  // Get all quizzes with pagination and filtering
  async getQuizzes(params: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    isDeleted?: boolean;
    branchId?: string;
  }): Promise<{ quizzes: Quiz[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 10, search, isActive, isDeleted, branchId } = params;
    const offset = (page - 1) * limit;

    let query: any = this.db.collection('quizzes');

    if (isActive !== undefined) {
      query = query.where('isActive', '==', isActive);
    }
    if (isDeleted !== undefined) {
      query = query.where('isDeleted', '==', isDeleted);
    }
    if (branchId) {
      query = query.where('branchId', '==', branchId);
    }

    const totalSnapshot = await query.get();
    const total = totalSnapshot.size;

    query = query.limit(limit).offset(offset);

    const snapshot = await query.get();
    let quizzes: Quiz[] = [];

    snapshot.forEach((doc: any) => {
      const quizData = doc.data() as Quiz;
      quizData.id = doc.id;
      quizzes.push(quizData);
    });

    if (search) {
      const searchLower = search.toLowerCase();
      quizzes = quizzes.filter(
        (q) =>
          q.title.toLowerCase().includes(searchLower) ||
          q.description?.toLowerCase().includes(searchLower)
      );
    }

    const totalPages = Math.ceil(total / limit);

    return { quizzes, total, page, totalPages };
  }

  // Get quiz by ID
  async getQuizById(id: string): Promise<Quiz | null> {
    const quizDoc = await this.db.collection('quizzes').doc(id).get();
    if (!quizDoc.exists) {
      return null;
    }
    const quizData = quizDoc.data() as Quiz;
    quizData.id = quizDoc.id;
    return quizData;
  }

  // Create new quiz
  async createQuiz(quizData: CreateQuizRequest): Promise<Quiz> {
    const quizRef = this.db.collection('quizzes').doc();
    const now = new Date();

    // Generate IDs for questions
    const questionsWithIds = quizData.questions.map(question => ({
      ...question,
      id: uuidv4()
    }));

    // Calculate total points
    const totalPoints = questionsWithIds.reduce((sum, question) => sum + question.points, 0);

    const newQuiz: Quiz = {
      id: quizRef.id,
      ...quizData,
      questions: questionsWithIds,
      totalPoints,
      isActive: true,
      isDeleted: false,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    };

    await quizRef.set(newQuiz);
    return newQuiz;
  }

  // Update quiz
  async updateQuiz(id: string, updates: UpdateQuizRequest): Promise<Quiz | null> {
    const quizRef = this.db.collection('quizzes').doc(id);
    const quizDoc = await quizRef.get();

    if (!quizDoc.exists) {
      return null;
    }

    const now = new Date();
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.fromDate(now),
    };

    // If questions are being updated, generate IDs and recalculate total points
    if (updates.questions) {
      const questionsWithIds = updates.questions.map(question => ({
        ...question,
        id: uuidv4()
      }));
      updateData.questions = questionsWithIds;
      updateData.totalPoints = questionsWithIds.reduce((sum, question) => sum + question.points, 0);
    }

    await quizRef.update(updateData);

    const updatedDoc = await quizRef.get();
    const updatedQuiz = updatedDoc.data() as Quiz;
    updatedQuiz.id = updatedDoc.id;
    return updatedQuiz;
  }

  // Soft delete quiz
  async deleteQuiz(id: string): Promise<void> {
    const quizRef = this.db.collection('quizzes').doc(id);
    const now = new Date();
    await quizRef.update({
      isDeleted: true,
      deletedAt: Timestamp.fromDate(now),
      isActive: false,
      updatedAt: Timestamp.fromDate(now),
    });
  }

  // Restore soft-deleted quiz
  async restoreQuiz(id: string): Promise<void> {
    const quizRef = this.db.collection('quizzes').doc(id);
    const now = new Date();
    await quizRef.update({
      isDeleted: false,
      deletedAt: admin.firestore.FieldValue.delete(),
      isActive: true,
      updatedAt: Timestamp.fromDate(now),
    });
  }

  // Permanently delete quiz
  async permanentlyDeleteQuiz(id: string): Promise<void> {
    await this.db.collection('quizzes').doc(id).delete();
  }

  // Get quizzes by branch
  async getQuizzesByBranch(branchId: string): Promise<Quiz[]> {
    const snapshot = await this.db.collection('quizzes')
      .where('branchId', '==', branchId)
      .where('isActive', '==', true)
      .where('isDeleted', '==', false)
      .get();
    
    const quizzes: Quiz[] = [];
    snapshot.forEach((doc: any) => {
      const quizData = doc.data() as Quiz;
      quizData.id = doc.id;
      quizzes.push(quizData);
    });
    return quizzes;
  }

  // Submit quiz attempt and auto-grade
  async submitQuizAttempt(attemptData: SubmitQuizAttemptRequest, studentId: string): Promise<QuizAttempt> {
    const quiz = await this.getQuizById(attemptData.quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // Auto-grade the quiz
    const gradingResult = this.autoGradeQuiz(quiz, attemptData.answers);
    
    const attemptRef = this.db.collection('quizAttempts').doc();
    const now = new Date();

    const quizAttempt: QuizAttempt = {
      id: attemptRef.id,
      quizId: attemptData.quizId,
      studentId,
      answers: attemptData.answers,
      score: gradingResult.score,
      totalPoints: gradingResult.totalPoints,
      percentage: gradingResult.percentage,
      timeSpent: attemptData.timeSpent,
      isCompleted: true,
      submittedAt: Timestamp.fromDate(now),
      gradedAt: Timestamp.fromDate(now),
    };

    await attemptRef.set(quizAttempt);
    return quizAttempt;
  }

  // Auto-grade quiz logic
  private autoGradeQuiz(quiz: Quiz, answers: Record<string, string | string[] | number>): {
    score: number;
    totalPoints: number;
    percentage: number;
  } {
    let score = 0;
    const totalPoints = quiz.totalPoints;

    quiz.questions.forEach(question => {
      const studentAnswer = answers[question.id];
      if (this.isAnswerCorrect(question, studentAnswer)) {
        score += question.points;
      }
    });

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

    return { score, totalPoints, percentage };
  }

  // Check if an answer is correct
  private isAnswerCorrect(question: QuizQuestion, studentAnswer: string | string[] | number | undefined): boolean {
    if (studentAnswer === undefined || studentAnswer === null) {
      return false;
    }

    switch (question.type) {
      case 'multiple_choice':
        return studentAnswer === question.correctAnswer;

      case 'multiple_select':
        if (!Array.isArray(studentAnswer) || !Array.isArray(question.correctAnswer)) {
          return false;
        }
        // Check if all correct answers are selected and no incorrect ones
        const correctAnswers = question.correctAnswer as string[];
        const studentAnswers = studentAnswer as string[];
        return correctAnswers.length === studentAnswers.length &&
               correctAnswers.every(answer => studentAnswers.includes(answer));

      case 'true_false':
        return studentAnswer === question.correctAnswer;

      case 'short_answer':
        if (typeof studentAnswer !== 'string') {
          return false;
        }
        // Case-insensitive comparison for short answers
        const correctAnswer = (question.correctAnswer as string).toLowerCase().trim();
        const studentAnswerStr = studentAnswer.toLowerCase().trim();
        return correctAnswer === studentAnswerStr;

      case 'numeric':
        if (typeof studentAnswer !== 'number' || typeof question.correctAnswer !== 'number') {
          return false;
        }
        // Allow small tolerance for numeric answers (e.g., 0.01)
        const tolerance = 0.01;
        return Math.abs(studentAnswer - (question.correctAnswer as number)) <= tolerance;

      default:
        return false;
    }
  }

  // Get quiz attempts by student
  async getQuizAttemptsByStudent(studentId: string, quizId?: string): Promise<QuizAttempt[]> {
    let query = this.db.collection('quizAttempts').where('studentId', '==', studentId);
    
    if (quizId) {
      query = query.where('quizId', '==', quizId);
    }

    const snapshot = await query.orderBy('submittedAt', 'desc').get();
    const attempts: QuizAttempt[] = [];
    
    snapshot.forEach((doc: any) => {
      const attemptData = doc.data() as QuizAttempt;
      attemptData.id = doc.id;
      attempts.push(attemptData);
    });
    
    return attempts;
  }

  // Get quiz attempts by quiz
  async getQuizAttemptsByQuiz(quizId: string): Promise<QuizAttempt[]> {
    const snapshot = await this.db.collection('quizAttempts')
      .where('quizId', '==', quizId)
      .orderBy('submittedAt', 'desc')
      .get();
    
    const attempts: QuizAttempt[] = [];
    snapshot.forEach((doc: any) => {
      const attemptData = doc.data() as QuizAttempt;
      attemptData.id = doc.id;
      attempts.push(attemptData);
    });
    
    return attempts;
  }

  // Get best attempt for a student on a quiz
  async getBestQuizAttempt(studentId: string, quizId: string): Promise<QuizAttempt | null> {
    const attempts = await this.getQuizAttemptsByStudent(studentId, quizId);
    if (attempts.length === 0) {
      return null;
    }
    
    // Return the attempt with the highest score
    return attempts.reduce((best, current) => 
      current.score > best.score ? current : best
    );
  }
}