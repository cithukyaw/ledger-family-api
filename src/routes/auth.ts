import {Router} from "express";
import {login, register} from "../controllers/auth.controller";

const router = Router();

// api/auth/register
router.post('/register', register);
// api/auth/login
router.post('/login', login);

export default router;
