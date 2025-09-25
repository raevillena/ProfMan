"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const googleSheetsController_1 = require("../controllers/googleSheetsController");
const router = (0, express_1.Router)();
const googleSheetsController = new googleSheetsController_1.GoogleSheetsController();
router.use(auth_1.authenticate);
router.post('/gradebook/create', auth_1.professorOrAdmin, googleSheetsController.createGradebook.bind(googleSheetsController));
router.post('/gradebook/update-scores', auth_1.professorOrAdmin, googleSheetsController.updateScores.bind(googleSheetsController));
router.post('/gradebook/add-quiz-results', auth_1.professorOrAdmin, googleSheetsController.addQuizResults.bind(googleSheetsController));
router.get('/spreadsheet/:spreadsheetId/data', googleSheetsController.getSpreadsheetData.bind(googleSheetsController));
exports.default = router;
//# sourceMappingURL=sheets.js.map