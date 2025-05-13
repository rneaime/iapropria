
import { INDEX_NAME } from '../config/env';
import { configService } from './configService';
import { toast } from '@/hooks/use-toast';

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

export const upsertService = {
  uploadFile: async (file: File, folderPath: string): Promise<string> => {
    try {
      // Em um aplicativo real, enviaríamos o arquivo para um endpoint do servidor
      // Simulando o upload bem-sucedido
      console.log(`Simulando upload do arquivo ${file.name} para ${folderPath}`);
      
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
      console.log(`Iniciando processamento do arquivo: ${filePath}`);
      console.log(`Namespace: ${namespace}`);
      console.log(`Metadados completos:`, metadata);
      
      // Em um aplicativo real, faríamos uma chamada à API que processa o arquivo
      // e envia para o Pinecone com os metadados fornecidos
      
      // Obter a chave da API Pinecone
      const apiKeys = configService.getApiKeys();
      const pineconeApiKey = apiKeys.PINECONE_API_KEY;
      
      if (!pineconeApiKey) {
        throw new Error("Chave da API Pinecone não encontrada. Configure em Parâmetros > API.");
      }
      
      // Simulando processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fileName = filePath.split('/').pop() || '';
      const extension = fileName.split('.').pop()?.toLowerCase();
      
      // Simulação de resposta com base na extensão
      const response: UpsertResponse = {
        status: "success",
        message: `Arquivo ${fileName} processado com sucesso e enviado para o Pinecone`,
        detalhes: {
          chunks_criados: Math.floor(Math.random() * 20) + 5,
          namespace: namespace,
          index: INDEX_NAME,
          arquivo: fileName
        }
      };
      
      // Adicionar detalhes específicos por tipo de arquivo
      if (extension === 'pdf' || extension === 'docx') {
        response.detalhes!.paginas_processadas = Math.floor(Math.random() * 10) + 1;
      }
      
      return response;
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      return {
        status: "error",
        message: `Erro ao processar arquivo: ${error instanceof Error ? error.message : String(error)}`,
        detalhes: {
          erro: error instanceof Error ? error.message : String(error)
        }
      };
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
  }
};
