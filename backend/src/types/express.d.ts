declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        isGuest: boolean;
      };
    }
  }
}

export {};
