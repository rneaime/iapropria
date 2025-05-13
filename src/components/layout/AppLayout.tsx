
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { User, LogOut, PanelLeft, Menu } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { useIsMobile } from "@/hooks/use-mobile";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Sheet } from "@/components/ui/sheet";

interface AppLayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: (saveChatHistory?: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppLayout({ children, user, onLogout, activeTab, setActiveTab }: AppLayoutProps) {
  const [modelName, setModelName] = React.useState<string>("");
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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

  // Effect to scroll to top when activeTab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-burgundy-subtle flex flex-col w-full">
      {/* Header fixo */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <header className="bg-burgundy-light text-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {isMobile ? (
                <Sheet>
                  <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileSidebar />
                </Sheet>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleSidebar} 
                  className="text-white hover:bg-burgundy p-1"
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="font-bold text-xl">IAprópria</div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isMobile && (
                <div className="text-sm text-white/90 hidden md:block">
                  Modelo: <span className="font-medium">{modelName?.split('/').pop() || "Não selecionado"}</span>
                </div>
              )}
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
      </div>
      
      <div className="flex flex-1 pt-14">
        {/* Sidebar for desktop - fixed width and toggle visibility */}
        {!isMobile && sidebarOpen && (
          <div className="min-h-[calc(100vh-3.5rem)] bg-burgundy-light">
            <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} onClose={toggleSidebar} />
          </div>
        )}
        
        {/* Main content */}
        <div className="container mx-auto p-6 bg-burgundy-subtle flex-1">
          {children}
        </div>
      </div>
      
      <footer className="bg-burgundy text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} IAprópria. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
