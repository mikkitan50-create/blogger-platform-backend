declare global {
  namespace Express {
    export interface Request {
      userId: string | null;
      refreshToken?: string;
    }
  }
}

export {};