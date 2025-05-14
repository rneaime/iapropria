
import { Pinecone } from "@pinecone-database/pinecone";
import { configService } from "./configService";

// Tipos para documentos e resultados de busca
export interface Documento {
  id: string;
  categoria?: string;
  nome_arquivo?: string;
  conteudo?: string;
  texto?: string;
  metadados?: Record<string, any>;
}

export interface SearchResult {
  id: string;
  score: number;
  metadata: Record<string, any>;
}

export const pineconeService = {
  // Testa a conexão com o Pinecone
  testConnection: async (): Promise<boolean> => {
    try {
      const apiKey = configService.getPineconeApiKey();
      const host = configService.getPineconeHost();
      
      if (!apiKey || !host) {
        console.error("Pinecone API key ou host não configurados");
        return false;
      }

      const pc = new Pinecone({ apiKey });
      const indexName = "documento";
      const indexes = await pc.listIndexes();
      
      console.log("Pinecone connection test: ", indexes);
      return Array.isArray(indexes) && indexes.some(i => i.name === indexName);
    } catch (error) {
      console.error("Erro ao testar conexão com Pinecone:", error);
      return false;
    }
  },

  // Testa a conexão com Pinecone via REST
  testConnectionViaRest: async (): Promise<boolean> => {
    try {
      const apiKey = configService.getPineconeApiKey();
      const host = configService.getPineconeHost();
      
      if (!apiKey || !host) {
        console.error("Pinecone API key ou host não configurados");
        return false;
      }

      const response = await fetch(`${host}/describe_index_stats`, {
        method: 'POST',
        headers: {
          'Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Erro na resposta: ${response.status}`);
      
      const data = await response.json();
      console.log("Pinecone REST connection test:", data);
      return true;
    } catch (error) {
      console.error("Erro ao testar conexão REST com Pinecone:", error);
      return false;
    }
  },

  // Consulta vetores no Pinecone
  query: async (
    query: string,
    filters: Record<string, any> = {},
    maxResults: number = 10
  ): Promise<SearchResult[]> => {
    try {
      const apiKey = configService.getPineconeApiKey();
      const host = configService.getPineconeHost();
      
      if (!apiKey || !host) {
        console.error("Pinecone API key ou host não configurados");
        return [];
      }

      const pc = new Pinecone({ apiKey });
      const index = pc.index("documento");

      // Convertendo a query string para vetor (simulação)
      const queryVector = Array(1536).fill(0.1);

      const queryResponse = await index.query({
        vector: queryVector,
        topK: maxResults,
        filter: filters,
        includeMetadata: true,
        namespace: "1" // Usando o namespace adequado
      });

      console.log("Query response:", queryResponse);
      
      return queryResponse.matches.map(match => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata || {}
      }));
    } catch (error) {
      console.error("Erro ao consultar Pinecone:", error);
      return [];
    }
  },

  // Consulta vetores no Pinecone via REST
  queryViaRest: async (
    query: string,
    filters: Record<string, any> = {},
    maxResults: number = 10
  ): Promise<SearchResult[]> => {
    try {
      const apiKey = configService.getPineconeApiKey();
      const host = configService.getPineconeHost();
      
      if (!apiKey || !host) {
        console.error("Pinecone API key ou host não configurados");
        return [];
      }

      // Convertendo a query string para vetor (simulação)
      const queryVector = Array(1536).fill(0.1);

      const response = await fetch(`${host}/query`, {
        method: 'POST',
        headers: {
          'Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vector: queryVector,
          topK: maxResults,
          filter: filters,
          includeMetadata: true,
          namespace: "1"
        }),
      });

      if (!response.ok) throw new Error(`Erro na resposta: ${response.status}`);
      
      const data = await response.json();
      
      return data.matches.map((match: any) => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata || {}
      }));
    } catch (error) {
      console.error("Erro ao consultar Pinecone via REST:", error);
      return [];
    }
  },
  
  // Deleta um vetor pelo ID
  deleteOne: async (id: string): Promise<boolean> => {
    try {
      const apiKey = configService.getPineconeApiKey();
      const host = configService.getPineconeHost();
      
      if (!apiKey || !host) {
        console.error("Pinecone API key ou host não configurados");
        return false;
      }

      const pc = new Pinecone({ apiKey });
      const index = pc.index("documento");
      
      await index.deleteOne(id, { namespace: "1" });
      console.log(`Documento ${id} deletado com sucesso`);
      return true;
    } catch (error) {
      console.error(`Erro ao deletar documento ${id}:`, error);
      return false;
    }
  },
  
  // Deleta vetores por IDs
  deleteMany: async (ids: string[]): Promise<boolean> => {
    try {
      const apiKey = configService.getPineconeApiKey();
      const host = configService.getPineconeHost();
      
      if (!apiKey || !host) {
        console.error("Pinecone API key ou host não configurados");
        return false;
      }

      const pc = new Pinecone({ apiKey });
      const index = pc.index("documento");
      
      await index.deleteMany(ids, { namespace: "1" });
      console.log(`${ids.length} documentos deletados com sucesso`);
      return true;
    } catch (error) {
      console.error(`Erro ao deletar múltiplos documentos:`, error);
      return false;
    }
  },
  
  // Implementações dos métodos adicionais necessários
  buscarDocumentos: async (userId: string): Promise<Documento[]> => {
    try {
      // Simulação de busca de documentos
      console.log(`Buscando documentos para o usuário ${userId}`);
      return [
        { 
          id: "doc-1", 
          categoria: "Financeiro",
          nome_arquivo: "relatorio.pdf",
          conteudo: "Conteúdo do relatório financeiro"
        },
        { 
          id: "doc-2", 
          categoria: "Legal",
          nome_arquivo: "contrato.pdf",
          conteudo: "Conteúdo do contrato"
        }
      ];
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      return [];
    }
  },
  
  deletarDocumento: async (userId: string, docId: string): Promise<boolean> => {
    try {
      console.log(`Deletando documento ${docId} para usuário ${userId}`);
      // Implementação real usaria o método deleteOne
      return await pineconeService.deleteOne(docId);
    } catch (error) {
      console.error("Erro ao deletar documento:", error);
      return false;
    }
  },
  
  getFiltros: async (userId: string): Promise<Record<string, any>[]> => {
    console.log(`Buscando filtros para o usuário ${userId}`);
    // Simulação de retorno de filtros
    return [
      { id: "filter-1", nome: "Documentos Recentes", filtro: { data: { $gt: "2023-01-01" } } },
      { id: "filter-2", nome: "Documentos Financeiros", filtro: { categoria: "Financeiro" } }
    ];
  },
  
  salvarFiltros: async (userId: string, filtros: Record<string, any>): Promise<boolean> => {
    console.log(`Salvando filtros para o usuário ${userId}:`, filtros);
    // Simulação de salvamento de filtros
    return true;
  }
};
