
import { INDEX_NAME } from '../config/env';
import { configService } from './configService';

interface Metadado {
  id?: string;
  nome_arquivo?: string;
  categoria?: string;
  departamento?: string;
  responsável?: string;
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
        throw new Error("Chave da API Pinecone não encontrada. Configure em Parâmetros > API.");
      }
      
      // Em uma implementação real, esta seria uma chamada à API Pinecone
      // Simulando dados retornados do Pinecone
      const documentos: Metadado[] = [];
      
      // Gera alguns documentos de exemplo
      for (let i = 1; i <= 10; i++) {
        documentos.push({
          id: `${i}`,
          nome_arquivo: `documento_${i}.pdf`,
          categoria: i % 2 === 0 ? "Financeiro" : "RH",
          departamento: i % 3 === 0 ? "TI" : "Administrativo",
          responsável: `Usuario ${i % 4 + 1}`,
          prioridade: i % 2 === 0 ? "Alta" : "Baixa",
          status: i % 3 === 0 ? "Em análise" : "Concluído"
        });
      }
      
      return documentos;
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      return [];
    }
  },

  deletarDocumento: async (userId: string, documentId: string): Promise<boolean> => {
    try {
      console.log(`Deletando documento ${documentId} do usuário ${userId}`);
      
      // Simulando deleção bem-sucedida
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
