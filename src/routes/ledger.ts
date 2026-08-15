import {Router} from "express";
import LedgerController from "../controllers/ledger.controller.js";

const router = Router();

// POST /api/ledgers
router.post('/', LedgerController.upsert);

export default router;
