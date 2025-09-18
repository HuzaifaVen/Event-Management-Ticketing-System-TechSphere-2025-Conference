import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  session?: {
    oauthRole?: string;
    [key: string]: any;
  };
  user?: any;
}
