
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function ApiConnector() {
  const [groqApiKey, setGroqApiKey] = useState('');
  const [pineconeApiKey, setPineconeApiKey] = useState('');
  const [openAiApiKey, setOpenAiApiKey] = useState('');
  const [stabAiApiKey, setStabAiApiKey] = useState('');
  const [saving, setSaving] = useState(false);
  
  const handleSaveApiKeys = () => {
    setSaving(true);
    
    // Em uma aplicação real, enviaríamos estas chaves para o backend
    // de forma segura, nunca armazenando no frontend
    setTimeout(() => {
      toast({
        title: "APIs Conectadas",
        description: "As chaves de API foram salvas com sucesso!"
      });
      setSaving(false);
    }, 1000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conectar APIs</CardTitle>
        <CardDescription>
          Configure suas chaves de API para conectar com os serviços externos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="groq-api" className="text-sm font-medium">Groq API Key</label>
          <Input 
            id="groq-api"
            type="password"
            placeholder="gsk_xxxxx"
            value={groqApiKey}
            onChange={(e) => setGroqApiKey(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="pinecone-api" className="text-sm font-medium">Pinecone API Key</label>
          <Input 
            id="pinecone-api"
            type="password"
            placeholder="pcsk_xxxxx"
            value={pineconeApiKey}
            onChange={(e) => setPineconeApiKey(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="openai-api" className="text-sm font-medium">OpenAI API Key</label>
          <Input 
            id="openai-api"
            type="password"
            placeholder="sk-xxxxx"
            value={openAiApiKey}
            onChange={(e) => setOpenAiApiKey(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="stability-api" className="text-sm font-medium">Stability AI API Key</label>
          <Input 
            id="stability-api"
            type="password"
            placeholder="sk-xxxxx"
            value={stabAiApiKey}
            onChange={(e) => setStabAiApiKey(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleSaveApiKeys} 
          disabled={saving}
          className="w-full"
        >
          {saving ? "Salvando..." : "Salvar Chaves de API"}
        </Button>
      </CardContent>
    </Card>
  );
}
