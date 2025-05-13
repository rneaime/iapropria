
import React from 'react';
import { Button } from "@/components/ui/button";
import { User, LogOut } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { AppSidebar } from '@/components/layout/AppSidebar';

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
      try {
        const preferredModel = aiService.getModeloPreferido(user.id.toString());
        setModelName(preferredModel || "");
      } catch (error) {
        console.error("Error getting preferred model:", error);
        setModelName("");
      }
    }
  }, [user]);
  
  return (
    <div className="min-h-screen bg-burgundy-subtle flex flex-col">
      {/* Header e Menu fixos */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Header */}
        <header className="bg-burgundy-light text-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="font-bold text-xl">IAprópria</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-white/90 hidden md:block">
                Modelo: <span className="font-medium">{modelName?.split('/').pop() || "Não selecionado"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-white/90" />
                <span className="font-medium">{user?.nome || "Usuário"}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onLogout(true)} className="text-white hover:bg-burgundy">
                <LogOut className="h-4 w-4 mr-1" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </header>
        
        {/* Navigation */}
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* Conteúdo principal com margem superior para não ficar abaixo do header fixo */}
      <main className="flex-1 p-6 mt-32">{children}</main>
      
      <footer className="bg-burgundy text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} IAprópria. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
