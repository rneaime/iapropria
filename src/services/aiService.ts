
import { API_KEYS, AI_MODELS } from '../config/env';
import { toast } from '../components/ui/use-toast';

interface Message {
  pergunta: string;
  resposta: string;
}

export const aiService = {
  sendMessage: async (message: string, history: Message[] = []): Promise<string> => {
    try {
      console.log("Enviando mensagem para o modelo de IA:", message);
      console.log("Histórico:", history);
      
      // Em uma aplicação real, esta seria uma chamada a uma API como GROQ ou OpenAI
      // Simulando uma resposta após um pequeno delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return `Esta é uma resposta simulada para: "${message}". Em uma aplicação real, esta resposta viria de um modelo de IA como ${AI_MODELS[0]}.`;
    } catch (error) {
      console.error("Erro ao enviar mensagem para IA:", error);
      toast({
        title: "Erro no processamento",
        description: "Não foi possível processar sua mensagem. Tente novamente.",
        variant: "destructive"
      });
      return "Erro ao processar mensagem. Por favor, tente novamente.";
    }
  },
  
  generateImage: async (prompt: string, negativePrompt: string = "", aspectRatio: string = "1:1", outputFormat: string = "png"): Promise<string | null> => {
    try {
      console.log("Gerando imagem com prompt:", prompt);
      
      // Em uma aplicação real, esta seria uma chamada a uma API como Stable Diffusion
      // Simulando uma resposta após um pequeno delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulando uma imagem de retorno (URL de placeholder)
      return "https://via.placeholder.com/512";
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      toast({
        title: "Erro na geração de imagem",
        description: "Não foi possível gerar a imagem solicitada.",
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
  }
};
