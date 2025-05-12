
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  secret: string;
  url: string;
}

export function ApiConnector() {
  const [activeTab, setActiveTab] = useState('register');
  const [apiName, setApiName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Mock data for demo purposes - in a real app this would come from a database
  const [userApis, setUserApis] = useState<ApiKey[]>([
    { id: '1', name: 'Groq API', key: 'gsk_xxxxx', secret: 'secret_xxxxx', url: 'https://api.groq.com' },
    { id: '2', name: 'Pinecone API', key: 'pcsk_xxxxx', secret: 'secret_xxxxx', url: 'https://api.pinecone.io' }
  ]);
  
  const handleSaveApiKey = () => {
    if (!apiName || !apiKey) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome da API e Chave da API são campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    
    setTimeout(() => {
      if (editingId) {
        // Update existing API
        setUserApis(userApis.map(api => 
          api.id === editingId 
            ? { id: api.id, name: apiName, key: apiKey, secret: apiSecret, url: apiUrl }
            : api
        ));
        setEditingId(null);
      } else {
        // Create new API
        const newApi = {
          id: Date.now().toString(),
          name: apiName,
          key: apiKey,
          secret: apiSecret,
          url: apiUrl
        };
        setUserApis([...userApis, newApi]);
      }
      
      // Reset form
      setApiName('');
      setApiKey('');
      setApiSecret('');
      setApiUrl('');
      
      toast({
        title: editingId ? "API Atualizada" : "API Registrada",
        description: editingId 
          ? "As informações da API foram atualizadas com sucesso!"
          : "A nova API foi registrada com sucesso!"
      });
      setSaving(false);
      setActiveTab('list');
    }, 1000);
  };
  
  const handleEditApi = (api: ApiKey) => {
    setApiName(api.name);
    setApiKey(api.key);
    setApiSecret(api.secret);
    setApiUrl(api.url);
    setEditingId(api.id);
    setActiveTab('register');
  };
  
  const handleDeleteApi = (id: string) => {
    setUserApis(userApis.filter(api => api.id !== id));
    toast({
      title: "API Removida",
      description: "A API foi removida com sucesso!"
    });
  };
  
  const handleCancelEdit = () => {
    setApiName('');
    setApiKey('');
    setApiSecret('');
    setApiUrl('');
    setEditingId(null);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar APIs</CardTitle>
        <CardDescription>
          Cadastre e gerencie suas chaves de API para conexão com serviços externos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="register">{editingId ? 'Editar API' : 'Cadastrar API'}</TabsTrigger>
            <TabsTrigger value="list">Listar APIs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="register" className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="api-name" className="text-sm font-medium">Nome da API*</label>
              <Input 
                id="api-name"
                value={apiName}
                onChange={(e) => setApiName(e.target.value)}
                placeholder="Ex: Groq API"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="api-key" className="text-sm font-medium">Chave da API*</label>
              <Input 
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_xxxxx"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="api-secret" className="text-sm font-medium">Segredo da API</label>
              <Input 
                id="api-secret"
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="secret_xxxxx"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="api-url" className="text-sm font-medium">URL da API</label>
              <Input 
                id="api-url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.exemplo.com"
              />
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button 
                onClick={handleSaveApiKey} 
                disabled={saving}
                className="flex-1"
              >
                {saving ? "Salvando..." : editingId ? "Atualizar API" : "Cadastrar API"}
              </Button>
              
              {editingId && (
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="list">
            {userApis.length > 0 ? (
              <ScrollArea className="h-72">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Chave</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead className="w-24">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userApis.map((api) => (
                      <TableRow key={api.id}>
                        <TableCell className="font-medium">{api.name}</TableCell>
                        <TableCell>{api.key.substring(0, 3)}•••••{api.key.substring(api.key.length - 3)}</TableCell>
                        <TableCell className="truncate max-w-[150px]">{api.url}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditApi(api)}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteApi(api.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                Nenhuma API cadastrada ainda.
              </div>
            )}
            
            <Button 
              variant="default" 
              className="w-full mt-4"
              onClick={() => setActiveTab('register')}
            >
              Cadastrar Nova API
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
