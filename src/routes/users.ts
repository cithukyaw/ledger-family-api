import {Router} from "express";
import {createUser, getUser, getUsers} from "../controllers/UserController";

const router = Router();

// /api/users
router.get('/', getUsers)

// /api/users/123
router.get('/:id', getUser)

// /api/users
router.post('/', createUser)

export default router;
