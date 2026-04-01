import type { Request, Response } from 'express';

export class HealthController {
  get = (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      version: 'v0.1',
      timestamp: new Date().toISOString(),
    });
  };
}
