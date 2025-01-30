export type Admin = {
    email: string;
    name: string;
    role: number;
    store: number;
  };
  
  declare global {
    namespace Express {
      export interface Request {
        admin?: Admin;
      }
    }
  }