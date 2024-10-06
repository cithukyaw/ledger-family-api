import {Router} from "express";
import UserController from "../controllers/user.controller";

const router = Router();

// GET /api/users
router.get('/', UserController.getUsers)
// GET /api/users/123
router.get('/:id', UserController.getUser)
// PATCH /api/users/123
router.patch('/:id', UserController.updateUser)
// get /api/users/123/ledgers
router.get('/:id/ledgers', UserController.getLedger)

export default router;
