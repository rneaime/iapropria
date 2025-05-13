
import { Pinecone } from '@pinecone-database/pinecone';
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

// Usaremos apenas para fallback se necessário
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

// Cliente Pinecone inicializado com lazy loading
let pineconeClient: Pinecone | null = null;

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
  buscarDocumentos: async (userId: string, topK: number = 1000): Promise<Metadado[]> => {
    try {
      console.log(`Buscando documentos do Pinecone com namespace: ${userId}`);
      
      // Utilizando o novo cliente Pinecone se não estiver inicializado
      if (!pineconeClient) {
        pineconeClient = initPineconeClient();
        if (!pineconeClient) {
          throw new Error("Não foi possível inicializar o cliente Pinecone");
        }
      }
      
      // Obtendo o nome do índice configurado
      const indexName = configService.getIndexName() || INDEX_NAME;
      console.log(`Usando índice: ${indexName}`);
      
      // Utilizando a nova API do Pinecone
      const index = pineconeClient.index(indexName);
      
      // Namespace fixado como "1" conforme solicitado
      const ns = "1";
      
      // Criando vetor de zeros com 384 dimensões
      const zeroVector = new Array(384).fill(0);
      
      // Executando a consulta com a sintaxe correta do SDK v6
      const queryResponse = await index.query({
        vector: zeroVector,
        topK: topK,
        includeMetadata: true,
        // namespace é uma propriedade interna do objeto de retorno, não um parâmetro da query
        filter: { namespace: ns }
      });
      
      console.log("Resposta da consulta Pinecone:", queryResponse);
      
      if (!queryResponse.matches || queryResponse.matches.length === 0) {
        console.warn("Nenhum documento encontrado no Pinecone para este namespace");
        toast({
          title: "Sem documentos",
          description: "Nenhum documento encontrado no namespace indicado"
        });
        return [];
      }
      
      // Extrair metadados dos resultados
      const documentos = queryResponse.matches.map((match: any) => ({
        id: match.id,
        ...match.metadata
      }));
      
      console.log(`✅ Encontrados ${documentos.length} documentos reais no Pinecone.`);
      
      toast({
        title: "Conectado ao Pinecone",
        description: `${documentos.length} documentos reais carregados com sucesso.`
      });
      
      return documentos;
      
    } catch (error) {
      console.error("Erro ao buscar documentos do Pinecone com biblioteca oficial:", error);
      
      // Método alternativo: Tentar via REST API direta
      try {
        console.log("Tentando método alternativo via REST API...");
        return await pineconeService.buscarDocumentosRestApi(userId, topK);
      } catch (restError) {
        console.error("Método REST API também falhou:", restError);
        
        // Método usando a API recomendada pelo Pinecone
        try {
          console.log("Tentando método recomendado pela Pinecone...");
          return await pineconeService.buscarDocumentosViaConnect(userId, topK);
        } catch (connectError) {
          console.error("Método Connect API também falhou:", connectError);
          
          toast({
            title: "Erro na conexão com Pinecone",
            description: "Usando dados de demonstração temporários. Erro: " + (error instanceof Error ? error.message : String(error)),
            variant: "destructive"
          });
          
          // Como último recurso, use dados de demonstração
          return mockDocumentos;
        }
      }
    }
  },
  
  // Método usando a API recomendada pela Pinecone
  buscarDocumentosViaConnect: async (userId: string, topK: number = 1000): Promise<Metadado[]> => {
    // Adicione script para carregar o Connect API
    const script = document.createElement('script');
    script.src = 'https://connect.pinecone.io/embed.js';
    script.async = true;
    document.head.appendChild(script);
    
    return new Promise((resolve, reject) => {
      // Espera o script carregar
      script.onload = () => {
        try {
          // Cria container temporário
          const container = document.createElement('div');
          container.id = 'pinecone-connect-container';
          container.style.display = 'none';
          document.body.appendChild(container);
          
          // @ts-ignore - A função será disponibilizada pelo script
          if (typeof window.connectToPinecone === 'function') {
            // @ts-ignore
            window.connectToPinecone(
              (apiKey) => {
                // Callback quando conseguir a chave
                console.log("API key obtida com sucesso via Connect API");
                
                // Salvando a chave obtida
                const currentKeys = configService.getApiKeys();
                const updatedKeys = { ...currentKeys, PINECONE_API_KEY: apiKey };
                configService.saveApiKeys(updatedKeys);
                
                // Inicializa cliente Pinecone com a nova chave
                pineconeClient = new Pinecone({ apiKey });
                
                // Depois de obter a chave, tentar novamente
                pineconeService.buscarDocumentos(userId, topK)
                  .then(docs => resolve(docs))
                  .catch(err => reject(err))
                  .finally(() => {
                    // Remove o container temporário
                    if (container && container.parentNode) {
                      container.parentNode.removeChild(container);
                    }
                  });
              },
              {
                integrationId: 'iapropria-app',
                container: container
              }
            );
          } else {
            console.error("Connect API não disponível");
            reject(new Error("Connect API não disponível"));
          }
        } catch (error) {
          console.error("Erro ao usar Connect API:", error);
          reject(error);
        }
      };
      
      script.onerror = () => {
        console.error("Falha ao carregar script do Pinecone Connect");
        reject(new Error("Falha ao carregar script do Pinecone Connect"));
      };
    });
  },
  
  // Método alternativo que usa REST API diretamente
  buscarDocumentosRestApi: async (userId: string, topK: number = 1000): Promise<Metadado[]> => {
    try {
      // No código Python, o namespace é definido como o ID do usuário
      const namespace = "1";  // Fixado para namespace 1 conforme solicitado
      console.log(`Buscando documentos do Pinecone via REST com namespace: ${namespace}`);
      
      // Obter a chave da API do configService
      const apiKeys = configService.getApiKeys();
      const pineconeApiKey = apiKeys.PINECONE_API_KEY;
      const indexName = configService.getIndexName();
      
      if (!pineconeApiKey) {
        throw new Error("Chave da API Pinecone não configurada");
      }
      
      // Simplificando a abordagem: usar uma URL direta como na versão Python
      // A URL precisará ser construída corretamente para contornar problemas de CORS
      
      const baseUrl = `https://${indexName}-default.svc.${indexName}.pinecone.io`;
      console.log("Tentando conexão REST com a URL:", baseUrl);
      
      const queryResponse = await fetch(`${baseUrl}/vectors/query`, {
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
          vector: Array(384).fill(0),  // Vetor de 384 dimensões preenchido com zeros
          includeValues: false
        }),
        signal: AbortSignal.timeout(15000)
      });
      
      if (!queryResponse.ok) {
        console.error(`Falha na consulta ao Pinecone: ${queryResponse.status} ${queryResponse.statusText}`);
        throw new Error(`Consulta ao Pinecone falhou: ${queryResponse.statusText}`);
      }
      
      const queryResult = await queryResponse.json();
      console.log("Resposta da consulta Pinecone REST:", queryResult);
      
      if (!queryResult.matches || queryResult.matches.length === 0) {
        console.warn("Nenhum documento encontrado no Pinecone para este namespace");
        toast({
          title: "Sem documentos",
          description: "Nenhum documento encontrado no namespace indicado"
        });
        return [];
      }
      
      // Extrair metadados dos resultados
      const documentos = queryResult.matches.map((match: any) => ({
        id: match.id,
        ...match.metadata
      }));
      
      console.log(`✅ Encontrados ${documentos.length} documentos reais no Pinecone via REST.`);
      
      toast({
        title: "Conectado ao Pinecone",
        description: `${documentos.length} documentos reais carregados com sucesso.`
      });
      
      return documentos;
    } catch (error) {
      console.error("Erro REST API:", error);
      
      // Método alternativo: Tentar outros endpoints conhecidos
      try {
        console.log("Tentando endpoints alternativos...");
        const indexName = configService.getIndexName();
        const apiKeys = configService.getApiKeys();
        const pineconeApiKey = apiKeys.PINECONE_API_KEY;
        const namespace = "1";
        
        // Lista de possíveis endpoints a tentar
        const endpointsToTry = [
          `https://${indexName}-yjxbz01.svc.gcp-starter.pinecone.io/vectors/query`,
          `https://${indexName}-c6ervab.svc.us-east-1-aws.pinecone.io/vectors/query`,
          `https://controller.${indexName}.pinecone.io/vectors/query`,
          `https://api.${indexName}.pinecone.io/vectors/query`
        ];
        
        for (const endpoint of endpointsToTry) {
          try {
            console.log(`Tentando endpoint alternativo: ${endpoint}`);
            
            const response = await fetch(endpoint, {
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
                vector: Array(384).fill(0),
                includeValues: false
              }),
              signal: AbortSignal.timeout(8000)
            });
            
            if (response.ok) {
              const result = await response.json();
              if (result.matches && result.matches.length > 0) {
                const docs = result.matches.map((match: any) => ({
                  id: match.id,
                  ...match.metadata
                }));
                
                console.log(`✅ Método alternativo bem-sucedido com ${docs.length} documentos`);
                
                toast({
                  title: "Conectado ao Pinecone",
                  description: `${docs.length} documentos reais carregados com sucesso (método alt).`
                });
                
                return docs;
              }
            }
          } catch (endpointError) {
            console.error(`Falha no endpoint alternativo ${endpoint}:`, endpointError);
          }
        }
        
        throw new Error("Todos os métodos de conexão falharam");
      } catch (altError) {
        throw altError;
      }
    }
  },

  deletarDocumento: async (userId: string, documentId: string): Promise<boolean> => {
    try {
      console.log(`Deletando documento ${documentId} do usuário ${userId}`);
      
      // Inicializa o cliente se necessário
      if (!pineconeClient) {
        pineconeClient = initPineconeClient();
        if (!pineconeClient) {
          throw new Error("Não foi possível inicializar o cliente Pinecone");
        }
      }
      
      const indexName = configService.getIndexName() || INDEX_NAME;
      const index = pineconeClient.index(indexName);
      
      // Deletar com o SDK oficial
      await index.deleteOne(documentId, { namespace: userId });
      
      toast({
        title: "Documento deletado",
        description: "O documento foi removido com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao deletar documento com SDK:", error);
      
      // Tentativa alternativa com REST API
      try {
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
        
        // URL direta para deleção
        const deleteUrl = `https://${indexName}-default.svc.${indexName}.pinecone.io/vectors/delete`;
        
        // Deletar o documento
        const deleteResponse = await fetch(deleteUrl, {
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
          throw new Error(`Erro ao deletar do Pinecone: ${deleteResponse.statusText}`);
        }
        
        toast({
          title: "Documento deletado",
          description: "O documento foi removido com sucesso."
        });
        
        return true;
      } catch (restError) {
        console.error("Erro ao deletar com REST API:", restError);
        toast({
          title: "Erro ao deletar do Pinecone",
          description: restError instanceof Error ? restError.message : "Erro desconhecido",
          variant: "destructive"
        });
        return false;
      }
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
  },
  
  // Método para verificar a conexão com Pinecone
  testConnection: async (): Promise<boolean> => {
    try {
      // Tenta inicializar o cliente se ainda não existir
      if (!pineconeClient) {
        pineconeClient = initPineconeClient();
        if (!pineconeClient) {
          throw new Error("Não foi possível inicializar o cliente Pinecone");
        }
      }
      
      // Lista os índices para verificar se a conexão está funcionando
      const indexes = await pineconeClient.listIndexes();
      console.log("Índices disponíveis:", indexes);
      
      toast({
        title: "Conexão com Pinecone estabelecida",
        description: `Conectado com sucesso. Índices disponíveis: ${indexes.indexes?.length || 0}`
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao testar conexão com Pinecone:", error);
      
      // Tenta método REST alternativo
      try {
        const apiKeys = configService.getApiKeys();
        const pineconeApiKey = apiKeys.PINECONE_API_KEY;
        
        if (!pineconeApiKey) {
          throw new Error("Chave da API Pinecone não configurada");
        }
        
        // Consulta a API descritiva do Pinecone
        const response = await fetch("https://controller.pinecone.io/indexes", {
          method: 'GET',
          headers: {
            'Api-Key': pineconeApiKey,
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Resposta da API REST Pinecone:", data);
          
          toast({
            title: "Conexão REST com Pinecone estabelecida",
            description: `Conectado com sucesso via REST API. Índices disponíveis: ${data.indexes?.length || 0}`
          });
          return true;
        } else {
          throw new Error(`Falha na conexão REST: ${response.statusText}`);
        }
      } catch (restError) {
        console.error("Erro no teste de conexão REST:", restError);
        
        // Tenta método do connect API
        try {
          // Adiciona o script do Connect API temporariamente
          const script = document.createElement('script');
          script.src = 'https://connect.pinecone.io/embed.js';
          script.async = true;
          document.head.appendChild(script);
          
          toast({
            title: "Testando conexão alternativa",
            description: "Tentando conectar através da Connect API..."
          });
          
          // Espera o script carregar e tenta inicializar
          setTimeout(() => {
            try {
              // @ts-ignore - A função será disponibilizada pelo script
              if (typeof window.connectToPinecone === 'function') {
                console.log("Connect API carregada com sucesso");
                
                toast({
                  title: "API de conexão disponível",
                  description: "As ferramentas de conexão do Pinecone estão disponíveis."
                });
              }
            } catch (e) {
              console.error("Erro ao inicializar Connect API:", e);
            }
          }, 2000);
        } catch (connectError) {
          console.error("Erro ao carregar Connect API:", connectError);
        }
        
        toast({
          variant: "destructive",
          title: "Erro na conexão com Pinecone",
          description: error instanceof Error ? error.message : "Erro desconhecido"
        });
        
        return false;
      }
    }
  }
};
