export declare class GoogleSheetsService {
    private googleDriveService;
    constructor();
    createGradebookSpreadsheet(userId: string, branchId: string, branchTitle: string, students: any[]): Promise<{
        success: boolean;
        spreadsheetId?: string;
        spreadsheetUrl?: string;
        error?: string;
    }>;
    updateGradebookScores(userId: string, spreadsheetId: string, studentScores: Array<{
        studentId: string;
        studentName: string;
        totalPoints: number;
        earnedPoints: number;
        percentage: number;
        grade: string;
    }>): Promise<{
        success: boolean;
        error?: string;
    }>;
    addQuizResults(userId: string, spreadsheetId: string, quizTitle: string, results: Array<{
        studentId: string;
        studentName: string;
        score: number;
        totalPoints: number;
        percentage: number;
        completedAt: string;
    }>): Promise<{
        success: boolean;
        error?: string;
    }>;
    getSpreadsheetData(userId: string, spreadsheetId: string, range?: string): Promise<{
        success: boolean;
        data?: any[][];
        error?: string;
    }>;
    private getColumnLetter;
}
//# sourceMappingURL=googleSheetsService.d.ts.map