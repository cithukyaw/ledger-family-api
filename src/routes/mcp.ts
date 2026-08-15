import { Router } from "express";
import MCPController from "../controllers/mcp.controller.js";

const router = Router();

// POST /api/mcp/expense
router.post('/expense', MCPController.receiveExpenseData);

export default router;

