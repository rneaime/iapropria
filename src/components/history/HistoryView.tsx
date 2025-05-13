
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Download, Trash2 } from "lucide-react";

interface Message {
  pergunta: string;
  resposta: string;
  timestamp: string;
}

interface HistoryEntry {
  id: string;
  date: string;
  title: string;
  messages: Message[];
}

export function HistoryView({ userId }: { userId: string }) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Em uma aplicação real, buscaríamos o histórico da API
    setLoading(true);
    
    // Simulando dados
    setTimeout(() => {
      const mockHistory: HistoryEntry[] = [
        {
          id: "1",
          date: "2025-05-11",
          title: "Consulta sobre relatórios financeiros",
          messages: [
            { 
              pergunta: "Como faço para gerar um relatório financeiro?",
              resposta: "Para gerar um relatório financeiro, você pode acessar a seção 'Relatórios' no menu principal, selecionar o período desejado e clicar em 'Gerar Relatório'.",
              timestamp: "2025-05-11 14:23:15"
            },
            {
              pergunta: "Quais formatos de exportação estão disponíveis?",
              resposta: "Os formatos disponíveis para exportação são PDF, Excel e CSV.",
              timestamp: "2025-05-11 14:25:30"
            }
          ]
        },
        {
          id: "2",
          date: "2025-05-10",
          title: "Dúvidas sobre integração API",
          messages: [
            {
              pergunta: "Como integro minha aplicação com a API da IAprópria?",
              resposta: "Para integrar sua aplicação, você precisa obter uma chave de API nas configurações da sua conta e seguir a documentação disponível em nossa página de desenvolvedores.",
              timestamp: "2025-05-10 09:15:22"
            }
          ]
        }
      ];
      
      setHistory(mockHistory);
      setLoading(false);
    }, 1000);
  }, [userId]);

  const handleSelectEntry = (entry: HistoryEntry) => {
    setSelectedEntry(entry);
  };

  const handleDeleteEntry = (id: string) => {
    // Em uma aplicação real, enviaríamos uma requisição para deletar o histórico
    toast({
      title: "Histórico excluído",
      description: "O histórico selecionado foi excluído com sucesso."
    });
    
    setHistory(prevHistory => prevHistory.filter(entry => entry.id !== id));
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }
  };

  const handleExportEntry = (entry: HistoryEntry) => {
    // Em uma aplicação real, iríamos exportar o histórico
    toast({
      title: "Histórico exportado",
      description: "O histórico foi exportado com sucesso."
    });
  };

  // Determina a cor do item do menu com base no número de mensagens
  const getMenuItemColor = (messageCount: number) => {
    if (messageCount > 3) return "text-green-600 hover:text-green-700";
    if (messageCount > 1) return "text-blue-600 hover:text-blue-700";
    return "text-amber-600 hover:text-amber-700";
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8">Carregando histórico...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Histórico de Conversas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Histórico</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <ul className="space-y-3">
                  {history.map(entry => (
                    <li key={entry.id}>
                      <ContextMenu>
                        <ContextMenuTrigger>
                          <Button 
                            variant={selectedEntry?.id === entry.id ? "default" : "outline"} 
                            className="w-full justify-start text-left h-auto py-3"
                            onClick={() => handleSelectEntry(entry)}
                          >
                            <div>
                              <p className="font-medium">{entry.title}</p>
                              <p className="text-sm text-muted-foreground">{entry.date}</p>
                            </div>
                          </Button>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-48">
                          <ContextMenuItem 
                            onClick={() => handleExportEntry(entry)}
                            className={getMenuItemColor(entry.messages.length)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Exportar
                          </ContextMenuItem>
                          <ContextMenuItem 
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Nenhum histórico disponível.</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          {selectedEntry ? (
            <Card>
              <CardHeader className="flex flex-row justify-between items-start space-y-0">
                <CardTitle>
                  {selectedEntry.title}
                  <div className="text-sm text-muted-foreground font-normal mt-1">
                    {selectedEntry.date}
                  </div>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleExportEntry(selectedEntry)}>
                    <Download className="h-4 w-4 mr-1" /> Exportar
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteEntry(selectedEntry.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Excluir
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {selectedEntry.messages.map((message, index) => (
                    <div key={index} className="space-y-2">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-sm mb-1">Pergunta:</p>
                        <p>{message.pergunta}</p>
                        <p className="text-xs text-muted-foreground mt-2">{message.timestamp}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="font-medium text-sm mb-1">Resposta:</p>
                        <p>{message.resposta}</p>
                      </div>
                      {index < selectedEntry.messages.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Selecione um histórico para visualizar detalhes.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
