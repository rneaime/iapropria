
import React, { useState } from 'react';
import {
  MessageSquare,
  History,
  Filter,
  Image,
  Upload,
  Settings,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const menuItems = [
    {
      title: "Ajuda",
      value: "ajuda",
      icon: HelpCircle
    },
    {
      title: "Configurações",
      value: "parametros",
      icon: Settings
    },
    {
      title: "Upload",
      value: "enviar-arquivo",
      icon: Upload
    },
    {
      title: "Gerar Imagem",
      value: "gerar-imagem",
      icon: Image
    },
    {
      title: "Filtros",
      value: "filtros",
      icon: Filter
    },
    {
      title: "Histórico",
      value: "historico",
      icon: History
    },
    {
      title: "Conversa IA",
      value: "conversa",
      icon: MessageSquare
    },
    {
      title: "Atendimento IA",
      value: "atendimento",
      icon: MessageSquare
    }
  ];

  const handleMenuItemClick = (value: string) => {
    setActiveTab(value);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  // Versão mobile com menu em Sheet
  if (isMobile) {
    return (
      <div className="w-full bg-burgundy-light py-2 px-4 flex justify-end">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-burgundy-light text-white p-0 w-64 z-50">
            <div className="flex justify-end p-4">
              <Button variant="ghost" size="icon" className="text-white" onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col">
              {[...menuItems].reverse().map((item) => (
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
      </div>
    );
  }

  // Versão desktop com menu horizontal da direita para esquerda
  return (
    <NavigationMenu className="w-full justify-end px-4 py-2 bg-burgundy-light">
      <NavigationMenuList className="flex-row-reverse">
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.value}>
            <NavigationMenuLink 
              className={navigationMenuTriggerStyle() + (activeTab === item.value ? " bg-burgundy text-white" : "")}
              onClick={() => handleMenuItemClick(item.value)}
            >
              <item.icon className="h-4 w-4 mr-2" />
              <span>{item.title}</span>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
