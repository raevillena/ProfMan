import { Router } from 'express';
import { authenticate, professorOrAdmin } from '../middleware/auth';
import { GoogleDriveController, upload } from '../controllers/googleDriveController';

const router = Router();
const googleDriveController = new GoogleDriveController();

// All drive routes require authentication
router.use(authenticate);

// OAuth routes
router.get('/oauth-url', 
  professorOrAdmin,
  googleDriveController.getOAuthUrl.bind(googleDriveController)
);

router.get('/oauth-callback', 
  googleDriveController.handleCallback.bind(googleDriveController)
);

// Connection status
router.get('/status', 
  googleDriveController.getConnectionStatus.bind(googleDriveController)
);

// File operations
router.post('/upload', 
  professorOrAdmin,
  upload.single('file'),
  googleDriveController.uploadFile.bind(googleDriveController)
);

router.post('/folder', 
  professorOrAdmin,
  googleDriveController.createFolder.bind(googleDriveController)
);

router.get('/file/:fileId', 
  googleDriveController.getFile.bind(googleDriveController)
);

router.delete('/file/:fileId', 
  professorOrAdmin,
  googleDriveController.deleteFile.bind(googleDriveController)
);

// Disconnect
router.delete('/disconnect', 
  professorOrAdmin,
  googleDriveController.disconnect.bind(googleDriveController)
);

export default router;
