
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface Message {
  content: string;
  sender: 'user' | 'assistant';
}

export function HelpChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      content: 'Olá! Sou o assistente da IAprópria. Como posso ajudá-lo hoje?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Adicionar mensagem do usuário
    const userMessage: Message = {
      content: inputMessage,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Em um ambiente real, aqui seria feita a chamada para a API
      // que processaria a pergunta usando o prompt_ajuda.py
      // Por enquanto, vamos simular uma resposta após um delay
      
      setTimeout(() => {
        const assistantMessage: Message = {
          content: generateResponse(inputMessage),
          sender: 'assistant'
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
      
      setInputMessage('');
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
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="bg-burgundy text-white rounded-t-md">
        <CardTitle>Assistente de Ajuda IAprópria</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 ${
                  message.sender === 'user' ? 'ml-auto text-right' : ''
                }`}
              >
                <div 
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-burgundy text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.content}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.sender === 'user' ? 'Você' : 'Assistente'}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center mb-4">
                <div className="animate-pulse flex space-x-1">
                  <div className="h-2 w-2 bg-burgundy rounded-full"></div>
                  <div className="h-2 w-2 bg-burgundy rounded-full"></div>
                  <div className="h-2 w-2 bg-burgundy rounded-full"></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputMessage.trim()} 
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
