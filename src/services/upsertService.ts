
import { configService } from "./configService";
import { Pinecone } from "@pinecone-database/pinecone";
import { v4 as uuidv4 } from "uuid";

// Interface para o resultado do upsert
interface UpsertResult {
  success: boolean;
  upsertedCount?: number;
  error?: string;
}

export const upsertService = {
  // Função para fazer upload de documento no Pinecone
  upsertDocument: async (
    userId: string,
    documentText: string,
    metadata: Record<string, any> = {},
    fileId: string = ""
  ): Promise<UpsertResult> => {
    try {
      const apiKey = configService.getPineconeApiKey();
      const host = configService.getPineconeHost();

      if (!apiKey || !host) {
        console.error("Pinecone API key ou host não configurados");
        return {
          success: false,
          error: "Configurações do Pinecone não definidas"
        };
      }

      // Criar ID único se não fornecido
      const id = fileId || uuidv4();
      
      // Adicionar o userId e outros metadados relevantes
      const enhancedMetadata = {
        ...metadata,
        userId,
        timestamp: new Date().toISOString(),
        textLength: documentText.length
      };

      // Simular embedding do texto (normalmente seria feito por um modelo)
      // Em produção, você usaria um modelo como OpenAI para gerar embeddings reais
      const embeddingVector = Array(1536).fill(0.1);
      
      console.log("Iniciando upsert para documento:", id);
      console.log("Metadados:", enhancedMetadata);
      
      // Inicializar o cliente Pinecone
      const pc = new Pinecone({ apiKey });
      const index = pc.index("documento");
      
      // Realizar o upsert
      const upsertResponse = await index.upsert({
        vectors: [
          {
            id,
            values: embeddingVector,
            metadata: enhancedMetadata
          }
        ],
        namespace: "1"  // Usando namespace específico
      });
      
      console.log("Resposta do upsert:", upsertResponse);
      
      return {
        success: true,
        upsertedCount: 1
      };
    } catch (error) {
      console.error("Erro no upsert:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido no upsert"
      };
    }
  },
  
  // Função alternativa para upsert via REST API
  upsertViaRest: async (
    userId: string,
    documentText: string,
    metadata: Record<string, any> = {},
    fileId: string = ""
  ): Promise<UpsertResult> => {
    try {
      const apiKey = configService.getPineconeApiKey();
      const host = configService.getPineconeHost();

      if (!apiKey || !host) {
        console.error("Pinecone API key ou host não configurados");
        return {
          success: false,
          error: "Configurações do Pinecone não definidas"
        };
      }

      // Criar ID único se não fornecido
      const id = fileId || uuidv4();
      
      // Adicionar o userId e outros metadados relevantes
      const enhancedMetadata = {
        ...metadata,
        userId,
        timestamp: new Date().toISOString(),
        textLength: documentText.length
      };

      // Simular embedding do texto
      const embeddingVector = Array(1536).fill(0.1);
      
      console.log("Iniciando upsert via REST para documento:", id);
      
      const response = await fetch(`${host}/vectors/upsert`, {
        method: 'POST',
        headers: {
          'Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vectors: [
            {
              id,
              values: embeddingVector,
              metadata: enhancedMetadata
            }
          ],
          namespace: "1"
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erro na resposta: ${response.status} - ${errorData}`);
      }
      
      const result = await response.json();
      console.log("Resultado do upsert via REST:", result);
      
      return {
        success: true,
        upsertedCount: 1
      };
    } catch (error) {
      console.error("Erro no upsert via REST:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido no upsert via REST"
      };
    }
  }
};
