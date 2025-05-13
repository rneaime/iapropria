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

// Mock data apenas para fallback caso a conexão real falhe
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
  buscarDocumentos: async (userId: string, topK: number = 1000): Promise<Metadado[]> => {
    try {
      // Forçar o namespace para "1" independentemente do userId recebido
      const namespace = "1";
      console.log(`Buscando documentos reais do Pinecone para namespace: ${namespace}`);
      
      // Obter a chave da API do configService
      const apiKeys = configService.getApiKeys();
      const pineconeApiKey = apiKeys.PINECONE_API_KEY;
      const indexName = INDEX_NAME; // "iapropria2"
      
      if (!pineconeApiKey) {
        throw new Error("Chave da API Pinecone não encontrada. Configure em Parâmetros > API.");
      }
      
      // Tentar múltiplos endpoits para garantir a conexão
      const endpointsToTry = [
        // Endpoint padrão do Pinecone - gRPC
        {
          url: `https://${indexName}-default.svc.${indexName}.pinecone.io/vectors/query`,
          description: "Endpoint padrão"
        },
        // Endpoint alternativo para GCP starter
        {
          url: `https://${indexName}-yjxbz01.svc.gcp-starter.pinecone.io/vectors/query`,
          description: "Endpoint GCP"
        },
        // Endpoint alternativo para AWS
        {
          url: `https://${indexName}-c6ervab.svc.us-east-1-aws.pinecone.io/vectors/query`,
          description: "Endpoint AWS"
        }
      ];
      
      // Função para criar um vetor zero para consulta
      // Usamos 384 dimensões como no código Python de referência 
      const createZeroVector = (dim: number = 384) => Array(dim).fill(0);
      
      let documentos: Metadado[] = [];
      let connected = false;
      
      // Tentar cada endpoint até conseguir
      for (const endpoint of endpointsToTry) {
        try {
          console.log(`Tentando conectar com ${endpoint.description}: ${endpoint.url}`);
          
          const queryResponse = await fetch(endpoint.url, {
            method: 'POST',
            headers: {
              'Api-Key': pineconeApiKey,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              namespace: namespace,
              topK: topK,
              includeMetadata: true,
              vector: createZeroVector(),
              includeValues: false
            }),
            // Adicionar timeout para não ficar esperando indefinidamente
            signal: AbortSignal.timeout(10000)
          });
          
          if (!queryResponse.ok) {
            console.error(`Falha no endpoint ${endpoint.description}: ${queryResponse.status} ${queryResponse.statusText}`);
            continue; // Tentar próximo endpoint
          }
          
          const queryResult = await queryResponse.json();
          console.log("Resposta do Pinecone:", JSON.stringify(queryResult).substring(0, 200) + "...");
          
          if (queryResult.matches && queryResult.matches.length > 0) {
            documentos = queryResult.matches.map((match: any) => ({
              id: match.id,
              ...match.metadata
            }));
            
            console.log(`✅ SUCESSO! Encontrados ${documentos.length} documentos reais no Pinecone.`);
            connected = true;
            
            toast({
              title: "Conectado ao Pinecone",
              description: `${documentos.length} documentos reais carregados com sucesso.`
            });
            
            break; // Sair do loop após sucesso
          } else {
            console.log(`Nenhum documento encontrado no endpoint ${endpoint.description}`);
          }
        } catch (error) {
          console.error(`Erro ao tentar conectar com ${endpoint.description}:`, error);
          // Continuar para o próximo endpoint
        }
      }
      
      // Se não conseguiu conectar com nenhum endpoint, usar dados mockados
      if (!connected || documentos.length === 0) {
        console.warn("Não foi possível obter dados reais do Pinecone. Usando dados de demonstração temporariamente.");
        toast({
          title: "Erro na conexão com Pinecone",
          description: "Usando dados de demonstração temporários. Verifique sua conexão ou configurações da API.",
          variant: "destructive"
        });
        return mockDocumentos;
      }
      
      return documentos;
    } catch (error) {
      console.error("Erro ao buscar documentos do Pinecone:", error);
      toast({
        title: "Erro na conexão",
        description: "Usando dados temporários para visualização. Erro: " + (error instanceof Error ? error.message : String(error)),
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
