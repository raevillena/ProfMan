"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const auth_2 = require("../validation/auth");
const router = (0, express_1.Router)();
const authController = new authController_1.AuthController();
router.post('/login', (0, validation_1.validateBody)(auth_2.loginSchema), authController.login.bind(authController));
router.post('/register', (0, validation_1.validateBody)(auth_2.registerSchema), authController.register.bind(authController));
router.post('/refresh', authController.refreshToken.bind(authController));
router.use(auth_1.authenticate);
router.post('/change-password', (0, validation_1.validateBody)(auth_2.changePasswordSchema), authController.changePassword.bind(authController));
router.get('/me', authController.getCurrentUser.bind(authController));
exports.default = router;
//# sourceMappingURL=auth.js.map