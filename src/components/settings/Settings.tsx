
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { aiService } from "@/services/aiService";
import { authService } from "@/services/authService";

export function Settings() {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  
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
    </div>
  );
}
