import {Router} from "express";
import LedgerController from "../controllers/ledger.controller";

const router = Router();

// POST /api/ledgers
router.post('/', LedgerController.upsert);

export default router;
