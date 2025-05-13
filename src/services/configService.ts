
import { API_KEYS, DB_CONFIG, INDEX_NAME } from '../config/env';
import { toast } from '../components/ui/use-toast';

// Interface para armazenar chaves de API no localStorage
interface StoredApiKeys {
  GROQ_API_KEY?: string;
  PINECONE_API_KEY?: string;
  OPENAI_API_KEY?: string;
  STABLE_DIFFUSION_API_KEY?: string;
}

// Interface para configuração do banco de dados
interface DbConfig {
  HOST: string;
  USER: string;
  PASSWORD: string;
  NAME: string;
  PORT: string;
}

export const configService = {
  // Obter chaves de API - primeiro tenta do localStorage, depois do env.ts
  getApiKeys: (): StoredApiKeys => {
    try {
      const storedKeysString = localStorage.getItem('api_keys');
      const storedKeys = storedKeysString ? JSON.parse(storedKeysString) : {};
      
      // Combina as chaves armazenadas com as chaves padrão
      return {
        GROQ_API_KEY: storedKeys.GROQ_API_KEY || API_KEYS.GROQ_API_KEY,
        PINECONE_API_KEY: storedKeys.PINECONE_API_KEY || API_KEYS.PINECONE_API_KEY,
        OPENAI_API_KEY: storedKeys.OPENAI_API_KEY || API_KEYS.OPENAI_API_KEY,
        STABLE_DIFFUSION_API_KEY: storedKeys.STABLE_DIFFUSION_API_KEY || API_KEYS.STABLE_DIFFUSION_API_KEY,
      };
    } catch (error) {
      console.error("Erro ao obter chaves de API:", error);
      return API_KEYS;
    }
  },
  
  // Salvar chaves de API no localStorage
  saveApiKeys: (keys: StoredApiKeys): boolean => {
    try {
      localStorage.setItem('api_keys', JSON.stringify(keys));
      return true;
    } catch (error) {
      console.error("Erro ao salvar chaves de API:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as chaves de API.",
        variant: "destructive"
      });
      return false;
    }
  },
  
  // Obter configuração do banco de dados
  getDbConfig: (): DbConfig => {
    try {
      const storedConfigString = localStorage.getItem('db_config');
      return storedConfigString ? JSON.parse(storedConfigString) : DB_CONFIG;
    } catch (error) {
      console.error("Erro ao obter configuração do banco de dados:", error);
      return DB_CONFIG;
    }
  },
  
  // Salvar configuração do banco de dados
  saveDbConfig: (config: DbConfig): boolean => {
    try {
      localStorage.setItem('db_config', JSON.stringify(config));
      return true;
    } catch (error) {
      console.error("Erro ao salvar configuração do banco de dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a configuração do banco de dados.",
        variant: "destructive"
      });
      return false;
    }
  },
  
  // Obter o nome do índice do Pinecone
  getIndexName: (): string => {
    return localStorage.getItem('pinecone_index') || INDEX_NAME;
  },
  
  // Salvar o nome do índice do Pinecone
  saveIndexName: (indexName: string): boolean => {
    try {
      localStorage.setItem('pinecone_index', indexName);
      return true;
    } catch (error) {
      console.error("Erro ao salvar nome do índice Pinecone:", error);
      return false;
    }
  }
};
