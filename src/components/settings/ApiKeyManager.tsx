
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BadgeCheck, CheckCircle, AlertCircle } from "lucide-react";
import { configService } from "@/services/configService";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  secret?: string;
  url?: string;
  status: 'connected' | 'disconnected' | 'error';
  type: 'api' | 'database';
}

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [selectedApi, setSelectedApi] = useState<string>('');
  const [apiName, setApiName] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [apiSecret, setApiSecret] = useState<string>('');
  const [apiUrl, setApiUrl] = useState<string>('');
  const [apiType, setApiType] = useState<'api' | 'database'>('api');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  // Carregar chaves salvas ao iniciar
  useEffect(() => {
    loadSavedKeys();
  }, []);

  const loadSavedKeys = () => {
    const savedKeys = configService.getApiKeys();
    const dbConfig = configService.getDbConfig();
    const indexName = configService.getIndexName();

    const keysArray: ApiKey[] = [];

    // Adicionar chaves de API
    if (savedKeys.GROQ_API_KEY) {
      keysArray.push({
        id: "groq",
        name: "Groq API",
        key: savedKeys.GROQ_API_KEY,
        status: 'connected',
        type: 'api'
      });
    }

    if (savedKeys.PINECONE_API_KEY) {
      keysArray.push({
        id: "pinecone",
        name: "Pinecone",
        key: savedKeys.PINECONE_API_KEY,
        url: indexName,
        status: 'connected',
        type: 'api'
      });
    }

    if (savedKeys.OPENAI_API_KEY) {
      keysArray.push({
        id: "openai",
        name: "OpenAI",
        key: savedKeys.OPENAI_API_KEY,
        status: 'connected',
        type: 'api'
      });
    }

    if (savedKeys.STABLE_DIFFUSION_API_KEY) {
      keysArray.push({
        id: "stability",
        name: "Stability AI",
        key: savedKeys.STABLE_DIFFUSION_API_KEY,
        status: 'connected',
        type: 'api'
      });
    }

    // Adicionar configuração do banco de dados
    keysArray.push({
      id: "postgres",
      name: "PostgreSQL",
      key: `${dbConfig.USER}@${dbConfig.HOST}`,
      secret: dbConfig.PASSWORD,
      url: `${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.NAME}`,
      status: 'connected',
      type: 'database'
    });

    setApiKeys(keysArray);
  };

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

  const testGroqApi = async () => {
    setIsTesting(true);
    
    try {
      // Testar se a chave da API Groq é válida
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data?.data) {
        toast({
          title: "Teste bem-sucedido",
          description: "A conexão com a API Groq está funcionando corretamente.",
        });
        
        // Atualizar status na lista local se estiver editando
        if (isEditing) {
          setApiKeys(prevKeys => prevKeys.map(key => 
            key.id === selectedApi ? { ...key, status: 'connected' } : key
          ));
        }
      } else {
        toast({
          variant: "destructive",
          title: "Teste falhou",
          description: data.error?.message || "A chave da API Groq parece ser inválida.",
        });
        
        // Atualizar status na lista local se estiver editando
        if (isEditing) {
          setApiKeys(prevKeys => prevKeys.map(key => 
            key.id === selectedApi ? { ...key, status: 'error' } : key
          ));
        }
      }
    } catch (error) {
      console.error("Erro ao testar a API do Groq:", error);
      toast({
        variant: "destructive",
        title: "Erro na conexão",
        description: "Não foi possível conectar ao serviço Groq. Verifique sua conexão de internet.",
      });
    } finally {
      setIsTesting(false);
    }
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
    
    try {
      // Salvar as chaves conforme o tipo de API
      if (apiType === 'api') {
        const currentKeys = configService.getApiKeys();
        let updatedKeys = { ...currentKeys };
        
        switch(apiName.toLowerCase()) {
          case 'groq api':
          case 'groq':
            updatedKeys.GROQ_API_KEY = apiKey;
            break;
          case 'pinecone':
            updatedKeys.PINECONE_API_KEY = apiKey;
            if (apiUrl) {
              configService.saveIndexName(apiUrl);
            }
            break;
          case 'openai':
            updatedKeys.OPENAI_API_KEY = apiKey;
            break;
          case 'stability ai':
          case 'stable diffusion':
            updatedKeys.STABLE_DIFFUSION_API_KEY = apiKey;
            break;
          default:
            // Caso genérico para outras APIs
            break;
        }

        configService.saveApiKeys(updatedKeys);
      } else if (apiType === 'database') {
        // Para banco de dados PostgreSQL
        const dbConfig = configService.getDbConfig();
        const newConfig = { ...dbConfig };
        
        // Extrair informações da entrada do usuário
        if (apiUrl) {
          const urlParts = apiUrl.split(':');
          const hostPart = urlParts[0];
          const remainingPart = urlParts[1] || '';
          const portDbParts = remainingPart.split('/');
          
          newConfig.HOST = hostPart;
          if (portDbParts[0]) newConfig.PORT = portDbParts[0];
          if (portDbParts[1]) newConfig.NAME = portDbParts[1];
        }
        
        // Extrair usuário da chave
        if (apiKey) {
          const userParts = apiKey.split('@');
          newConfig.USER = userParts[0];
        }
        
        // Definir senha
        if (apiSecret) {
          newConfig.PASSWORD = apiSecret;
        }
        
        configService.saveDbConfig(newConfig);
      }

      // Atualizar a lista de chaves salvas
      loadSavedKeys();

      toast({
        title: "Conexão bem-sucedida",
        description: `A ${apiType === 'api' ? 'API' : 'banco de dados'} "${apiName}" foi ${isEditing ? 'atualizada' : 'adicionada'} com sucesso!`,
      });

      resetForm();
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar a configuração."
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDelete = (id: string) => {
    const api = apiKeys.find(api => api.id === id);
    if (!api) return;

    try {
      if (api.type === 'api') {
        const currentKeys = configService.getApiKeys();
        let updatedKeys = { ...currentKeys };
        
        switch(api.name.toLowerCase()) {
          case 'groq api':
          case 'groq':
            updatedKeys.GROQ_API_KEY = '';
            break;
          case 'pinecone':
            updatedKeys.PINECONE_API_KEY = '';
            break;
          case 'openai':
            updatedKeys.OPENAI_API_KEY = '';
            break;
          case 'stability ai':
          case 'stable diffusion':
            updatedKeys.STABLE_DIFFUSION_API_KEY = '';
            break;
        }
        
        configService.saveApiKeys(updatedKeys);
      }

      // Remover da lista local
      setApiKeys(prevKeys => prevKeys.filter(api => api.id !== id));
      
      if (selectedApi === id) {
        resetForm();
      }

      toast({
        title: "API removida",
        description: "A conexão foi removida com sucesso."
      });
    } catch (error) {
      console.error("Erro ao remover conexão:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover a conexão."
      });
    }
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
                      <div className={`p-1.5 rounded-full ${
                        api.status === 'connected' ? 'bg-green-100' : 
                        api.status === 'error' ? 'bg-red-100' : 'bg-amber-100'
                      }`}>
                        {api.status === 'connected' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : api.status === 'error' ? (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{api.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {api.type === 'api' ? 'API Key' : 'Banco de dados'} • 
                          <span className={
                            api.status === 'connected' ? 'text-green-600' : 
                            api.status === 'error' ? 'text-red-600' : 'text-amber-600'
                          }>
                            {' '}{api.status === 'connected' ? 'Conectado' : 
                                  api.status === 'error' ? 'Erro' : 'Desconectado'}
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
                {apiType === 'api' && apiName.toLowerCase().includes('groq') && (
                  <Button
                    variant="outline"
                    onClick={testGroqApi}
                    disabled={isTesting || !apiKey}
                  >
                    {isTesting ? "Testando..." : "Testar conexão"}
                  </Button>
                )}
                
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
              {apiKeys.length > 0 
                ? apiKeys.some(key => key.status === 'error')
                  ? "Algumas conexões apresentam erro. Verifique as chaves e tente novamente."
                  : "Todas as conexões estão ativas e funcionando normalmente." 
                : "Nenhuma conexão configurada. Adicione suas chaves de API para começar."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
