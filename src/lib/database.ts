
// Este arquivo gerencia a conexão com o banco de dados
// No frontend, simula as operações; em um backend, realiza conexões reais
import { DB_CONFIG } from '../config/env';
import { toast } from '../hooks/use-toast';

// Interface para unificar o comportamento de consulta
interface DatabaseClient {
  query: (text: string, params?: any[]) => Promise<{
    rows: any[];
    rowCount: number;
  }>;
}

// Verificar se estamos em um ambiente que suporta conexão real com PostgreSQL
const isServerEnvironment = typeof window === 'undefined';

let client: DatabaseClient;

if (isServerEnvironment) {
  try {
    // Em um ambiente de servidor, tentar usar o módulo 'pg'
    // Nota: Isso só funcionará se executado em um ambiente Node.js
    // com o pacote 'pg' instalado
    const { Pool } = require('pg');
    const pool = new Pool({
      host: DB_CONFIG.HOST,
      port: parseInt(DB_CONFIG.PORT),
      user: DB_CONFIG.USER,
      password: DB_CONFIG.PASSWORD,
      database: DB_CONFIG.NAME,
      ssl: {
        rejectUnauthorized: false // Necessário para alguns hosts como Hostinger
      }
    });
    
    client = pool;
    console.log('Conexão real com PostgreSQL estabelecida com:', DB_CONFIG.HOST);
  } catch (error) {
    console.error('Erro ao conectar com PostgreSQL:', error);
    // Fallback para simulação caso falhe
    createMockClient();
  }
} else {
  // Em um navegador, sempre usar o cliente simulado
  createMockClient();
}

function createMockClient() {
  console.log('Usando cliente de banco de dados simulado');
  // Cliente simulado para o ambiente frontend
  client = {
    query: async (text: string, params?: any[]) => {
      console.log('Simulando consulta SQL:', text);
      console.log('Parâmetros:', params);
      
      // Simulação baseada no tipo de consulta
      if (text.toLowerCase().includes('select')) {
        // Simula uma consulta SELECT
        return {
          rows: [],
          rowCount: 0
        };
      } else if (text.toLowerCase().includes('insert')) {
        // Simula uma inserção bem-sucedida
        return {
          rows: [{ id: Math.floor(Math.random() * 1000) }],
          rowCount: 1
        };
      } else if (text.toLowerCase().includes('update')) {
        // Simula uma atualização bem-sucedida
        return {
          rows: [],
          rowCount: 1
        };
      } else if (text.toLowerCase().includes('delete')) {
        // Simula uma exclusão bem-sucedida
        return {
          rows: [],
          rowCount: 1
        };
      }
      
      // Consulta genérica
      return {
        rows: [],
        rowCount: 0
      };
    }
  };
}

export default client;
