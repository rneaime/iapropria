
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
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";

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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton 
                    isActive={activeTab === item.value}
                    onClick={() => setActiveTab(item.value)}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
