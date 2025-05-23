
import { AI_MODELS } from '../config/env';
import { toast } from '../hooks/use-toast';
import { configService } from './configService';

interface Message {
  pergunta: string;
  resposta: string;
}

export const aiService = {
  sendMessage: async (message: string, history: Message[] = []): Promise<string> => {
    try {
      console.log("Enviando mensagem para o modelo de IA:", message);
      console.log("Histórico:", history);
      
      // Obter a chave da API e o modelo preferido
      const apiKeys = configService.getApiKeys();
      const groqApiKey = apiKeys.GROQ_API_KEY;
      
      if (!groqApiKey) {
        throw new Error("Chave da API GROQ não encontrada. Configure em Parâmetros > API.");
      }

      // Preparar o histórico de conversa para o formato do Groq
      const formattedHistory = history.flatMap(msg => [
        { role: 'user', content: msg.pergunta },
        { role: 'assistant', content: msg.resposta }
      ]);

      // Criar o corpo da requisição
      const requestBody = {
        model: "llama-3.1-8b-instant", // Modelo atualizado que existe no Groq
        messages: [
          ...formattedHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      };

      // Fazer a chamada para a API do Groq
      console.log("Enviando requisição para a API Groq com a chave:", groqApiKey.substring(0, 5) + "...");
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta do Groq:', errorData);
        
        if (errorData.error?.type === 'invalid_request_error' || 
            errorData.error?.message?.includes('API key')) {
          throw new Error(`Erro na API do Groq: Chave de API inválida. Por favor, verifique sua chave em Parâmetros > API.`);
        } else if (errorData.error?.type === 'authentication_error') {
          throw new Error(`Erro de autenticação na API do Groq. Por favor, verifique sua chave em Parâmetros > API.`);
        } else if (errorData.error?.message?.includes('does not exist')) {
          throw new Error(`Modelo não encontrado. Tente outro modelo em Parâmetros > Geral.`);
        } else {
          throw new Error(`Erro na API do Groq: ${errorData.error?.message || response.statusText}`);
        }
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Erro ao enviar mensagem para IA:", error);
      toast({
        title: "Erro no processamento",
        description: error instanceof Error ? error.message : "Não foi possível processar sua mensagem. Tente novamente.",
        variant: "destructive"
      });
      return "Erro ao processar mensagem. Por favor, verifique sua chave de API na seção Parâmetros > API e tente novamente.";
    }
  },
  
  generateImage: async (prompt: string, negativePrompt: string = "", aspectRatio: string = "1:1", outputFormat: string = "png"): Promise<string | null> => {
    try {
      console.log("Gerando imagem com prompt:", prompt);
      
      // Obter a chave da API
      const apiKeys = configService.getApiKeys();
      const stableApiKey = apiKeys.STABLE_DIFFUSION_API_KEY;
      
      if (!stableApiKey) {
        throw new Error("Chave da API Stable Diffusion não encontrada. Configure em Parâmetros > API.");
      }
      
      // Configuração para Stable Diffusion API
      const requestBody = {
        text_prompts: [
          {
            text: prompt,
            weight: 1
          },
          {
            text: negativePrompt,
            weight: -1
          }
        ],
        cfg_scale: 7,
        height: aspectRatio === "1:1" ? 512 : aspectRatio === "16:9" ? 512 : 512,
        width: aspectRatio === "1:1" ? 512 : aspectRatio === "16:9" ? 912 : 512,
        samples: 1,
        steps: 30,
      };
      
      // Fazer a chamada para a API do Stable Diffusion
      const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${stableApiKey}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erro na geração de imagem: ${error.message || response.statusText}`);
      }
      
      const responseData = await response.json();
      // A resposta contém um array de imagens codificadas em base64
      const base64Image = responseData.artifacts[0].base64;
      
      return `data:image/${outputFormat};base64,${base64Image}`;
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      toast({
        title: "Erro na geração de imagem",
        description: error instanceof Error ? error.message : "Não foi possível gerar a imagem solicitada.",
        variant: "destructive"
      });
      return null;
    }
  },
  
  getModelos: (): string[] => {
    return AI_MODELS;
  },
  
  salvarModeloPreferido: (userId: string, modelo: string): void => {
    localStorage.setItem(`modelo_preferido_${userId}`, modelo);
  },
  
  getModeloPreferido: (userId: string): string => {
    return localStorage.getItem(`modelo_preferido_${userId}`) || AI_MODELS[0];
  },
  
  validarGroqApiKey: async (apiKey: string): Promise<boolean> => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      return response.ok && Array.isArray(data.data);
    } catch (error) {
      console.error("Erro ao validar chave da API Groq:", error);
      return false;
    }
  }
};
