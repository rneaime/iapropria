
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

export const pineconeService = {
  buscarDocumentos: async (userId: string, topK: number = 1000): Promise<Metadado[]> => {
    try {
      // No código Python, o namespace é definido como o ID do usuário
      const namespace = "1";  // Fixado para namespace 1 conforme solicitado
      console.log(`Buscando documentos do Pinecone com namespace: ${namespace}`);
      
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
      console.log("Tentando conexão com a URL:", baseUrl);
      
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
      console.log("Resposta da consulta Pinecone:", queryResult);
      
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
      
      console.log(`✅ Encontrados ${documentos.length} documentos reais no Pinecone.`);
      
      toast({
        title: "Conectado ao Pinecone",
        description: `${documentos.length} documentos reais carregados com sucesso.`
      });
      
      return documentos;
      
    } catch (error) {
      console.error("Erro ao buscar documentos do Pinecone:", error);
      
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
          `https://${indexName}-c6ervab.svc.us-east-1-aws.pinecone.io/vectors/query`
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
        console.error("Método alternativo também falhou:", altError);
        
        toast({
          title: "Erro na conexão com Pinecone",
          description: "Usando dados de demonstração temporários. Erro: " + (error instanceof Error ? error.message : String(error)),
          variant: "destructive"
        });
        
        // Como último recurso, use dados de demonstração
        return mockDocumentos;
      }
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
