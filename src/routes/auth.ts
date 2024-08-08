import {Router} from "express";
import AuthController from "../controllers/auth.controller";

const router = Router();

// api/auth/register
router.post('/register', AuthController.register);
// api/auth/login
router.post('/login', AuthController.login);
// api/auth/refresh
router.post('/refresh', AuthController.refreshToken);

export default router;
