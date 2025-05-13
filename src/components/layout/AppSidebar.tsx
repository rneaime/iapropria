
import React from 'react';
import {
  MessageSquare,
  History,
  Filter,
  Image,
  Upload,
  Settings,
  HelpCircle
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

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const menuItems = [
    {
      title: "Atendimento IA",
      value: "atendimento",
      icon: MessageSquare
    },
    {
      title: "Conversa IA",
      value: "conversa",
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

  return (
    <NavigationMenu className="w-full justify-start px-4 py-2 bg-burgundy-light">
      <NavigationMenuList>
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.value}>
            <NavigationMenuLink 
              className={navigationMenuTriggerStyle() + (activeTab === item.value ? " bg-burgundy text-white" : "")}
              onClick={() => setActiveTab(item.value)}
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
