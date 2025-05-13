
// Configurações de ambiente e APIs
// Estes valores seriam normalmente carregados de variáveis de ambiente no servidor
// Para o frontend, precisamos usar uma abordagem mais segura em produção

export const API_KEYS = {
  GROQ_API_KEY: "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",
  PINECONE_API_KEY: "pcsk_4zrKpG_F4sPWk56q3BYjkcGTYVaW7g9rTTuyH8hGYV17pSStUWjQcE6zrEh2mL9LMQ6GN6",
  OPENAI_API_KEY: "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",
  STABLE_DIFFUSION_API_KEY: "sk-Iltwz46Pw0UtA5oloJTaJzSDDfKOdCUMNkXHdd6slRF9158j",
};

export const DB_CONFIG = {
  HOST: "69.62.95.133",
  USER: "postgres",
  PASSWORD: "$Uce$$o_@1",
  NAME: "postgres",
  PORT: "5432",
};

// Exportações adicionais para compatibilidade com os arquivos de banco de dados
export const DB_HOST = DB_CONFIG.HOST;
export const DB_PORT = parseInt(DB_CONFIG.PORT);
export const DB_USER = DB_CONFIG.USER;
export const DB_PASSWORD = DB_CONFIG.PASSWORD;
export const DB_NAME = DB_CONFIG.NAME;

export const AI_MODELS = [
  "llama-3.1-8b-instant",
  "llama-2-70b-chat",
  "llama-3.1-70b-versatile",
  "mixtral-8x7b-32768",
  "gemma-7b-it",
  "claude-3-haiku-20240307",
  "claude-3-sonnet-20240229",
  "claude-3-opus-20240229",
  "gemini-1.0-pro",
  "command-r",
  "command-r-plus"
];

export const INDEX_NAME = "iapropria2";
