import { configService } from './configService';
import { INDEX_NAME } from '../config/env';
import { Pinecone } from '@pinecone-database/pinecone';

// Cliente Pinecone inicializado com lazy loading
let pineconeClient: Pinecone | null = null;

// Host específico do Pinecone
const PINECONE_HOST = "https://iapropria2-unfyip3.svc.aped-4627-b74a.pinecone.io";

const initPineconeClient = (): Pinecone | null => {
  try {
    const apiKeys = configService.getApiKeys();
    const pineconeApiKey = apiKeys.PINECONE_API_KEY;
    
    if (!pineconeApiKey) {
      console.error("Chave da API Pinecone não configurada");
      return null;
    }
    
    console.log("Inicializando cliente Pinecone com a biblioteca oficial");
    return new Pinecone({ apiKey: pineconeApiKey });
  } catch (error) {
    console.error("Erro ao inicializar cliente Pinecone:", error);
    return null;
  }
};

export const pineconeService = {
  testConnection: async (): Promise<boolean> => {
    try {
      console.log("Testando conexão com Pinecone usando SDK oficial...");
      
      // Obter a chave da API Pinecone
      const apiKeys = configService.getApiKeys();
      const pineconeApiKey = apiKeys.PINECONE_API_KEY;
      
      if (!pineconeApiKey) {
        throw new Error("Chave da API Pinecone não encontrada");
      }
      
      // Inicializar cliente se ainda não foi feito
      if (!pineconeClient) {
        pineconeClient = initPineconeClient();
        if (!pineconeClient) {
          throw new Error("Não foi possível inicializar o cliente Pinecone");
        }
      }
      
      // Nome do índice configurado
      const indexName = configService.getIndexName() || INDEX_NAME;
      console.log(`Usando índice: ${indexName}`);
      
      // Conectar ao índice Pinecone
      const index = pineconeClient.index(indexName);
      
      // Testar conexão com query simples
      const queryResponse = await index.query({
        namespace: "1",
        topK: 1,
        includeMetadata: true,
        vector: Array(384).fill(0),
        includeValues: false
      });
      
      console.log("Conexão com Pinecone estabelecida com sucesso:", queryResponse);
      return true;
      
    } catch (error) {
      console.error("Erro ao testar conexão com Pinecone via SDK:", error);
      
      // Tentar conexão alternativa via REST API
      try {
        return await pineconeService.testConnectionViaRest();
      } catch (restError) {
        console.error("Método REST API também falhou:", restError);
        return false;
      }
    }
  },
  
  testConnectionViaRest: async (): Promise<boolean> => {
    try {
      console.log("Testando conexão com Pinecone via REST API...");
      
      const apiKeys = configService.getApiKeys();
      const pineconeApiKey = apiKeys.PINECONE_API_KEY;
      
      if (!pineconeApiKey) {
        throw new Error("Chave da API Pinecone não encontrada");
      }
      
      // Usar o host específico fornecido
      const baseUrl = PINECONE_HOST;
      console.log("Usando URL específica para query REST:", baseUrl);
      
      const queryResponse = await fetch(`${baseUrl}/query`, {
        method: 'POST',
        headers: {
          'Api-Key': pineconeApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          namespace: "1",
          topK: 1,
          includeMetadata: true,
          vector: Array(384).fill(0),
          includeValues: false
        }),
        signal: AbortSignal.timeout(15000)
      });
      
      if (!queryResponse.ok) {
        throw new Error(`Falha na query REST: ${queryResponse.status} ${queryResponse.statusText}`);
      }
      
      const result = await queryResponse.json();
      console.log("Conexão via REST API bem-sucedida:", result);
      return true;
      
    } catch (error) {
      console.error("Erro ao testar conexão via REST API:", error);
      throw error;
    }
  },
  
  query: async (query: string, filters?: Record<string, any>, maxResults = 10): Promise<SearchResult[]> => {
    try {
      // Obter a chave da API Pinecone
      const apiKeys = configService.getApiKeys();
      const pineconeApiKey = apiKeys.PINECONE_API_KEY;
      
      if (!pineconeApiKey) {
        throw new Error("Chave da API Pinecone não encontrada");
      }
      
      // Inicializar cliente se ainda não foi feito
      if (!pineconeClient) {
        pineconeClient = initPineconeClient();
        if (!pineconeClient) {
          throw new Error("Não foi possível inicializar o cliente Pinecone");
        }
      }
      
      // Nome do índice configurado
      const indexName = configService.getIndexName() || INDEX_NAME;
      console.log(`Usando índice: ${indexName}`);
      
      // Gerar vetor a partir da consulta
      // Em um cenário real, isso seria feito através de um modelo de embeddings
      const mockVector = Array.from({ length: 384 }, () => Math.random() * 2 - 1);
      
      // Preparar filtros
      let filter = {};
      if (filters && Object.keys(filters).length > 0) {
        filter = filters;
      }
      
      // Conectar ao índice Pinecone
      const index = pineconeClient.index(indexName);
      
      // Realizar consulta no Pinecone
      const namespace = "1"; // Usar namespace fixo "1"
      console.log(`Consultando namespace: ${namespace} com filtro:`, filter);
      
      const queryResponse = await index.query({
        namespace: namespace,
        topK: maxResults,
        includeMetadata: true,
        filter: filter,
        vector: mockVector
      });
      
      console.log("Resposta da consulta:", queryResponse);
      
      // Processar resultados
      return (queryResponse.matches || []).map(match => ({
        id: match.id,
        score: match.score || 0,
        metadata: match.metadata || {},
        text: (match.metadata?.text as string) || "Nenhum texto disponível"
      }));
      
    } catch (error) {
      console.error("Erro ao consultar Pinecone:", error);
      
      // Tentar método alternativo
      try {
        return await pineconeService.queryViaRest(query, filters, maxResults);
      } catch (restError) {
        console.error("Método REST também falhou:", restError);
        return [];
      }
    }
  },
  
  queryViaRest: async (query: string, filters?: Record<string, any>, maxResults = 10): Promise<SearchResult[]> => {
    try {
      console.log("Consultando Pinecone via REST API...");
      
      const apiKeys = configService.getApiKeys();
      const pineconeApiKey = apiKeys.PINECONE_API_KEY;
      
      if (!pineconeApiKey) {
        throw new Error("Chave da API Pinecone não encontrada");
      }
      
      // Gerar vetor a partir da consulta
      const mockVector = Array.from({ length: 384 }, () => Math.random() * 2 - 1);
      
      // Preparar filtros
      let filter = {};
      if (filters && Object.keys(filters).length > 0) {
        filter = filters;
      }
      
      // Usar o host específico fornecido
      const baseUrl = PINECONE_HOST;
      console.log("Usando URL específica para query REST:", baseUrl);
      
      const namespace = "1"; // Usar namespace fixo "1"
      
      const queryResponse = await fetch(`${baseUrl}/query`, {
        method: 'POST',
        headers: {
          'Api-Key': pineconeApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          namespace: namespace,
          topK: maxResults,
          includeMetadata: true,
          filter: filter,
          vector: mockVector
        }),
        signal: AbortSignal.timeout(15000)
      });
      
      if (!queryResponse.ok) {
        throw new Error(`Falha na query REST: ${queryResponse.status} ${queryResponse.statusText}`);
      }
      
      const result = await queryResponse.json();
      console.log("Resposta da query REST:", result);
      
      // Processar resultados
      return (result.matches || []).map((match: any) => ({
        id: match.id,
        score: match.score || 0,
        metadata: match.metadata || {},
        text: (match.metadata?.text as string) || "Nenhum texto disponível"
      }));
      
    } catch (error) {
      console.error("Erro ao consultar via REST API:", error);
      throw error;
    }
  },
  
  deleteOne: async (id: string): Promise<boolean> => {
    try {
      // Obter a chave da API Pinecone
      const apiKeys = configService.getApiKeys();
      const pineconeApiKey = apiKeys.PINECONE_API_KEY;
      
      if (!pineconeApiKey) {
        throw new Error("Chave da API Pinecone não encontrada");
      }
      
      // Inicializar cliente se ainda não foi feito
      if (!pineconeClient) {
        pineconeClient = initPineconeClient();
        if (!pineconeClient) {
          throw new Error("Não foi possível inicializar o cliente Pinecone");
        }
      }
      
      // Nome do índice configurado
      const indexName = configService.getIndexName() || INDEX_NAME;
      console.log(`Usando índice: ${indexName} para excluir ID: ${id}`);
      
      // Conectar ao índice Pinecone
      const index = pineconeClient.index(indexName);
      
      // Usar namespace fixo "1"
      const namespace = "1";
      
      // Realizar exclusão no Pinecone
      await index.deleteOne(id, { namespace });
      
      console.log(`Documento ${id} excluído com sucesso`);
      return true;
      
    } catch (error) {
      console.error("Erro ao excluir documento:", error);
      
      // Tentar método alternativo
      try {
        return await pineconeService.deleteOneViaRest(id);
      } catch (restError) {
        console.error("Método REST também falhou:", restError);
        return false;
      }
    }
  },
  
  deleteOneViaRest: async (id: string): Promise<boolean> => {
    try {
      console.log(`Excluindo documento ${id} via REST API...`);
      
      const apiKeys = configService.getApiKeys();
      const pineconeApiKey = apiKeys.PINECONE_API_KEY;
      
      if (!pineconeApiKey) {
        throw new Error("Chave da API Pinecone não encontrada");
      }
      
      // Usar o host específico fornecido
      const baseUrl = PINECONE_HOST;
      console.log("Usando URL específica para delete REST:", baseUrl);
      
      // Usar namespace fixo "1"
      const namespace = "1";
      
      // Construir URL com parâmetros
      const url = new URL(`${baseUrl}/vectors/delete`);
      
      const deleteResponse = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Api-Key': pineconeApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ids: [id],
          namespace: namespace
        }),
        signal: AbortSignal.timeout(15000)
      });
      
      if (!deleteResponse.ok) {
        throw new Error(`Falha no delete REST: ${deleteResponse.status} ${deleteResponse.statusText}`);
      }
      
      console.log(`Documento ${id} excluído com sucesso via REST API`);
      return true;
      
    } catch (error) {
      console.error("Erro ao excluir via REST API:", error);
      throw error;
    }
  }
};
