import { Router, Request, Response } from 'express';

export const authRouter = Router();

authRouter.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'auth' });
});

// Placeholder for future auth routes (login, signup, token validation)
