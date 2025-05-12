
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { AppLayout } from '@/components/layout/AppLayout';
import { MessageList } from '@/components/chat/MessageList';
import { UploadForm } from '@/components/files/UploadForm';
import { FileList } from '@/components/files/FileList';
import { Settings } from '@/components/settings/Settings';
import { ImageGenerator } from '@/components/generator/ImageGenerator';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("atendimento");
  const [messages, setMessages] = useState<{pergunta: string; resposta: string}[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [urlMode, setUrlMode] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>("");
  
  // Mock authentication state - in a real app, this would come from an auth context
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState({ id: 1, name: "John Doe" });

  // Mock login function
  const handleLogin = (email: string, password: string) => {
    // In a real app, this would call an API
    setIsAuthenticated(true);
    setUser({ id: 1, name: "John Doe" });
    toast({
      title: "Login successful",
      description: "Welcome back!",
    });
  };

  // Mock logout function
  const handleLogout = (saveChatHistory: boolean = true) => {
    if (saveChatHistory) {
      // In a real app, this would call an API to save chat history
      toast({
        title: "Chat history saved",
        description: "Your conversation has been saved successfully.",
      });
    }
    setIsAuthenticated(false);
    setUser({ id: 0, name: "" });
  };

  // Mock chat function
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message to chat
    const newMessages = [...messages, { pergunta: inputValue, resposta: "" }];
    setMessages(newMessages);
    
    // Simulate API response
    setTimeout(() => {
      const response = `This is a simulated response to your question: "${inputValue}"`;
      const updatedMessages = [...newMessages];
      updatedMessages[updatedMessages.length - 1].resposta = response;
      setMessages(updatedMessages);
    }, 1000);
    
    setInputValue("");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin("user@example.com", "password"); }}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render main application if authenticated
  return (
    <AppLayout 
      user={user}
      onLogout={handleLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      <div className="container p-4">
        {activeTab === "atendimento" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Atendimento IA</h2>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => handleLogout(true)}>
                  Sair e Salvar Conversa
                </Button>
                <Button variant="outline" onClick={() => handleLogout(false)}>
                  Sair sem Salvar Conversa
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="url-checkbox" 
                checked={urlMode}
                onChange={(e) => setUrlMode(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="url-checkbox">Extrair informações de um ou mais links</label>
            </div>
            
            {urlMode && (
              <Input 
                placeholder="Digite os links desejados (separados por vírgula)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            )}
            
            <div className="border rounded-lg p-4">
              <Textarea 
                placeholder="Digite sua mensagem..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="mb-2"
                rows={3}
              />
              <Button onClick={handleSendMessage}>Enviar</Button>
            </div>
            
            <MessageList messages={messages} />
          </div>
        )}
        
        {activeTab === "conversa" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Conversa IA</h2>
            <div className="border rounded-lg p-4">
              <Textarea 
                placeholder="Digite sua mensagem..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="mb-2"
                rows={3}
              />
              <Button onClick={handleSendMessage}>Enviar</Button>
            </div>
            <MessageList messages={messages} />
          </div>
        )}
        
        {activeTab === "gerar-imagem" && <ImageGenerator />}
        
        {activeTab === "enviar-arquivo" && <UploadForm />}
        
        {activeTab === "deletar-arquivo" && <FileList />}
        
        {activeTab === "parametros" && <Settings />}
      </div>
    </AppLayout>
  );
};

export default Index;
