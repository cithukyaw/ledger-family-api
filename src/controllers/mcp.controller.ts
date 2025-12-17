import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { updateLedger } from "../services/ledger.service";

interface MCPDataItem {
  date?: string;
  dataRows: string[][];
}

const prisma = new PrismaClient();

class MCPController {
  /**
   * Receive expense data from MCP server
   * and insert into expenses table
   */
  public static async receiveExpenseData(
    req: Request<{}, {}, MCPDataItem[]>,
    res: Response
  ) {
    try {
      const userId = req.user as number | undefined;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: missing user",
        });
      }

      const body = req.body;

      if (!Array.isArray(body)) {
        return res.status(400).json({
          success: false,
          message: "Request body must be an array",
        });
      }

      const today = dayjs().format("YYYY-MM-DD");

      // Load categories once and build a lookup map by lower-case name
      const categories = await prisma.category.findMany({
        select: { id: true, name: true },
      });
      const categoryMap = new Map<string, number>();
      categories.forEach((cat) => {
        categoryMap.set(cat.name.toLowerCase(), cat.id);
      });

      const expenseData: Prisma.ExpenseCreateManyInput[] = [];
      const ledgerDates = new Set<string>();

      for (const item of body) {
        if (!item || !Array.isArray(item.dataRows)) {
          continue;
        }

        const date = item.date || today;
        ledgerDates.add(date);

        for (const row of item.dataRows) {
          if (!Array.isArray(row) || row.length < 4) {
            continue;
          }

          const [title, amountRaw, categoryName, type, remarks] = row;

          if (!title || !amountRaw) {
            continue;
          }

          const amount = Number(amountRaw);
          if (Number.isNaN(amount)) {
            continue;
          }

          let categoryId: number | null = null;
          if (categoryName) {
            const lowerName = String(categoryName).toLowerCase();
            const catId = categoryMap.get(lowerName);
            if (typeof catId === "number") {
              categoryId = catId;
            }
          }

          expenseData.push({
            userId,
            categoryId,
            type: type || null,
            date,
            title: String(title),
            amount,
            remarks: remarks ? String(remarks) : null,
          });
        }
      }

      if (expenseData.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid expense rows found in payload",
        });
      }

      const created = await prisma.expense.createMany({
        data: expenseData,
      });

      // Update ledgers for affected dates
      for (const d of ledgerDates) {
        await updateLedger(userId, d);
      }

      return res.status(201).json({
        success: true,
        message: "Expenses created successfully",
        count: created.count,
      });
    } catch (error) {
      console.error("Error processing MCP expense data:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}

export default MCPController;
