import {Router} from "express";
import {createUser, getUser, getUsers} from "../controllers/user.controller";

const router = Router();

// /api/users
router.get('/', getUsers)

// /api/users/123
router.get('/:id', getUser)

// /api/users
router.post('/', createUser)

export default router;
