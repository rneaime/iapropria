
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
  filtro8?: string;
  filtro9?: string;
  filtro10?: string;
  [key: string]: any;
}

// Mock data for fallback purposes only
const mockDocumentos: Metadado[] = [
  {
    id: "doc1",
    nome_arquivo: "relatorio_financeiro.pdf",
    categoria: "Financeiro",
    departamento: "Contabilidade",
    responsavel: "Ana Silva",
    prioridade: "Alta",
    subcategoria: "Relatórios",
    status: "Aprovado",
    tipo_documento: "PDF",
    data_processamento: "2025-05-10",
    filtro8: "Mensal",
    filtro9: "2025",
    filtro10: "Interno"
  },
  {
    id: "doc2",
    nome_arquivo: "contrato_fornecedor.docx",
    categoria: "Jurídico",
    departamento: "Legal",
    responsavel: "Carlos Mendes",
    prioridade: "Média",
    subcategoria: "Contratos",
    status: "Em análise",
    tipo_documento: "DOCX",
    data_processamento: "2025-05-08",
    filtro8: "Anual",
    filtro9: "2025",
    filtro10: "Externo"
  },
  {
    id: "doc3",
    nome_arquivo: "proposta_marketing.pptx",
    categoria: "Marketing",
    departamento: "Marketing",
    responsavel: "Paula Costa",
    prioridade: "Baixa",
    subcategoria: "Propostas",
    status: "Pendente",
    tipo_documento: "PPTX",
    data_processamento: "2025-05-12",
    filtro8: "Trimestral",
    filtro9: "2025",
    filtro10: "Interno"
  }
];

export const pineconeService = {
  buscarDocumentos: async (userId: string, topK: number = 100): Promise<Metadado[]> => {
    try {
      console.log(`Buscando documentos para usuário ${userId} usando Pinecone`);
      
      // Forçar o namespace para "1" conforme solicitado
      const forceNamespace = "1";
      const namespaceToUse = forceNamespace || userId;
      
      // Obter a chave da API e o nome do índice
      const apiKeys = configService.getApiKeys();
      const pineconeApiKey = apiKeys.PINECONE_API_KEY;
      const indexName = INDEX_NAME;
      
      if (!pineconeApiKey) {
        toast({
          title: "Erro",
          description: "Chave da API Pinecone não encontrada. Configure em Parâmetros > API.",
          variant: "destructive"
        });
        throw new Error("Chave da API Pinecone não encontrada. Configure em Parâmetros > API.");
      }
      
      // Primeiro, obter os detalhes do host para o índice
      const pineconeApiUrl = `https://controller.${indexName}.pinecone.io/databases`;
      console.log("Acessando API Pinecone:", pineconeApiUrl);
      
      const response = await fetch(pineconeApiUrl, {
        method: 'GET',
        headers: {
          'Api-Key': pineconeApiKey,
          'Content-Type': 'application/json'
        },
        // Importante: Use AbortSignal para evitar problemas de timeout
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao acessar a API Pinecone: ${response.status} ${response.statusText}`);
      }
      
      const indexDetails = await response.json();
      console.log("Detalhes do índice Pinecone:", indexDetails);
      
      // Com os detalhes do índice, podemos construir a URL para consulta do namespace
      let hostUrl;
      
      if (indexDetails[0] && indexDetails[0].status && indexDetails[0].host) {
        // Formato mais recente da API Pinecone
        hostUrl = `https://${indexDetails[0].name}-${indexDetails[0].host}`;
      } else if (indexDetails.host) {
        // Formato antigo da API Pinecone
        hostUrl = `https://${indexName}-${indexDetails.host}`;
      } else {
        throw new Error("Não foi possível obter o host do índice Pinecone.");
      }
      
      console.log("Host URL para consulta:", hostUrl);
      console.log("Usando namespace:", namespaceToUse);
      
      // Consultar os documentos usando namespace do usuário
      // Use um vetor zero para obter todos os documentos sem considerar similaridade
      const zeroVector = Array(1536).fill(0);
      
      const queryResponse = await fetch(`${hostUrl}/query`, {
        method: 'POST',
        headers: {
          'Api-Key': pineconeApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          namespace: namespaceToUse,
          topK: topK,
          includeMetadata: true,
          vector: zeroVector
        }),
        signal: AbortSignal.timeout(10000)
      });
      
      if (!queryResponse.ok) {
        throw new Error(`Erro na consulta Pinecone: ${queryResponse.status} ${queryResponse.statusText}`);
      }
      
      const queryResult = await queryResponse.json();
      console.log("Resultado da consulta Pinecone:", queryResult);
      
      if (queryResult.matches && queryResult.matches.length > 0) {
        const documentos = queryResult.matches.map((match: any) => ({
          id: match.id,
          ...match.metadata
        }));
        
        console.log(`Encontrados ${documentos.length} documentos reais no Pinecone para o namespace ${namespaceToUse}`);
        return documentos;
      } else {
        console.log(`Nenhum documento encontrado no Pinecone para o namespace ${namespaceToUse}. Usando dados de exemplo.`);
        return mockDocumentos;
      }
    } catch (error) {
      console.error("Erro ao buscar documentos do Pinecone:", error);
      toast({
        title: "Erro na conexão com Pinecone",
        description: "Tentando novamente com configuração alternativa...",
        variant: "destructive"
      });
      
      // Tentar com configuração alternativa caso a primeira falhe
      try {
        const apiKeys = configService.getApiKeys();
        const pineconeApiKey = apiKeys.PINECONE_API_KEY;
        const forceNamespace = "1";
        
        // URL direta para o índice específico
        const directUrl = `https://${INDEX_NAME}-default.svc.${INDEX_NAME}.pinecone.io/query`;
        
        console.log("Tentando URL direta:", directUrl);
        console.log("Usando namespace forçado:", forceNamespace);
        
        const response = await fetch(directUrl, {
          method: 'POST',
          headers: {
            'Api-Key': pineconeApiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            namespace: forceNamespace,
            topK: topK,
            includeMetadata: true,
            vector: Array(1536).fill(0)
          }),
          signal: AbortSignal.timeout(10000)
        });
        
        if (!response.ok) {
          throw new Error(`Segunda tentativa falhou: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log("Resultado da segunda tentativa:", result);
        
        if (result.matches && result.matches.length > 0) {
          const documentos = result.matches.map((match: any) => ({
            id: match.id,
            ...match.metadata
          }));
          console.log(`Recuperados ${documentos.length} documentos na segunda tentativa`);
          return documentos;
        }
      } catch (secondError) {
        console.error("Segunda tentativa falhou:", secondError);
      }
      
      // Se todas as tentativas falharem, usar dados de exemplo
      console.log("Todas as tentativas falharam. Usando dados de exemplo para demonstração.");
      toast({
        title: "Usando dados de exemplo",
        description: "Não foi possível conectar ao Pinecone. Exibindo dados de exemplo para demonstração.",
      });
      return mockDocumentos;
    }
  },

  deletarDocumento: async (userId: string, documentId: string): Promise<boolean> => {
    try {
      console.log(`Deletando documento ${documentId} do usuário ${userId}`);
      
      // Obter a chave da API e o nome do índice
      const apiKeys = configService.getApiKeys();
      const pineconeApiKey = apiKeys.PINECONE_API_KEY;
      const indexName = INDEX_NAME;
      
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
