import api from './api';

export interface CreateGradebookRequest {
  branchId: string;
  branchTitle: string;
  students: Array<{
    id: string;
    studentNumber?: string;
    displayName: string;
    email: string;
  }>;
}

export interface UpdateScoresRequest {
  spreadsheetId: string;
  studentScores: Array<{
    studentId: string;
    studentName: string;
    totalPoints: number;
    earnedPoints: number;
    percentage: number;
    grade: string;
  }>;
}

export interface AddQuizResultsRequest {
  spreadsheetId: string;
  quizTitle: string;
  results: Array<{
    studentId: string;
    studentName: string;
    score: number;
    totalPoints: number;
    percentage: number;
    completedAt: string;
  }>;
}

export interface GradebookResponse {
  success: boolean;
  data?: {
    spreadsheetId: string;
    spreadsheetUrl: string;
  };
  error?: {
    code: string;
    message: string;
  };
  message?: string;
}

export interface SpreadsheetDataResponse {
  success: boolean;
  data?: {
    values: any[][];
  };
  error?: {
    code: string;
    message: string;
  };
}

export const sheetsService = {
  // Create gradebook spreadsheet
  async createGradebook(data: CreateGradebookRequest): Promise<GradebookResponse> {
    const response = await api.post('/sheets/gradebook/create', data);
    return response.data;
  },

  // Update gradebook scores
  async updateScores(data: UpdateScoresRequest): Promise<{ success: boolean; message?: string; error?: { code: string; message: string } }> {
    const response = await api.post('/sheets/gradebook/update-scores', data);
    return response.data;
  },

  // Add quiz results to gradebook
  async addQuizResults(data: AddQuizResultsRequest): Promise<{ success: boolean; message?: string; error?: { code: string; message: string } }> {
    const response = await api.post('/sheets/gradebook/add-quiz-results', data);
    return response.data;
  },

  // Get spreadsheet data
  async getSpreadsheetData(spreadsheetId: string, range?: string): Promise<SpreadsheetDataResponse> {
    const response = await api.get(`/sheets/spreadsheet/${spreadsheetId}/data`, {
      params: range ? { range } : {}
    });
    return response.data;
  },
};
