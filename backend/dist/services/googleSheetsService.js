"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSheetsService = void 0;
const googleapis_1 = require("googleapis");
const googleDriveService_1 = require("./googleDriveService");
class GoogleSheetsService {
    constructor() {
        this.googleDriveService = new googleDriveService_1.GoogleDriveService();
    }
    async createGradebookSpreadsheet(userId, branchId, branchTitle, students) {
        try {
            const driveClient = await this.googleDriveService.getUserDriveClient(userId);
            if (!driveClient) {
                throw new Error('Google Drive not connected');
            }
            const sheets = googleapis_1.google.sheets({ version: 'v4', auth: driveClient });
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
            const studentRows = students.map(student => [
                student.studentNumber || '',
                student.displayName || '',
                student.email || '',
                '',
                '',
                '',
                '',
                new Date().toLocaleDateString()
            ]);
            const allRows = [headers, ...studentRows];
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: 'A1:H1',
                valueInputOption: 'RAW',
                requestBody: {
                    values: allRows,
                },
            });
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
        }
        catch (error) {
            console.error('Error creating gradebook spreadsheet:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create gradebook spreadsheet'
            };
        }
    }
    async updateGradebookScores(userId, spreadsheetId, studentScores) {
        try {
            const driveClient = await this.googleDriveService.getUserDriveClient(userId);
            if (!driveClient) {
                throw new Error('Google Drive not connected');
            }
            const sheets = googleapis_1.google.sheets({ version: 'v4', auth: driveClient });
            const updateData = studentScores.map(score => [
                score.studentId,
                score.studentName,
                '',
                score.totalPoints,
                score.earnedPoints,
                score.percentage,
                score.grade,
                new Date().toLocaleDateString()
            ]);
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
        }
        catch (error) {
            console.error('Error updating gradebook scores:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update gradebook scores'
            };
        }
    }
    async addQuizResults(userId, spreadsheetId, quizTitle, results) {
        try {
            const driveClient = await this.googleDriveService.getUserDriveClient(userId);
            if (!driveClient) {
                throw new Error('Google Drive not connected');
            }
            const sheets = googleapis_1.google.sheets({ version: 'v4', auth: driveClient });
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
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `${columnLetter}1:${columnLetter}1`,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [[quizTitle]],
                },
            });
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
        }
        catch (error) {
            console.error('Error adding quiz results to gradebook:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to add quiz results'
            };
        }
    }
    async getSpreadsheetData(userId, spreadsheetId, range) {
        try {
            const driveClient = await this.googleDriveService.getUserDriveClient(userId);
            if (!driveClient) {
                throw new Error('Google Drive not connected');
            }
            const sheets = googleapis_1.google.sheets({ version: 'v4', auth: driveClient });
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: range || 'A:Z',
            });
            return {
                success: true,
                data: response.data.values || []
            };
        }
        catch (error) {
            console.error('Error getting spreadsheet data:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get spreadsheet data'
            };
        }
    }
    getColumnLetter(columnNumber) {
        let result = '';
        while (columnNumber > 0) {
            columnNumber--;
            result = String.fromCharCode(65 + (columnNumber % 26)) + result;
            columnNumber = Math.floor(columnNumber / 26);
        }
        return result;
    }
}
exports.GoogleSheetsService = GoogleSheetsService;
//# sourceMappingURL=googleSheetsService.js.map