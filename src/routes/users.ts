import {Router} from "express";
import UserController from "../controllers/user.controller";

const router = Router();

// /api/users
router.get('/', UserController.getUsers)
// /api/users/123
router.get('/:id', UserController.getUser)
// /api/users/123/ledgers
router.get('/:id/ledgers', UserController.getLedger)

export default router;
