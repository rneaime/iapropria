
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
      console.log(`Tentando buscar documentos reais do Pinecone para namespace: 1`);
      
      // Sempre forçar o namespace para "1" conforme solicitado
      const namespace = "1";
      
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
      
      // Tentar múltiplos endpoints para garantir a conexão
      const endpointsToTry = [
        // Endpoint padrão
        {
          descricao: "Endpoint Controller padrão",
          url: `https://controller.${indexName}.pinecone.io/databases`,
          tipo: "controller"
        },
        // Endpoints alternativos
        {
          descricao: "Endpoint direto do índice",
          url: `https://${indexName}-default.svc.${indexName}.pinecone.io/query`,
          tipo: "query",
        },
        {
          descricao: "Endpoint regional GCP",
          url: `https://${indexName}-yjxbz01.svc.gcp-starter.pinecone.io/query`,
          tipo: "query"
        },
        {
          descricao: "Endpoint regional AWS",
          url: `https://${indexName}-c6ervab.svc.us-east-1-aws.pinecone.io/query`,
          tipo: "query"
        }
      ];
      
      let documentos: Metadado[] = [];
      let sucessoConexao = false;
      
      // Função para criar um vetor zero para consulta
      const createZeroVector = (dim: number = 1536) => Array(dim).fill(0);
      
      // Tentar cada endpoint até conseguir
      for (const endpoint of endpointsToTry) {
        try {
          console.log(`Tentando conexão com: ${endpoint.descricao} (${endpoint.url})`);
          
          if (endpoint.tipo === "controller") {
            // Obter detalhes do controlador do Pinecone
            const controllerResponse = await fetch(endpoint.url, {
              method: 'GET',
              headers: {
                'Api-Key': pineconeApiKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              signal: AbortSignal.timeout(7000)
            });
            
            if (!controllerResponse.ok) {
              console.log(`Erro no endpoint ${endpoint.descricao}: ${controllerResponse.status} ${controllerResponse.statusText}`);
              continue; // Tentar próximo endpoint
            }
            
            const indexDetails = await controllerResponse.json();
            console.log("Detalhes do índice obtidos:", indexDetails);
            
            // Construir URL para consulta
            let hostUrl;
            if (Array.isArray(indexDetails) && indexDetails[0]) {
              hostUrl = `https://${indexDetails[0].name}-${indexDetails[0].host}`;
            } else if (indexDetails.host) {
              hostUrl = `https://${indexName}-${indexDetails.host}`;
            } else {
              throw new Error("Formato de resposta do controller Pinecone não reconhecido");
            }
            
            console.log(`URL de consulta construída: ${hostUrl}`);
            
            // Fazer a consulta para obter os documentos
            const queryResponse = await fetch(`${hostUrl}/query`, {
              method: 'POST',
              headers: {
                'Api-Key': pineconeApiKey,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                namespace: namespace,
                topK: topK,
                includeMetadata: true,
                vector: createZeroVector()
              }),
              signal: AbortSignal.timeout(7000)
            });
            
            if (!queryResponse.ok) {
              throw new Error(`Erro na consulta: ${queryResponse.status} ${queryResponse.statusText}`);
            }
            
            const queryResult = await queryResponse.json();
            
            if (queryResult.matches && queryResult.matches.length > 0) {
              documentos = queryResult.matches.map((match: any) => ({
                id: match.id,
                ...match.metadata
              }));
              
              sucessoConexao = true;
              console.log(`✅ SUCESSO! Encontrados ${documentos.length} documentos reais no Pinecone.`);
              break; // Sair do loop se tiver sucesso
            } else {
              console.log("Nenhum documento encontrado neste endpoint");
            }
          } else if (endpoint.tipo === "query") {
            // Tentativa direta no endpoint de consulta
            const queryResponse = await fetch(endpoint.url, {
              method: 'POST',
              headers: {
                'Api-Key': pineconeApiKey,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                namespace: namespace,
                topK: topK,
                includeMetadata: true,
                vector: createZeroVector()
              }),
              signal: AbortSignal.timeout(7000)
            });
            
            if (!queryResponse.ok) {
              console.log(`Erro no endpoint ${endpoint.descricao}: ${queryResponse.status} ${queryResponse.statusText}`);
              continue; // Tentar próximo endpoint
            }
            
            const queryResult = await queryResponse.json();
            console.log(`Resultado da consulta em ${endpoint.descricao}:`, queryResult);
            
            if (queryResult.matches && queryResult.matches.length > 0) {
              documentos = queryResult.matches.map((match: any) => ({
                id: match.id,
                ...match.metadata
              }));
              
              sucessoConexao = true;
              console.log(`✅ SUCESSO! Encontrados ${documentos.length} documentos reais no Pinecone usando ${endpoint.descricao}`);
              break; // Sair do loop se tiver sucesso
            } else {
              console.log(`Nenhum documento encontrado no endpoint ${endpoint.descricao}`);
            }
          }
        } catch (error) {
          console.error(`Falha ao tentar ${endpoint.descricao}:`, error);
          // Continuar para o próximo endpoint
        }
      }
      
      if (sucessoConexao && documentos.length > 0) {
        toast({
          title: "Conectado ao Pinecone",
          description: `${documentos.length} documentos reais carregados com sucesso.`
        });
        return documentos;
      }
      
      // Se chegamos aqui, todas as tentativas falharam
      console.log("Todas as tentativas de conexão com o Pinecone falharam.");
      toast({
        title: "Não foi possível conectar ao Pinecone",
        description: "Usando dados de exemplo para demonstração. Verifique sua conexão de rede ou as configurações da API.",
        variant: "destructive"
      });
      
      return mockDocumentos;
    } catch (error) {
      console.error("Erro geral ao buscar documentos do Pinecone:", error);
      toast({
        title: "Erro na conexão",
        description: "Usando dados locais para visualização. Erro de conexão com Pinecone.",
        variant: "destructive"
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
