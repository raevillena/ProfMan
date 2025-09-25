import { Router } from 'express';
import { authenticate, professorOrAdmin } from '../middleware/auth';
import { GoogleSheetsController } from '../controllers/googleSheetsController';

const router = Router();
const googleSheetsController = new GoogleSheetsController();

// All sheets routes require authentication
router.use(authenticate);

// Gradebook operations
router.post('/gradebook/create', 
  professorOrAdmin,
  googleSheetsController.createGradebook.bind(googleSheetsController)
);

router.post('/gradebook/update-scores', 
  professorOrAdmin,
  googleSheetsController.updateScores.bind(googleSheetsController)
);

router.post('/gradebook/add-quiz-results', 
  professorOrAdmin,
  googleSheetsController.addQuizResults.bind(googleSheetsController)
);

router.get('/spreadsheet/:spreadsheetId/data', 
  googleSheetsController.getSpreadsheetData.bind(googleSheetsController)
);

export default router;
