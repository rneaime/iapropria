
/// <reference types="vite/client" />

// Declaração para suporte ao módulo pg
declare module 'pg' {
  export class Pool {
    constructor(options: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
      ssl?: boolean | {
        rejectUnauthorized: boolean;
      };
    });
    
    query(text: string, params?: any[]): Promise<{
      rows: any[];
      rowCount: number;
    }>;
    
    end(): Promise<void>;
  }
  
  export class Client {
    constructor(options: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
      ssl?: boolean | {
        rejectUnauthorized: boolean;
      };
    });
    
    connect(): Promise<void>;
    query(text: string, params?: any[]): Promise<{
      rows: any[];
      rowCount: number;
    }>;
    end(): Promise<void>;
  }
}
