
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { pineconeService } from "@/services/pineconeService";
import { configService } from "@/services/configService";

export function PineconeConnector() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const apiKeys = configService.getApiKeys();
  const pineconeApiConfigured = !!apiKeys.PINECONE_API_KEY;
  const indexName = configService.getIndexName();
  
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
    } finally {
      setIsConnecting(false);
    }
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
                disabled={isConnecting || !pineconeApiConfigured}
              >
                {isConnecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Testar Conexão
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={handleFetchDocuments}
                disabled={isConnecting || !pineconeApiConfigured}
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
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t p-4">
        <div className="w-full text-sm text-gray-600">
          <p>
            A biblioteca @pinecone-database/pinecone está sendo utilizada para conexão.
            Caso ocorram problemas, o sistema tentará métodos alternativos via REST API.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
