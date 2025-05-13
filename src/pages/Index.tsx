
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { AppLayout } from '@/components/layout/AppLayout';
import { UploadForm } from '@/components/files/UploadForm';
import { FileList } from '@/components/files/FileList';
import { Settings } from '@/components/settings/Settings';
import { ImageGenerator } from '@/components/images/ImageGenerator';
import { MetadataFilter } from '@/components/metadata/MetadataFilter';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { LoginChat } from '@/components/auth/LoginChat';
import { HistoryView } from '@/components/history/HistoryView';
import { HelpCenter } from '@/components/help/HelpCenter';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { authService } from '@/services/authService';
import { aiService } from '@/services/aiService';

interface Message {
  pergunta: string;
  resposta: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("atendimento");
  const [messages, setMessages] = useState<Message[]>([]);
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">("login");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Estado de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  
  // Estado para metadados e filtros
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  
  // Verificar autenticação ao carregar a página
  useEffect(() => {
    console.log("Verificando autenticação...");
    const currentUser = authService.getUsuarioAtual();
    if (currentUser) {
      console.log("Usuário autenticado:", currentUser);
      setIsAuthenticated(true);
      setUser(currentUser);
      setUserId(String(currentUser.id));
    } else {
      console.log("Nenhum usuário autenticado.");
    }
  }, []);
  
  // Funções de autenticação
  const handleLogin = () => {
    console.log("handleLogin chamado");
    const currentUser = authService.getUsuarioAtual();
    if (currentUser) {
      console.log("Usuário logado:", currentUser);
      setIsAuthenticated(true);
      setUser(currentUser);
      setUserId(String(currentUser.id));
    }
  };
  
  const handleLogout = (saveChatHistory: boolean = true) => {
    console.log("handleLogout chamado, salvando histórico:", saveChatHistory);
    if (saveChatHistory && messages.length > 0) {
      // Em uma aplicação real, aqui salvaríamos o histórico da conversa
      toast({
        title: "Histórico salvo",
        description: "Seu histórico de conversa foi salvo com sucesso."
      });
    }
    
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setUserId("");
  };
  
  // Função para lidar com envio de mensagens
  const handleSendMessage = async (message: string, urls?: string[]) => {
    setIsLoading(true);
    
    try {
      // Processar a resposta da IA
      let processedMessage = message;
      
      // Se houver URLs, adiciona as informações extraídas delas à mensagem
      if (urls && urls.length > 0) {
        processedMessage += "\n\nInformações extraídas dos links:";
        urls.forEach(url => {
          processedMessage += `\nLink: ${url}\nTítulo: Título simulado para ${url}\nConteúdo simulado do link...`;
        });
      }
      
      const response = await aiService.sendMessage(processedMessage, messages);
      
      // Atualizar a lista de mensagens
      setMessages(prevMessages => [
        ...prevMessages,
        { pergunta: message, resposta: response }
      ]);
    } catch (error) {
      console.error("Erro ao processar mensagem:", error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          pergunta: message, 
          resposta: "Erro ao processar mensagem. Por favor, tente novamente."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Se o usuário não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              {authMode === "register" ? "Cadastro" : authMode === "forgot" ? "Recuperação de Senha" : "Acesso"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {authMode === "login" && (
              <LoginForm 
                onLogin={handleLogin} 
                onForgotPassword={() => setAuthMode("forgot")} 
                onRegister={() => setAuthMode("register")}
              />
            )}
            
            {authMode === "register" && (
              <RegisterForm 
                onRegister={handleLogin} 
                onCancel={() => setAuthMode("login")}
              />
            )}
            
            {authMode === "forgot" && (
              <ForgotPasswordForm 
                onCancel={() => setAuthMode("login")}
              />
            )}
          </CardContent>
        </Card>
        
        <LoginChat />
      </div>
    );
  }

  console.log("Renderizando app após autenticação");

  // Converter mensagens para o formato padrão para o ChatInterface
  const standardMessages = messages.flatMap(msg => [
    { content: msg.pergunta, sender: 'user' as const },
    { content: msg.resposta, sender: 'assistant' as const }
  ]);

  // Adicionar mensagem inicial de boas-vindas se não houver mensagens
  const initialMessages = standardMessages.length === 0 
    ? [{ content: "Olá! Sou o assistente da IAprópria. Como posso ajudá-lo hoje?", sender: 'assistant' as const }]
    : standardMessages;

  // Se autenticado, mostrar a aplicação principal
  return (
    <AppLayout 
      user={user}
      onLogout={handleLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      <div className="h-full">
        {activeTab === "atendimento" && (
          <div className="space-y-4 h-full">
            <div className="h-[calc(100vh-200px)]">
              <ChatInterface
                initialMessages={initialMessages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                placeholder="Digite sua pergunta..."
                enableSearch={true}
              />
            </div>
          </div>
        )}
        
        {activeTab === "conversa" && (
          <div className="space-y-4 h-full">
            <div className="h-[calc(100vh-180px)]">
              <ChatInterface
                initialMessages={initialMessages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                placeholder="Digite sua pergunta..."
                enableSearch={true}
              />
            </div>
          </div>
        )}
        
        {activeTab === "historico" && (
          <HistoryView userId={userId} />
        )}
        
        {activeTab === "filtros" && (
          <MetadataFilter 
            userId={userId}
            onFilterChange={setActiveFilters}
          />
        )}
        
        {activeTab === "gerar-imagem" && <ImageGenerator />}
        
        {activeTab === "enviar-arquivo" && <UploadForm userId={userId} />}
        
        {activeTab === "parametros" && <Settings />}
        
        {activeTab === "ajuda" && <HelpCenter />}
      </div>
    </AppLayout>
  );
};

export default Index;
