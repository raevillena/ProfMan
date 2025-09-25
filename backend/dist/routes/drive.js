"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const googleDriveController_1 = require("../controllers/googleDriveController");
const router = (0, express_1.Router)();
const googleDriveController = new googleDriveController_1.GoogleDriveController();
router.use(auth_1.authenticate);
router.get('/oauth-url', auth_1.professorOrAdmin, googleDriveController.getOAuthUrl.bind(googleDriveController));
router.get('/oauth-callback', googleDriveController.handleCallback.bind(googleDriveController));
router.get('/status', googleDriveController.getConnectionStatus.bind(googleDriveController));
router.post('/upload', auth_1.professorOrAdmin, googleDriveController_1.upload.single('file'), googleDriveController.uploadFile.bind(googleDriveController));
router.post('/folder', auth_1.professorOrAdmin, googleDriveController.createFolder.bind(googleDriveController));
router.get('/file/:fileId', googleDriveController.getFile.bind(googleDriveController));
router.delete('/file/:fileId', auth_1.professorOrAdmin, googleDriveController.deleteFile.bind(googleDriveController));
router.delete('/disconnect', auth_1.professorOrAdmin, googleDriveController.disconnect.bind(googleDriveController));
exports.default = router;
//# sourceMappingURL=drive.js.map