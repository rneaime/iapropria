
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ApiKeyManager } from './ApiKeyManager';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, CheckCircle, ExternalLink, HelpCircle, Info } from "lucide-react";
import { configService } from "@/services/configService";
import { PineconeConnector } from './PineconeConnector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ApiConnector() {
  const [showHelp, setShowHelp] = useState(false);
  const [activeTab, setActiveTab] = useState("gerenciador");
  
  const apiKeys = configService.getApiKeys();
  const groqApiConfigured = !!apiKeys.GROQ_API_KEY;
  
  const handleOpenGroqWebsite = () => {
    window.open('https://console.groq.com/keys', '_blank');
  };
  
  return (
    <Card>
      <CardHeader className="bg-burgundy text-white rounded-t-md">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Conectar API</CardTitle>
            <CardDescription className="text-white/80">
              Gerencie as conexões de API e integrações com serviços externos
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-burgundy-dark"
            onClick={() => setShowHelp(!showHelp)}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      
      {showHelp && (
        <div className="px-6 pt-4 pb-0">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle>Como configurar as APIs</AlertTitle>
            <AlertDescription className="text-sm">
              Para usar a funcionalidade de chat, é necessário configurar uma chave de API válida para o Groq. 
              Para usar o Pinecone, configure sua API key e o nome do índice.
            </AlertDescription>
          </Alert>
          
          <Accordion type="single" collapsible className="mt-3">
            <AccordionItem value="groq">
              <AccordionTrigger className="text-sm font-medium">
                Como obter uma chave de API do Groq?
              </AccordionTrigger>
              <AccordionContent>
                <ol className="text-sm space-y-2 list-decimal pl-5">
                  <li>Acesse o site do Groq em <a href="https://console.groq.com" target="_blank" className="text-blue-600 hover:underline">console.groq.com</a></li>
                  <li>Crie uma conta ou faça login</li>
                  <li>No painel de controle, vá para a seção "API Keys"</li>
                  <li>Clique em "Create API Key"</li>
                  <li>Copie a chave gerada e cole no campo "Chave da API" abaixo</li>
                </ol>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-3 text-xs" 
                  onClick={handleOpenGroqWebsite}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Ir para o console do Groq
                </Button>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="pinecone">
              <AccordionTrigger className="text-sm font-medium">
                Como configurar o Pinecone?
              </AccordionTrigger>
              <AccordionContent>
                <ol className="text-sm space-y-2 list-decimal pl-5">
                  <li>Acesse o console do Pinecone em <a href="https://app.pinecone.io" target="_blank" className="text-blue-600 hover:underline">app.pinecone.io</a></li>
                  <li>Faça login ou crie uma conta</li>
                  <li>No painel, encontre sua API key na seção "API Keys"</li>
                  <li>Copie a chave e configure-a como "Pinecone" no gerenciador de APIs</li>
                  <li>No campo "URL/Host", coloque o nome do seu índice (ex: "iapropria2")</li>
                </ol>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-3 text-xs" 
                  onClick={() => window.open('https://app.pinecone.io', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Ir para o console do Pinecone
                </Button>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="troubleshooting">
              <AccordionTrigger className="text-sm font-medium">
                Solucionando problemas com a API
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-sm">
                <p><strong>Problema:</strong> Mensagem de erro "API key is invalid"</p>
                <p><strong>Solução:</strong> Certifique-se de que copiou a chave corretamente, sem espaços extras.</p>
                
                <p><strong>Problema:</strong> Erros CORS ao conectar ao Pinecone</p>
                <p><strong>Solução:</strong> Verifique se o índice foi configurado corretamente e se sua API key tem permissões.</p>
                
                <p><strong>Problema:</strong> Outros erros de conexão</p>
                <p><strong>Solução:</strong> Utilize o botão "Testar conexão" para verificar se sua chave está funcionando corretamente.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
      
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="gerenciador" className="flex-1">Gerenciador de APIs</TabsTrigger>
            <TabsTrigger value="pinecone" className="flex-1">Pinecone</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gerenciador">
            <ApiKeyManager />
          </TabsContent>
          
          <TabsContent value="pinecone">
            <PineconeConnector />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t p-4 text-sm text-gray-600">
        {!groqApiConfigured ? (
          <div className="flex items-center text-amber-600">
            <AlertCircle className="h-4 w-4 mr-2" />
            A funcionalidade de chat requer uma chave de API Groq válida. Configure-a acima.
          </div>
        ) : (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-2" />
            API Groq configurada. A funcionalidade de chat está pronta para uso.
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
