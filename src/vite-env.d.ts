
/// <reference types="vite/client" />

// Declaração para simular o módulo pg quando necessário
declare module 'pg' {
  export class Pool {
    constructor(options: any);
    query: (text: string, params?: any[]) => Promise<{
      rows: any[];
      rowCount: number;
    }>;
  }
}
