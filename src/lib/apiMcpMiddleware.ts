import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to validate API key from Bearer token
 */
export const apiMcpMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
  const expectedApiKey = process.env.MCP_API_KEY; // TODO: check with users.api_key

  if (!expectedApiKey) {
    console.error('MCP_API_KEY environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (apiKey !== expectedApiKey) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
};

