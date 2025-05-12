
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BadgeCheck, CheckCircle } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  secret?: string;
  url?: string;
  status: 'connected' | 'disconnected';
  type: 'api' | 'database';
}

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Groq API",
      key: "gsk_abc123def456...",
      status: 'connected',
      type: 'api'
    },
    {
      id: "2",
      name: "Pinecone",
      key: "pc_abc123def456...",
      status: 'connected',
      type: 'api'
    },
    {
      id: "3",
      name: "PostgreSQL",
      key: "DB_USER=postgres",
      secret: "DB_PASSWORD=******",
      url: "localhost:5432/iapropria",
      status: 'connected',
      type: 'database'
    }
  ]);
  const [selectedApi, setSelectedApi] = useState<string>('');
  const [apiName, setApiName] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [apiSecret, setApiSecret] = useState<string>('');
  const [apiUrl, setApiUrl] = useState<string>('');
  const [apiType, setApiType] = useState<'api' | 'database'>('api');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Carregar os detalhes da API selecionada
  useEffect(() => {
    if (selectedApi) {
      const api = apiKeys.find(api => api.id === selectedApi);
      if (api) {
        setApiName(api.name);
        setApiKey(api.key);
        setApiSecret(api.secret || '');
        setApiUrl(api.url || '');
        setApiType(api.type);
        setIsEditing(true);
      }
    } else {
      resetForm();
    }
  }, [selectedApi, apiKeys]);

  const resetForm = () => {
    setApiName('');
    setApiKey('');
    setApiSecret('');
    setApiUrl('');
    setApiType('api');
    setIsEditing(false);
    setSelectedApi('');
  };

  const handleSave = () => {
    if (!apiName || !apiKey) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nome da API e chave são obrigatórios."
      });
      return;
    }

    setIsConnecting(true);
    
    // Simulação de conexão
    setTimeout(() => {
      if (isEditing) {
        // Editar API existente
        setApiKeys(prevKeys => prevKeys.map(api => 
          api.id === selectedApi ? 
          { ...api, name: apiName, key: apiKey, secret: apiSecret, url: apiUrl, type: apiType, status: 'connected' } : 
          api
        ));
      } else {
        // Adicionar nova API
        setApiKeys(prevKeys => [
          ...prevKeys, 
          {
            id: Date.now().toString(),
            name: apiName,
            key: apiKey,
            secret: apiSecret || undefined,
            url: apiUrl || undefined,
            type: apiType,
            status: 'connected'
          }
        ]);
      }

      toast({
        title: "Conexão bem-sucedida",
        description: `A ${apiType === 'api' ? 'API' : 'banco de dados'} "${apiName}" foi ${isEditing ? 'atualizada' : 'adicionada'} com sucesso!`,
      });

      resetForm();
      setIsConnecting(false);
    }, 1500);
  };

  const handleDelete = (id: string) => {
    setApiKeys(prevKeys => prevKeys.filter(api => api.id !== id));
    
    if (selectedApi === id) {
      resetForm();
    }

    toast({
      title: "API removida",
      description: "A conexão foi removida com sucesso."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Conexões de API e Banco de Dados</CardTitle>
          <CardDescription>
            Gerencie suas chaves de API e conexões com bancos de dados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Conexões ativas</h3>
              <div className="space-y-3">
                {apiKeys.map(api => (
                  <div key={api.id} className="flex items-center justify-between p-3 border rounded-md bg-background">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1.5 rounded-full ${api.status === 'connected' ? 'bg-green-100' : 'bg-amber-100'}`}>
                        <CheckCircle className={`h-4 w-4 ${api.status === 'connected' ? 'text-green-600' : 'text-amber-600'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{api.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {api.type === 'api' ? 'API Key' : 'Banco de dados'} • 
                          <span className={api.status === 'connected' ? 'text-green-600' : 'text-amber-600'}>
                            {' '}{api.status === 'connected' ? 'Conectado' : 'Desconectado'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedApi(api.id)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(api.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium mb-4">
              {isEditing ? 'Editar conexão' : 'Adicionar nova conexão'}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="api-name">Nome da conexão</Label>
                  <Input
                    id="api-name"
                    value={apiName}
                    onChange={(e) => setApiName(e.target.value)}
                    placeholder="Ex: Groq API, PostgreSQL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-type">Tipo de conexão</Label>
                  <Select
                    value={apiType}
                    onValueChange={(value) => setApiType(value as 'api' | 'database')}
                  >
                    <SelectTrigger id="api-type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="database">Banco de dados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">{apiType === 'api' ? 'Chave da API' : 'Nome de usuário/Conexão'}</Label>
                <Input
                  id="api-key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={apiType === 'api' ? "Chave da API" : "DB_USER=username"}
                />
              </div>
              
              {apiType === 'database' && (
                <div className="space-y-2">
                  <Label htmlFor="api-secret">Senha do banco de dados</Label>
                  <Input
                    id="api-secret"
                    type="password"
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                    placeholder="DB_PASSWORD=******"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="api-url">URL/Host</Label>
                <Input
                  id="api-url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder={apiType === 'api' ? "URL da API (opcional)" : "host:port/database"}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                {isEditing && (
                  <Button
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancelar
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  disabled={isConnecting || !apiName || !apiKey}
                >
                  {isConnecting ? "Conectando..." : isEditing ? "Salvar alterações" : "Conectar"}
                </Button>
              </div>
            </div>
          </div>
          
          <Alert className="mt-4 bg-muted/50">
            <BadgeCheck className="h-4 w-4" />
            <AlertTitle>Status da conexão</AlertTitle>
            <AlertDescription>
              Todas as conexões estão ativas e funcionando normalmente.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
