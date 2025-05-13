
import { INDEX_NAME } from '../config/env';
import { configService } from './configService';
import { toast } from '@/hooks/use-toast';

interface Metadado {
  id?: string;
  nome_arquivo?: string;
  categoria?: string;
  departamento?: string;
  responsavel?: string;
  prioridade?: string;
  subcategoria?: string;
  status?: string;
  tipo_documento?: string;
  data_processamento?: string;
  [key: string]: any;
}

export const pineconeService = {
  buscarDocumentos: async (userId: string, topK: number = 100): Promise<Metadado[]> => {
    try {
      console.log(`Buscando documentos para usuário ${userId} usando Pinecone`);
      
      // Obter a chave da API e o nome do índice
      const apiKeys = configService.getApiKeys();
      const pineconeApiKey = apiKeys.PINECONE_API_KEY;
      const indexName = configService.getIndexName();
      
      if (!pineconeApiKey) {
        toast({
          title: "Erro",
          description: "Chave da API Pinecone não encontrada. Configure em Parâmetros > API.",
          variant: "destructive"
        });
        throw new Error("Chave da API Pinecone não encontrada. Configure em Parâmetros > API.");
      }
      
      // Obter detalhes e informações do Pinecone sobre o índice
      const indexDetailsResponse = await fetch(`https://controller.${indexName}.pinecone.io/databases`, {
        method: 'GET',
        headers: {
          'Api-Key': pineconeApiKey
        }
      });
      
      if (!indexDetailsResponse.ok) {
        const errorText = await indexDetailsResponse.text();
        console.error("Erro na resposta do Pinecone:", errorText);
        toast({
          title: "Erro ao acessar o Pinecone",
          description: `Status: ${indexDetailsResponse.status} - ${indexDetailsResponse.statusText}`,
          variant: "destructive"
        });
        throw new Error(`Erro ao acessar o Pinecone: ${indexDetailsResponse.statusText}`);
      }
      
      const indexDetails = await indexDetailsResponse.json();
      console.log("Detalhes do índice Pinecone:", indexDetails);
      
      // Obter o host para o índice específico
      const host = `https://${indexName}-${indexDetails.host}`;
      
      // Consultar os documentos
      const queryResponse = await fetch(`${host}/query`, {
        method: 'POST',
        headers: {
          'Api-Key': pineconeApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          namespace: userId,
          topK: topK,
          includeMetadata: true,
          vector: Array(1536).fill(0) // Vetor de zeros para consulta aberta
        })
      });
      
      if (!queryResponse.ok) {
        const errorText = await queryResponse.text();
        console.error("Erro na consulta ao Pinecone:", errorText);
        toast({
          title: "Erro na consulta ao Pinecone",
          description: `Status: ${queryResponse.status} - ${queryResponse.statusText}`,
          variant: "destructive"
        });
        throw new Error(`Erro na consulta ao Pinecone: ${queryResponse.statusText}`);
      }
      
      const queryResult = await queryResponse.json();
      console.log("Resultado da consulta Pinecone:", queryResult);
      
      // Transformar os resultados do Pinecone para o formato esperado
      const documentos: Metadado[] = queryResult.matches.map((match: any) => ({
        id: match.id,
        ...match.metadata
      }));
      
      return documentos;
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      toast({
        title: "Erro ao buscar documentos",
        description: error instanceof Error ? error.message : "Erro desconhecido ao buscar documentos",
        variant: "destructive"
      });
      return [];
    }
  },

  deletarDocumento: async (userId: string, documentId: string): Promise<boolean> => {
    try {
      console.log(`Deletando documento ${documentId} do usuário ${userId}`);
      
      // Obter a chave da API e o nome do índice
      const apiKeys = configService.getApiKeys();
      const pineconeApiKey = apiKeys.PINECONE_API_KEY;
      const indexName = configService.getIndexName();
      
      if (!pineconeApiKey) {
        toast({
          title: "Erro",
          description: "Chave da API Pinecone não encontrada.",
          variant: "destructive"
        });
        throw new Error("Chave da API Pinecone não encontrada.");
      }
      
      // Obter detalhes e informações do Pinecone sobre o índice
      const indexDetailsResponse = await fetch(`https://controller.${indexName}.pinecone.io/databases`, {
        method: 'GET',
        headers: {
          'Api-Key': pineconeApiKey
        }
      });
      
      if (!indexDetailsResponse.ok) {
        toast({
          title: "Erro ao acessar o Pinecone",
          description: indexDetailsResponse.statusText,
          variant: "destructive"
        });
        throw new Error(`Erro ao acessar o Pinecone: ${indexDetailsResponse.statusText}`);
      }
      
      const indexDetails = await indexDetailsResponse.json();
      const host = `https://${indexName}-${indexDetails.host}`;
      
      // Deletar o documento
      const deleteResponse = await fetch(`${host}/vectors/delete`, {
        method: 'POST',
        headers: {
          'Api-Key': pineconeApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: [documentId],
          namespace: userId
        })
      });
      
      if (!deleteResponse.ok) {
        toast({
          title: "Erro ao deletar do Pinecone",
          description: deleteResponse.statusText,
          variant: "destructive"
        });
        throw new Error(`Erro ao deletar do Pinecone: ${deleteResponse.statusText}`);
      }
      
      toast({
        title: "Documento deletado",
        description: "O documento foi removido com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao deletar documento:", error);
      return false;
    }
  },

  salvarFiltros: async (userId: string, filtros: Record<string, string[]>): Promise<boolean> => {
    try {
      console.log(`Salvando filtros para usuário ${userId}:`, filtros);
      
      // Simulando salvamento bem-sucedido
      localStorage.setItem(`filtros_${userId}`, JSON.stringify(filtros));
      return true;
    } catch (error) {
      console.error("Erro ao salvar filtros:", error);
      return false;
    }
  },

  getFiltros: (userId: string): Record<string, string[]> => {
    try {
      const filtrosString = localStorage.getItem(`filtros_${userId}`);
      if (filtrosString) {
        return JSON.parse(filtrosString);
      }
      return {};
    } catch (error) {
      console.error("Erro ao obter filtros:", error);
      return {};
    }
  }
};
