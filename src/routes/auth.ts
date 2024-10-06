import {Router} from "express";
import AuthController from "../controllers/auth.controller";
import {authMiddleware} from "../lib/passport";

const router = Router();

// api/auth/availability
router.post('/availability', AuthController.checkAvailability);
// api/auth/register
router.post('/register', AuthController.register);
// api/auth/login/precheck
router.post('/login/precheck', AuthController.preCheckLogin)
// api/auth/login
router.post('/login', AuthController.login);
// api/auth/refresh
router.post('/refresh', AuthController.refreshToken);
// api/auth/logout
router.post('/logout', authMiddleware, AuthController.logout);

export default router;
