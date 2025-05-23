
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aiService } from "@/services/aiService";
import { authService } from "@/services/authService";
import { ApiConnector } from "@/components/settings/ApiConnector";
import { WhatsappConnector } from "@/components/settings/WhatsappConnector";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { EditProfile } from "@/components/settings/EditProfile";
import { BrandSettings } from "@/components/settings/BrandSettings";

export function Settings() {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("geral");
  
  useEffect(() => {
    // Carregar lista de modelos
    const availableModels = aiService.getModelos();
    setModels(availableModels);
    
    // Carregar modelo preferido do usuário
    const user = authService.getUsuarioAtual();
    if (user) {
      const preferredModel = aiService.getModeloPreferido(user.id.toString());
      setSelectedModel(preferredModel);
    }
  }, []);
  
  const handleSaveModel = () => {
    if (!selectedModel) {
      toast({
        title: "Selecione um modelo",
        description: "Por favor, selecione um modelo de IA.",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    try {
      const user = authService.getUsuarioAtual();
      if (user) {
        aiService.salvarModeloPreferido(user.id.toString(), selectedModel);
        
        toast({
          title: "Modelo salvo",
          description: "Sua preferência de modelo foi salva com sucesso!"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar sua preferência de modelo.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configurações</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full bg-burgundy-light text-white">
          <TabsTrigger 
            value="geral" 
            className="text-white data-[state=active]:bg-burgundy data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-burgundy-dark"
          >
            Geral
          </TabsTrigger>
          <TabsTrigger 
            value="perfil" 
            className="text-white data-[state=active]:bg-burgundy data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-burgundy-dark"
          >
            Perfil
          </TabsTrigger>
          <TabsTrigger 
            value="api" 
            className="text-white data-[state=active]:bg-burgundy data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-burgundy-dark"
          >
            API
          </TabsTrigger>
          <TabsTrigger 
            value="whatsapp" 
            className="text-white data-[state=active]:bg-burgundy data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-burgundy-dark"
          >
            WhatsApp
          </TabsTrigger>
          <TabsTrigger 
            value="personalizacao" 
            className="text-white data-[state=active]:bg-burgundy data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-burgundy-dark"
          >
            Personalização
          </TabsTrigger>
          <TabsTrigger 
            value="marca" 
            className="text-white data-[state=active]:bg-burgundy data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-burgundy-dark"
          >
            Marca
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Modelo de IA</CardTitle>
              <CardDescription>
                Escolha o modelo de inteligência artificial que será usado para responder suas perguntas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={selectedModel}
                onValueChange={setSelectedModel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent>
                  {models.map(model => (
                    <SelectItem key={model} value={model}>
                      {model.split('/').pop()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleSaveModel} 
                disabled={saving || !selectedModel}
              >
                {saving ? "Salvando..." : "Salvar preferência"}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>APIs Conectadas</CardTitle>
              <CardDescription>
                Veja as APIs configuradas para esta aplicação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span className="font-medium">Groq API</span>
                  <span className="text-green-600">Conectado</span>
                </li>
                <Separator />
                <li className="flex items-center justify-between">
                  <span className="font-medium">Pinecone</span>
                  <span className="text-green-600">Conectado</span>
                </li>
                <Separator />
                <li className="flex items-center justify-between">
                  <span className="font-medium">PostgreSQL</span>
                  <span className="text-green-600">Conectado</span>
                </li>
                <Separator />
                <li className="flex items-center justify-between">
                  <span className="font-medium">Stability AI</span>
                  <span className="text-green-600">Conectado</span>
                </li>
                <Separator />
                <li className="flex items-center justify-between">
                  <span className="font-medium">OpenAI</span>
                  <span className="text-green-600">Conectado</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="perfil" className="pt-4">
          <EditProfile />
        </TabsContent>
        
        <TabsContent value="api" className="pt-4">
          <ApiConnector />
        </TabsContent>
        
        <TabsContent value="whatsapp" className="pt-4">
          <WhatsappConnector />
        </TabsContent>
        
        <TabsContent value="personalizacao" className="pt-4">
          <AppearanceSettings />
        </TabsContent>
        
        <TabsContent value="marca" className="pt-4">
          <BrandSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function IntegrationCard({ name, description, connected }: { name: string; description: string; connected: boolean }) {
  const handleConnect = () => {
    toast({
      title: connected ? `${name} desconectado` : `${name} conectado`,
      description: connected 
        ? `A integração com ${name} foi desconectada com sucesso.` 
        : `A integração com ${name} foi configurada com sucesso!`
    });
  };
  
  return (
    <Card>
      <CardContent className="p-4 flex flex-col space-y-3">
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button 
          size="sm" 
          variant={connected ? "destructive" : "outline"} 
          onClick={handleConnect}
        >
          {connected ? "Desconectar" : "Conectar"}
        </Button>
      </CardContent>
    </Card>
  );
}
