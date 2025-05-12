
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  MessageCircle, 
  Upload, 
  Trash, 
  Settings, 
  Image,
  History, 
  Edit, 
  Link, 
  Phone, 
  Settings as Personalize,
  HelpCircle,
  LogOut
} from "lucide-react";

interface AppLayoutProps {
  user: { id: number; name: string };
  onLogout: (saveChatHistory?: boolean) => void;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: "atendimento", label: "Atendimento IA", icon: Home },
  { id: "conversa", label: "Conversa IA", icon: MessageCircle },
  { id: "gerar-imagem", label: "Gerar Imagem", icon: Image },
  { id: "enviar-arquivo", label: "Enviar Arquivo", icon: Upload },
  { id: "deletar-arquivo", label: "Deletar Arquivo", icon: Trash },
  { id: "parametros", label: "Parâmetros", icon: Settings },
  { id: "historico", label: "Histórico", icon: History },
  { id: "editar-cadastro", label: "Editar Cadastro", icon: Edit },
  { id: "conectar-api", label: "Conectar API", icon: Link },
  { id: "conectar-whatsapp", label: "Conectar Whatsapp", icon: Phone },
  { id: "personalizar", label: "Personalizar", icon: Personalize },
  { id: "ajuda", label: "Ajuda", icon: HelpCircle },
  { id: "sair", label: "Sair", icon: LogOut },
];

export function AppLayout({ children, user, onLogout, activeTab, setActiveTab }: AppLayoutProps) {
  const handleMenuItemClick = (id: string) => {
    if (id === "sair") {
      // Show logout confirmation
      if (window.confirm("Deseja salvar a conversa antes de sair?")) {
        onLogout(true);
      } else {
        onLogout(false);
      }
      return;
    }
    
    setActiveTab(id);
  };
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-muted border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-center mb-2">
            {/* Company logo placeholder */}
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {user.name.charAt(0)}
            </div>
          </div>
          <div className="text-center font-semibold">{user.name}</div>
        </div>
        
        <div className="flex-1 overflow-auto py-2">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeTab === item.id ? "bg-secondary" : ""
                )}
                onClick={() => handleMenuItemClick(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
