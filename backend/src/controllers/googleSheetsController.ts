import { Request, Response } from 'express';
import { GoogleSheetsService } from '../services/googleSheetsService';

const googleSheetsService = new GoogleSheetsService();

export class GoogleSheetsController {
  // Create gradebook spreadsheet
  async createGradebook(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
        return;
      }

      const { branchId, branchTitle, students } = req.body;

      if (!branchId || !branchTitle || !students || !Array.isArray(students)) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_PARAMETERS', message: 'Branch ID, title, and students array are required' }
        });
        return;
      }

      const result = await googleSheetsService.createGradebookSpreadsheet(
        userId,
        branchId,
        branchTitle,
        students
      );

      if (result.success) {
        res.status(200).json({
          success: true,
          data: {
            spreadsheetId: result.spreadsheetId,
            spreadsheetUrl: result.spreadsheetUrl
          },
          message: 'Gradebook created successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          error: { code: 'GRADEBOOK_CREATION_ERROR', message: result.error || 'Failed to create gradebook' }
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create gradebook'
        }
      });
    }
  }

  // Update gradebook scores
  async updateScores(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
        return;
      }

      const { spreadsheetId, studentScores } = req.body;

      if (!spreadsheetId || !studentScores || !Array.isArray(studentScores)) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_PARAMETERS', message: 'Spreadsheet ID and student scores are required' }
        });
        return;
      }

      const result = await googleSheetsService.updateGradebookScores(
        userId,
        spreadsheetId,
        studentScores
      );

      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Gradebook scores updated successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          error: { code: 'UPDATE_ERROR', message: result.error || 'Failed to update scores' }
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update scores'
        }
      });
    }
  }

  // Add quiz results to gradebook
  async addQuizResults(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
        return;
      }

      const { spreadsheetId, quizTitle, results } = req.body;

      if (!spreadsheetId || !quizTitle || !results || !Array.isArray(results)) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_PARAMETERS', message: 'Spreadsheet ID, quiz title, and results are required' }
        });
        return;
      }

      const result = await googleSheetsService.addQuizResults(
        userId,
        spreadsheetId,
        quizTitle,
        results
      );

      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Quiz results added to gradebook successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          error: { code: 'ADD_RESULTS_ERROR', message: result.error || 'Failed to add quiz results' }
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to add quiz results'
        }
      });
    }
  }

  // Get spreadsheet data
  async getSpreadsheetData(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
        return;
      }

      const { spreadsheetId } = req.params;
      const { range } = req.query;

      if (!spreadsheetId) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_SPREADSHEET_ID', message: 'Spreadsheet ID is required' }
        });
        return;
      }

      const result = await googleSheetsService.getSpreadsheetData(
        userId,
        spreadsheetId,
        range as string
      );

      if (result.success) {
        res.status(200).json({
          success: true,
          data: { values: result.data }
        });
      } else {
        res.status(400).json({
          success: false,
          error: { code: 'GET_DATA_ERROR', message: result.error || 'Failed to get spreadsheet data' }
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get spreadsheet data'
        }
      });
    }
  }
}
