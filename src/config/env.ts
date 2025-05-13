
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
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "llama-3.3-70b-versatile",
  "llama-3.3-70b-specdec",
  "llama-3.2-11b-vision-preview",
  "llama-3.2-1b-preview",
  "llama-3.2-3b-preview",
  "llama-3.2-90b-vision-preview",
  "llama-3.1-8b-instant",
  "llama-guard-3-8b",
  "llama3-70b-8192",
  "llama3-8b-8192",
  "deepseek-r1-distill-llama-70b",
  "deepseek-r1-distill-qwen-32b",
  "distil-whisper-large-v3-en",
  "gemma2-9b-it",
  "allam-2-7b",
  "mistral-saba-24b",
  "playai-tts",
  "playai-tts-arabic",
  "qwen-2.5-32b",
  "qwen-2.5-coder-32b",
  "qwen-qwq-32b",
  "whisper-large-v3",
  "whisper-large-v3-turbo"
];

export const INDEX_NAME = "iapropria2";
