import {Router} from "express";
import {login, logout} from "../controllers/auth.controller";

const router = Router();

// api/auth/login
router.post('/login', login);

// api/auth/refresh

// api/auth/logout
router.post('/logout', logout);

export default router;
