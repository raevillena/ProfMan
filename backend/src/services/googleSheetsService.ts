import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { GoogleDriveService } from './googleDriveService';

export class GoogleSheetsService {
  private googleDriveService: GoogleDriveService;

  constructor() {
    this.googleDriveService = new GoogleDriveService();
  }

  // Create a new spreadsheet for gradebook
  async createGradebookSpreadsheet(
    userId: string, 
    branchId: string, 
    branchTitle: string, 
    students: any[]
  ): Promise<{ success: boolean; spreadsheetId?: string; spreadsheetUrl?: string; error?: string }> {
    try {
      const driveClient = await this.googleDriveService.getUserDriveClient(userId);
      if (!driveClient) {
        throw new Error('Google Drive not connected');
      }

      const sheets = google.sheets({ version: 'v4', auth: driveClient });

      // Create new spreadsheet
      const spreadsheet = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: `Gradebook - ${branchTitle}`,
          },
        },
      });

      const spreadsheetId = spreadsheet.data.spreadsheetId;
      if (!spreadsheetId) {
        throw new Error('Failed to create spreadsheet');
      }

      // Prepare gradebook data
      const headers = [
        'Student ID',
        'Student Name',
        'Email',
        'Total Points',
        'Earned Points',
        'Percentage',
        'Grade',
        'Last Updated'
      ];

      // Add student data
      const studentRows = students.map(student => [
        student.studentNumber || '',
        student.displayName || '',
        student.email || '',
        '', // Total Points - will be calculated
        '', // Earned Points - will be calculated
        '', // Percentage - will be calculated
        '', // Grade - will be calculated
        new Date().toLocaleDateString()
      ]);

      const allRows = [headers, ...studentRows];

      // Add data to the spreadsheet
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'A1:H1',
        valueInputOption: 'RAW',
        requestBody: {
          values: allRows,
        },
      });

      // Format the header row
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: 0,
                  endRowIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 0.2,
                      green: 0.4,
                      blue: 0.8,
                    },
                    textFormat: {
                      foregroundColor: {
                        red: 1,
                        green: 1,
                        blue: 1,
                      },
                      bold: true,
                    },
                  },
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
              },
            },
            {
              autoResizeDimensions: {
                dimensions: {
                  sheetId: 0,
                  dimension: 'COLUMNS',
                  startIndex: 0,
                  endIndex: 8,
                },
              },
            },
          ],
        },
      });

      const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

      return {
        success: true,
        spreadsheetId,
        spreadsheetUrl
      };
    } catch (error) {
      console.error('Error creating gradebook spreadsheet:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create gradebook spreadsheet'
      };
    }
  }

  // Update gradebook with quiz/exam scores
  async updateGradebookScores(
    userId: string,
    spreadsheetId: string,
    studentScores: Array<{
      studentId: string;
      studentName: string;
      totalPoints: number;
      earnedPoints: number;
      percentage: number;
      grade: string;
    }>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const driveClient = await this.googleDriveService.getUserDriveClient(userId);
      if (!driveClient) {
        throw new Error('Google Drive not connected');
      }

      const sheets = google.sheets({ version: 'v4', auth: driveClient });

      // Prepare update data
      const updateData = studentScores.map(score => [
        score.studentId,
        score.studentName,
        '', // Email - keep existing
        score.totalPoints,
        score.earnedPoints,
        score.percentage,
        score.grade,
        new Date().toLocaleDateString()
      ]);

      // Find the range to update (skip header row)
      const range = `A2:H${updateData.length + 1}`;

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values: updateData,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating gradebook scores:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update gradebook scores'
      };
    }
  }

  // Add quiz/exam results to gradebook
  async addQuizResults(
    userId: string,
    spreadsheetId: string,
    quizTitle: string,
    results: Array<{
      studentId: string;
      studentName: string;
      score: number;
      totalPoints: number;
      percentage: number;
      completedAt: string;
    }>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const driveClient = await this.googleDriveService.getUserDriveClient(userId);
      if (!driveClient) {
        throw new Error('Google Drive not connected');
      }

      const sheets = google.sheets({ version: 'v4', auth: driveClient });

      // Get current sheet info to find next available column
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId,
        includeGridData: false,
      });

      const sheet = spreadsheet.data.sheets?.[0];
      if (!sheet) {
        throw new Error('Sheet not found');
      }

      const nextColumn = (sheet.properties?.gridProperties?.columnCount || 8) + 1;
      const columnLetter = this.getColumnLetter(nextColumn);

      // Add quiz title as header
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${columnLetter}1:${columnLetter}1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[quizTitle]],
        },
      });

      // Add results
      const resultsData = results.map(result => [
        `${result.score}/${result.totalPoints} (${result.percentage}%)`
      ]);

      const range = `${columnLetter}2:${columnLetter}${resultsData.length + 1}`;
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values: resultsData,
        },
      });

      // Format the new column
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: nextColumn - 1,
                  endColumnIndex: nextColumn,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 0.9,
                      green: 0.9,
                      blue: 0.9,
                    },
                    textFormat: {
                      bold: true,
                    },
                  },
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
              },
            },
            {
              autoResizeDimensions: {
                dimensions: {
                  sheetId: 0,
                  dimension: 'COLUMNS',
                  startIndex: nextColumn - 1,
                  endIndex: nextColumn,
                },
              },
            },
          ],
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error adding quiz results to gradebook:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add quiz results'
      };
    }
  }

  // Get spreadsheet data
  async getSpreadsheetData(
    userId: string,
    spreadsheetId: string,
    range?: string
  ): Promise<{ success: boolean; data?: any[][]; error?: string }> {
    try {
      const driveClient = await this.googleDriveService.getUserDriveClient(userId);
      if (!driveClient) {
        throw new Error('Google Drive not connected');
      }

      const sheets = google.sheets({ version: 'v4', auth: driveClient });

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: range || 'A:Z',
      });

      return {
        success: true,
        data: response.data.values || []
      };
    } catch (error) {
      console.error('Error getting spreadsheet data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get spreadsheet data'
      };
    }
  }

  // Helper function to convert column number to letter
  private getColumnLetter(columnNumber: number): string {
    let result = '';
    while (columnNumber > 0) {
      columnNumber--;
      result = String.fromCharCode(65 + (columnNumber % 26)) + result;
      columnNumber = Math.floor(columnNumber / 26);
    }
    return result;
  }
}
