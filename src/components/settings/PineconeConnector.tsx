
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2, Database, ExternalLink } from "lucide-react";
import { pineconeService } from "@/services/pineconeService";
import { configService } from "@/services/configService";
import { toast } from "@/hooks/use-toast";

export function PineconeConnector() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  
  const apiKeys = configService.getApiKeys();
  const pineconeApiConfigured = !!apiKeys.PINECONE_API_KEY;
  const indexName = configService.getIndexName();
  
  // Verifica o status da conexão ao carregar o componente
  useEffect(() => {
    if (pineconeApiConfigured) {
      checkConnectionStatus();
    }
  }, [pineconeApiConfigured]);
  
  const checkConnectionStatus = async () => {
    setIsLoading(true);
    try {
      const result = await pineconeService.testConnection();
      setConnectionStatus(result ? 'success' : 'error');
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTestConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus('idle');
    
    try {
      const result = await pineconeService.testConnection();
      setConnectionStatus(result ? 'success' : 'error');
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      setConnectionStatus('error');
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleFetchDocuments = async () => {
    setIsConnecting(true);
    try {
      await pineconeService.buscarDocumentos("1", 1000);
      // O feedback será mostrado pelo toast no serviço
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      toast({
        title: "Erro ao buscar documentos",
        description: error instanceof Error ? error.message : "Erro desconhecido ao buscar documentos",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleOpenPineconeConsole = () => {
    window.open('https://app.pinecone.io', '_blank');
  };
  
  return (
    <Card>
      <CardHeader className="bg-burgundy text-white rounded-t-md">
        <CardTitle>Conexão Pinecone</CardTitle>
        <CardDescription className="text-white/80">
          Gerencie a conexão com o Pinecone Vector Database
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        <div className="bg-slate-50 p-4 rounded-md border">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Status da Conexão</p>
              <p className="text-sm text-muted-foreground">
                {pineconeApiConfigured 
                  ? `Configurado para índice: ${indexName || 'Não definido'}`
                  : 'Chave API não configurada'}
              </p>
            </div>
            
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestConnection}
                disabled={isConnecting || !pineconeApiConfigured || isLoading}
              >
                {(isConnecting || isLoading) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isLoading ? 'Verificando...' : 'Testar Conexão'}
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={handleFetchDocuments}
                disabled={isConnecting || !pineconeApiConfigured || isLoading}
              >
                {isConnecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Buscar Documentos
              </Button>
            </div>
          </div>
          
          {connectionStatus === 'success' && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Conexão com Pinecone estabelecida com sucesso!
              </AlertDescription>
            </Alert>
          )}
          
          {connectionStatus === 'error' && (
            <Alert className="mt-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Erro ao conectar com o Pinecone. Verifique as configurações e credenciais.
                <div className="mt-2 text-xs">
                  <p>Possíveis razões:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>API Key inválida ou expirada</li>
                    <li>Nome do índice incorreto</li>
                    <li>Limitações de CORS (tente usar um proxy ou backend)</li>
                    <li>Problemas de rede (firewall, VPN)</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="bg-slate-50 p-4 rounded-md border">
          <p className="font-medium mb-2">Configuração Pinecone</p>
          <ul className="space-y-1 text-sm">
            <li><strong>API Key:</strong> {pineconeApiConfigured ? '••••••••' : 'Não configurada'}</li>
            <li><strong>Índice:</strong> {indexName || 'Não definido'}</li>
            <li><strong>Namespace:</strong> 1 (fixo)</li>
            <li><strong>Dimensões do vetor:</strong> 384</li>
          </ul>
          
          <div className="mt-3 text-xs text-gray-500">
            <p>Para configurar a API key do Pinecone, use o gerenciador de APIs acima.</p>
          </div>
        </div>
        
        {!pineconeApiConfigured && (
          <div className="p-8 text-center border rounded-lg bg-blue-50">
            <Database className="w-12 h-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Configuração necessária</h3>
            <p className="text-muted-foreground mb-4">
              Para conectar-se ao Pinecone, adicione sua API Key e o nome do índice no gerenciador de APIs.
            </p>
            <Button className="mt-2" onClick={handleOpenPineconeConsole}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir Console do Pinecone
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t p-4">
        <div className="w-full text-sm text-gray-600">
          <p>
            Múltiplos métodos de conexão são tentados automaticamente.
            Se você estiver enfrentando problemas de CORS, considere implementar um backend para proxy das requisições.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
