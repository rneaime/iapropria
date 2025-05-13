
import React from 'react';
import {
  MessageSquare,
  History,
  Filter,
  Image,
  Upload,
  Settings,
  HelpCircle,
  X,
  ChevronLeft
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileSidebar?: boolean;
  onClose?: () => void;
}

export function AppSidebar({ 
  activeTab, 
  setActiveTab, 
  isMobileSidebar = false,
  onClose
}: AppSidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const menuItems = [
    {
      title: "Conversa IA",
      value: "conversa",
      icon: MessageSquare
    },
    {
      title: "Atendimento IA",
      value: "atendimento",
      icon: MessageSquare
    },
    {
      title: "Histórico",
      value: "historico",
      icon: History
    },
    {
      title: "Filtros",
      value: "filtros",
      icon: Filter
    },
    {
      title: "Gerar Imagem",
      value: "gerar-imagem",
      icon: Image
    },
    {
      title: "Upload",
      value: "enviar-arquivo",
      icon: Upload
    },
    {
      title: "Configurações",
      value: "parametros",
      icon: Settings
    },
    {
      title: "Ajuda",
      value: "ajuda",
      icon: HelpCircle
    }
  ];

  const handleMenuItemClick = (value: string) => {
    setActiveTab(value);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  // Versão mobile com Sheet
  if (isMobileSidebar) {
    return (
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="bg-burgundy-light text-white p-0 w-52 z-50 pt-16">
          <nav className="flex flex-col">
            {menuItems.map((item) => (
              <Button
                key={item.value}
                variant="ghost"
                className={`justify-start px-4 py-3 w-full ${
                  activeTab === item.value ? "bg-burgundy text-white" : "text-white hover:bg-burgundy-dark"
                }`}
                onClick={() => handleMenuItemClick(item.value)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                <span>{item.title}</span>
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  // Versão desktop - menu vertical à esquerda
  return (
    <div className="flex flex-col bg-burgundy-light text-white relative">
      {/* Close button */}
      {onClose && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute right-1 top-1 text-white p-0 h-6 w-6" 
          onClick={onClose}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      <SidebarMenu className="bg-burgundy-light text-white p-2 space-y-1 w-48">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.value}>
            <SidebarMenuButton
              isActive={activeTab === item.value}
              className={`w-full justify-start ${
                activeTab === item.value ? "bg-burgundy text-white" : "text-white hover:bg-burgundy-dark"
              }`}
              onClick={() => handleMenuItemClick(item.value)}
            >
              <item.icon className="h-4 w-4 mr-2" />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
