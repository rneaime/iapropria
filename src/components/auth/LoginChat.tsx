
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

export function LoginChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      content: 'Olá! Sou o assistente da IAprópria. Como posso ajudá-lo antes do login?'
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
    
    if (lowerQuestion.includes('cadastro') || lowerQuestion.includes('criar conta')) {
      return "Para criar uma conta, clique no botão 'Criar conta' abaixo do formulário de login. Você precisará fornecer seu nome, email e criar uma senha.";
    } else if (lowerQuestion.includes('esqueci') || lowerQuestion.includes('senha') || lowerQuestion.includes('recuperar')) {
      return "Se esqueceu sua senha, clique em 'Esqueci minha senha' abaixo do formulário de login e siga as instruções para recuperá-la.";
    } else if (lowerQuestion.includes('login') || lowerQuestion.includes('entrar')) {
      return "Para fazer login, basta informar seu email e senha registrados e clicar no botão 'Entrar'. Se não possui uma conta, pode criá-la clicando em 'Criar conta'.";
    } else if (lowerQuestion.includes('funcionalidade') || lowerQuestion.includes('o que pode fazer') || lowerQuestion.includes('recursos')) {
      return "A IAprópria oferece diversos recursos como processamento de documentos, geração de imagens com IA, conversação inteligente e muito mais. Após o login você poderá explorar todas essas funcionalidades.";
    } else {
      return "Para mais informações sobre este assunto, recomendo fazer login para acessar nossa documentação completa ou entrar em contato com o suporte técnico através do e-mail suporte@iapropria.com";
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Card className="w-full mt-6">
      <CardHeader className="bg-burgundy text-white rounded-t-md">
        <CardTitle>Assistente IA</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col h-[300px]">
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
