
import React from 'react';
import { Button } from "@/components/ui/button";
import { User, LogOut } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
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
      {/* Header - Using a lighter burgundy */}
      <header className="bg-burgundy-light text-white shadow-md z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <SidebarTrigger className="text-white" />
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
      
      <div className="flex-1 flex">
        <SidebarProvider defaultOpen={true}>
          <div className="flex w-full">
            <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarInset className="flex flex-col flex-1">
              <main className="flex-1 p-6">{children}</main>
              <footer className="bg-burgundy text-white py-4">
                <div className="container mx-auto px-4 text-center text-sm">
                  &copy; {new Date().getFullYear()} IAprópria. Todos os direitos reservados.
                </div>
              </footer>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
