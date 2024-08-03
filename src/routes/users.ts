import {Router} from "express";
import {getUser, getUsers} from "../controllers/user.controller";

const router = Router();

// /api/users
router.get('/', getUsers)

// /api/users/123
router.get('/:id', getUser)

export default router;
