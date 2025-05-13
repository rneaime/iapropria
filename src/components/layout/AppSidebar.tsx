
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
  
  // Use a default logo image
  const logoImage = "/placeholder.svg";

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
    // Scroll to top when changing tabs
    window.scrollTo(0, 0);
  };

  // Versão mobile com Sheet
  if (isMobileSidebar) {
    return (
      <div className="block">
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="text-white hover:bg-burgundy p-1">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-burgundy-light text-white p-0 w-52 z-50">
          {/* Logo space with image instead of text */}
          <div className="h-16 flex items-center justify-center border-b border-burgundy-dark mb-2">
            <div className="h-10 w-10">
              <img 
                src={logoImage} 
                alt="Logo" 
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          
          <nav className="flex flex-col">
            {menuItems.map((item) => (
              <Button
                key={item.value}
                variant="ghost"
                className={`justify-start px-4 py-3 w-full ${
                  activeTab === item.value 
                    ? "bg-burgundy text-gray-800" 
                    : "text-white hover:bg-burgundy-dark"
                }`}
                onClick={() => handleMenuItemClick(item.value)}
              >
                <item.icon className={`h-4 w-4 mr-2 ${activeTab === item.value ? "text-gray-800" : ""}`} />
                <span className={activeTab === item.value ? "text-gray-800" : ""}>{item.title}</span>
              </Button>
            ))}
          </nav>
        </SheetContent>
      </div>
    );
  }

  // Versão desktop - menu vertical à esquerda
  return (
    <div className="flex flex-col bg-burgundy-light text-white relative h-full">
      {/* Logo space with image instead of text */}
      <div className="h-16 flex items-center justify-center border-b border-burgundy-dark mb-2">
        <div className="h-10 w-10">
          <img 
            src={logoImage} 
            alt="Logo" 
            className="h-full w-full object-contain"
          />
        </div>
      </div>
      
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
                activeTab === item.value ? "bg-burgundy text-gray-800" : "text-white hover:bg-burgundy-dark"
              }`}
              onClick={() => handleMenuItemClick(item.value)}
            >
              <item.icon className={`h-4 w-4 mr-2 ${activeTab === item.value ? "text-gray-800" : ""}`} />
              <span className={activeTab === item.value ? "text-gray-800" : ""}>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
