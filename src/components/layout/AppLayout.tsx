
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, LogOut, Settings, MessageSquare, Image, Upload, Trash, Filter, History, HelpCircle, Link, Phone } from 'lucide-react';
import { aiService } from '@/services/aiService';

interface AppLayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: (saveChatHistory?: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppLayout({ children, user, onLogout, activeTab, setActiveTab }: AppLayoutProps) {
  const [modelName, setModelName] = React.useState<string>("");
  
  React.useEffect(() => {
    if (user?.id) {
      const preferredModel = aiService.getModeloPreferido(user.id.toString());
      setModelName(preferredModel);
    }
  }, [user]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="font-bold text-xl text-primary">IAprópria</div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground hidden md:block">
              Modelo: <span className="font-medium">{modelName.split('/').pop() || "Não selecionado"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{user?.nome || "Usuário"}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onLogout(true)}>
              <LogOut className="h-4 w-4 mr-1" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto py-0">
              <TabsTrigger value="atendimento" className="py-3">
                <MessageSquare className="h-4 w-4 mr-2" />
                Atendimento IA
              </TabsTrigger>
              <TabsTrigger value="conversa" className="py-3">
                <MessageSquare className="h-4 w-4 mr-2" />
                Conversa IA
              </TabsTrigger>
              <TabsTrigger value="historico" className="py-3">
                <History className="h-4 w-4 mr-2" />
                Histórico
              </TabsTrigger>
              <TabsTrigger value="filtros" className="py-3">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </TabsTrigger>
              <TabsTrigger value="gerar-imagem" className="py-3">
                <Image className="h-4 w-4 mr-2" />
                Gerar Imagem
              </TabsTrigger>
              <TabsTrigger value="enviar-arquivo" className="py-3">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="deletar-arquivo" className="py-3">
                <Trash className="h-4 w-4 mr-2" />
                Deletar
              </TabsTrigger>
              <TabsTrigger value="parametros" className="py-3">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </TabsTrigger>
              <TabsTrigger value="ajuda" className="py-3">
                <HelpCircle className="h-4 w-4 mr-2" />
                Ajuda
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 py-6">{children}</main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} IAprópria. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
