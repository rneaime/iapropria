
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { ChatInterface } from "@/components/chat/ChatInterface";

export function HelpChat() {
  const [messages, setMessages] = useState<Array<{ content: string, sender: 'user' | 'assistant' }>>([
    {
      content: 'Olá! Sou o assistente da IAprópria. Como posso ajudá-lo hoje?',
      sender: 'assistant'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    
    try {
      // Em um ambiente real, aqui seria feita a chamada para a API
      // que processaria a pergunta usando o prompt_ajuda.py
      // Por enquanto, vamos simular uma resposta após um delay
      
      setTimeout(() => {
        const assistantMessage = {
          content: generateResponse(message),
          sender: 'assistant' as const
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível processar sua mensagem."
      });
      setIsLoading(false);
    }
  };
  
  // Função para gerar respostas simuladas (será substituída pela integração real)
  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('como fazer upload')) {
      return "Para fazer upload de arquivos, navegue até a opção 'Enviar Arquivo' no menu lateral. Você poderá selecionar arquivos do seu computador e adicionar metadados importantes para categorização.";
    } else if (lowerQuestion.includes('filtro') || lowerQuestion.includes('filtrar')) {
      return "Os filtros de metadados podem ser acessados através da opção 'Parâmetros' no menu. Selecione os valores desejados para refinar as consultas à base de conhecimento.";
    } else if (lowerQuestion.includes('conectar') || lowerQuestion.includes('api')) {
      return "Para conectar APIs, acesse a opção 'Conectar API' no menu. Você precisará fornecer o nome da API, chave (API Key), segredo (Secret) e URL base.";
    } else if (lowerQuestion.includes('whatsapp')) {
      return "A conexão com WhatsApp é feita através do menu 'Conectar WhatsApp'. Insira seu token e número de telefone para ativar a integração.";
    } else if (lowerQuestion.includes('cadastro') || lowerQuestion.includes('editar perfil')) {
      return "Você pode editar seu perfil e informações de cadastro na opção 'Editar Cadastro' no menu lateral.";
    } else if (lowerQuestion.includes('personalizar') || lowerQuestion.includes('logo') || lowerQuestion.includes('tema')) {
      return "Para personalizar sua interface, incluindo logo e nome da empresa, acesse a opção 'Personalizar' no menu lateral.";
    } else {
      return "Entendi sua pergunta. Para obter mais informações sobre este tópico, recomendo consultar nossa documentação completa ou entrar em contato com o suporte técnico através do e-mail suporte@iapropria.com";
    }
  };
  
  return (
    <div className="h-[400px]">
      <ChatInterface
        title="Assistente de Ajuda IAprópria"
        initialMessages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder="Digite sua pergunta..."
      />
    </div>
  );
}
