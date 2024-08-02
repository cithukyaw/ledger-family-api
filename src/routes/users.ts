import {Router} from "express";
import {getUser, getUsers, register} from "../controllers/user.controller";

const router = Router();

// /api/users
router.get('/', getUsers)

// /api/users/123
router.get('/:id', getUser)

// /api/users
router.post('/', register)

export default router;
