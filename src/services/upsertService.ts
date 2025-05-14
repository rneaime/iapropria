
import { INDEX_NAME } from '../config/env';
import { configService } from './configService';
import { toast } from '@/hooks/use-toast';
import { Pinecone } from '@pinecone-database/pinecone';
import { v4 as uuidv4 } from 'uuid';

export interface UpsertMetadata {
  tipo_documento?: string;
  departamento?: string;
  categoria?: string;
  subcategoria?: string;
  responsavel?: string;
  status?: string;
  prioridade?: string;
  filtro8?: string;  // livre1
  filtro9?: string;  // livre2
  filtro10?: string; // livre3
  nome_arquivo?: string;
  data_processamento?: string;
  [key: string]: any;
}

export interface UpsertResponse {
  status: string;
  message: string;
  detalhes?: {
    chunks_criados?: number;
    paginas_processadas?: number;
    namespace?: string;
    index?: string;
    arquivo?: string;
    erro?: string;
  };
}

// Host específico do Pinecone
const PINECONE_HOST = "https://iapropria2-unfyip3.svc.aped-4627-b74a.pinecone.io";

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

export const upsertService = {
  uploadFile: async (file: File, folderPath: string): Promise<string> => {
    try {
      // Em um aplicativo real, enviaríamos o arquivo para um endpoint do servidor
      console.log(`Iniciando upload do arquivo ${file.name} para ${folderPath}`);
      
      // Simular um atraso para o upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`Upload do arquivo ${file.name} concluído com sucesso`);
      
      // Retorna o caminho onde o arquivo foi salvo
      return `${folderPath}/${file.name}`;
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error);
      throw new Error("Falha ao fazer upload do arquivo");
    }
  },
  
  processFile: async (
    filePath: string,
    namespace: string,
    metadata: UpsertMetadata
  ): Promise<UpsertResponse> => {
    try {
      console.log(`Iniciando processamento real do arquivo: ${filePath}`);
      console.log(`Namespace: ${namespace}`);
      console.log(`Metadados completos:`, metadata);
      
      // Obter a chave da API Pinecone
      const apiKeys = configService.getApiKeys();
      const pineconeApiKey = apiKeys.PINECONE_API_KEY;
      
      if (!pineconeApiKey) {
        console.error("Chave da API Pinecone não encontrada");
        throw new Error("Chave da API Pinecone não encontrada. Configure em Parâmetros > API.");
      }
      
      // Inicializa o cliente Pinecone se ainda não foi inicializado
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
      
      const fileName = filePath.split('/').pop() || '';
      
      // Em um cenário real, aqui processaríamos o conteúdo do arquivo
      // e extrairíamos os embeddings. Como não temos esse processamento,
      // vamos criar um único vetor de exemplo
      
      // Gerar um ID único para o vetor
      const vectorId = uuidv4();
      
      // Criar vetor de exemplo (384 dimensões) com valores aleatórios entre -1 e 1
      const sampleVector = Array.from({ length: 384 }, () => Math.random() * 2 - 1);
      
      // Usar namespace "1" conforme requisitado
      const ns = "1";
      
      console.log(`Enviando upsert para o Pinecone com ID ${vectorId} e namespace ${ns}`);
      
      // Realizar o upsert para o Pinecone
      const upsertResponse = await index.upsert([{
        id: vectorId,
        values: sampleVector,
        metadata: {
          ...metadata,
          text: `Conteúdo de exemplo do arquivo ${fileName}`,
          source: filePath
        }
      }], { namespace: ns });
      
      console.log("Resposta do upsert:", upsertResponse);
      
      // Verificar se o upsert foi bem-sucedido
      if (upsertResponse && upsertResponse.upsertedCount === 1) {
        console.log("Upsert realizado com sucesso!");
        
        const response: UpsertResponse = {
          status: "success",
          message: `Arquivo ${fileName} processado e enviado com sucesso para o Pinecone`,
          detalhes: {
            chunks_criados: 1,
            namespace: ns,
            index: indexName,
            arquivo: fileName
          }
        };
        
        return response;
      } else {
        throw new Error("Falha ao realizar o upsert no Pinecone");
      }
      
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      
      // Tente o método REST API como fallback
      try {
        console.log("Tentando método alternativo via REST API...");
        return await upsertService.processFileViaRest(filePath, namespace, metadata);
      } catch (restError) {
        console.error("Método REST API também falhou:", restError);
        
        return {
          status: "error",
          message: `Erro ao processar arquivo: ${error instanceof Error ? error.message : String(error)}`,
          detalhes: {
            erro: error instanceof Error ? error.message : String(error)
          }
        };
      }
    }
  },
  
  // Método alternativo usando REST API direta
  processFileViaRest: async (
    filePath: string,
    namespace: string,
    metadata: UpsertMetadata
  ): Promise<UpsertResponse> => {
    try {
      console.log(`Processando arquivo via REST API: ${filePath}`);
      
      const apiKeys = configService.getApiKeys();
      const pineconeApiKey = apiKeys.PINECONE_API_KEY;
      
      if (!pineconeApiKey) {
        throw new Error("Chave da API Pinecone não encontrada");
      }
      
      const fileName = filePath.split('/').pop() || '';
      const vectorId = uuidv4();
      
      // Criar vetor de exemplo (384 dimensões) com valores aleatórios
      const sampleVector = Array.from({ length: 384 }, () => Math.random() * 2 - 1);
      
      // Usar o host específico fornecido
      const baseUrl = PINECONE_HOST;
      console.log("Usando URL específica para upsert REST:", baseUrl);
      
      // Definir namespace como "1" conforme requisitado
      const ns = "1";
      
      const upsertResponse = await fetch(`${baseUrl}/vectors/upsert`, {
        method: 'POST',
        headers: {
          'Api-Key': pineconeApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          vectors: [{
            id: vectorId,
            values: sampleVector,
            metadata: {
              ...metadata,
              text: `Conteúdo de exemplo do arquivo ${fileName}`,
              source: filePath
            }
          }],
          namespace: ns
        }),
        signal: AbortSignal.timeout(15000)
      });
      
      if (!upsertResponse.ok) {
        throw new Error(`Falha no upsert REST: ${upsertResponse.status} ${upsertResponse.statusText}`);
      }
      
      const result = await upsertResponse.json();
      console.log("Resposta do upsert REST:", result);
      
      return {
        status: "success",
        message: `Arquivo ${fileName} processado e enviado com sucesso via REST API`,
        detalhes: {
          chunks_criados: 1,
          namespace: ns,
          index: configService.getIndexName() || INDEX_NAME,
          arquivo: fileName
        }
      };
      
    } catch (error) {
      console.error("Erro REST API:", error);
      throw error;
    }
  },
  
  getSupportedFormats: (): string[] => {
    return [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'audio/mpeg', 
      'audio/wav', 
      'audio/ogg',
      'image/jpeg', 
      'image/png', 
      'text/plain',
      'text/x-python'
    ];
  },
  
  getFormatExtensions: (): Record<string, string> => {
    return {
      'application/pdf': '.pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
      'audio/mpeg': '.mp3',
      'audio/wav': '.wav',
      'audio/ogg': '.ogg',
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'text/plain': '.txt',
      'text/x-python': '.py'
    };
  },
  
  createUserFolder: (userId: string): string => {
    // In a real application, this would create a folder on the server
    // Here we just return the folder path
    return `/home/iapropria/${userId}`;
  }
};
