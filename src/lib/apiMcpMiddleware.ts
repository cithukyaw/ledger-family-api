import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Middleware to validate API key from Bearer token
 */
export const apiMcpMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API key' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { mcpApiKey: apiKey },
      select: { id: true },
    });

    if (!user) {
      return res.status(403).json({ error: 'Invalid API key' });
    }

    // Attach user id to request for downstream handlers
    (req as any).user = user.id;

    next();
  } catch (err) {
    console.error('Error validating MCP API key:', err);
    return res.status(500).json({ error: 'Server error validating API key' });
  }
};

