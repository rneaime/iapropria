
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { pineconeService } from "@/services/pineconeService";
import { Trash, Save, CheckSquare, Filter, RefreshCw, Database, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MetadataFilterProps {
  userId: string;
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

export function MetadataFilter({ userId, onFilterChange }: MetadataFilterProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  
  // Colunas para filtrar
  const filterColumns = [
    'nome_arquivo', 'categoria', 'departamento', 'responsavel', 'prioridade',
    'subcategoria', 'status', 'tipo_documento', 'data_processamento', 'filtro8', 'filtro9', 'filtro10'
  ];
  
  const fetchData = async (isRefresh: boolean = false) => {
    try {
      setConnectionError(null);
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Forçar a usar o namespace "1"
      console.log("Buscando documentos do Pinecone com namespace: 1");
      
      const docs = await pineconeService.buscarDocumentos("1");
      console.log("Documentos recebidos:", docs);
      
      // Verificar se são dados reais ou mockados
      setUsingMockData(docs.length > 0 && docs[0].id === "doc1");
      
      setDocuments(docs);
      
      // Carregar filtros salvos
      const savedFilters = pineconeService.getFiltros(userId);
      console.log("Filtros salvos:", savedFilters);
      setFilters(savedFilters);
      
      if (onFilterChange) {
        onFilterChange(savedFilters);
      }
      
      // Configurar os primeiros acordeões expandidos
      const columnsWithData = filterColumns.filter(column => 
        docs.some(doc => doc[column]));
      if (columnsWithData.length > 0) {
        setExpandedAccordions([columnsWithData[0]]);
      }
      
      if (isRefresh) {
        toast({
          title: docs.length > 0 ? "Dados atualizados" : "Sem documentos",
          description: docs.length > 0 
            ? `${docs.length} documentos ${usingMockData ? "de demonstração" : "reais"} carregados.`
            : "Nenhum documento encontrado no Pinecone."
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setConnectionError(error instanceof Error ? error.message : "Erro desconhecido de conexão");
      toast({
        title: "Erro de conexão",
        description: "Não foi possível carregar os metadados do Pinecone.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Carregar dados ao iniciar
  useEffect(() => {
    fetchData();
  }, [userId]);
  
  // Extrair valores únicos para cada coluna
  const getUniqueValues = (column: string) => {
    const values = new Set<string>();
    documents.forEach(doc => {
      if (doc[column]) {
        values.add(doc[column]);
      }
    });
    return Array.from(values).sort();
  };
  
  // Atualizar filtros quando um checkbox é alterado
  const handleFilterChange = (column: string, value: string, checked: boolean) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (!newFilters[column]) {
        newFilters[column] = [];
      }
      
      if (checked) {
        newFilters[column] = [...newFilters[column], value];
      } else {
        newFilters[column] = newFilters[column].filter(v => v !== value);
      }
      
      // Se o array ficou vazio, remova a chave
      if (newFilters[column].length === 0) {
        delete newFilters[column];
      }
      
      // Notificar mudanças
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
      
      return newFilters;
    });
  };
  
  // Selecionar ou desmarcar todos os valores de uma coluna
  const handleSelectAll = (column: string, selectAll: boolean) => {
    const uniqueValues = getUniqueValues(column);
    
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (selectAll) {
        newFilters[column] = [...uniqueValues];
      } else {
        delete newFilters[column];
      }
      
      // Notificar mudanças
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
      
      return newFilters;
    });
  };
  
  // Verificar se todos os valores de uma coluna estão selecionados
  const areAllSelected = (column: string) => {
    const uniqueValues = getUniqueValues(column);
    return uniqueValues.length > 0 && 
      filters[column]?.length === uniqueValues.length &&
      uniqueValues.every(value => filters[column]?.includes(value));
  };
  
  // Salvar filtros
  const handleSaveFilters = async () => {
    setSaving(true);
    try {
      await pineconeService.salvarFiltros(userId, filters);
      toast({
        title: "Filtros salvos",
        description: "Suas preferências de filtro foram salvas com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar os filtros.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Deletar filtros
  const handleDeleteFilters = async () => {
    setDeleting(true);
    try {
      await pineconeService.salvarFiltros(userId, {});
      setFilters({});
      
      if (onFilterChange) {
        onFilterChange({});
      }
      
      toast({
        title: "Filtros removidos",
        description: "Todos os filtros foram removidos com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover os filtros.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };
  
  // Gerenciar acordeões abertos
  const handleAccordionChange = (value: string) => {
    setExpandedAccordions(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };
  
  // Função para atualizar dados do Pinecone
  const handleRefresh = () => {
    fetchData(true);
  };
  
  // Renderização do componente de carregamento
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-lg font-medium">Conectando ao Pinecone...</p>
        <p className="text-sm text-muted-foreground mt-2">Buscando metadados no namespace 1</p>
      </div>
    );
  }
  
  // Contagem de documentos filtrados
  const getFilteredCount = () => {
    if (Object.keys(filters).length === 0) return documents.length;
    
    return documents.filter(doc => {
      for (const [column, values] of Object.entries(filters)) {
        if (!doc[column] || !values.includes(doc[column])) {
          return false;
        }
      }
      return true;
    }).length;
  };
  
  const filteredCount = getFilteredCount();
  const totalCount = documents.length;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Filter className="mr-2 h-5 w-5" /> 
            Filtros de Metadados
          </h2>
          <p className="text-sm text-muted-foreground mt-1 flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${usingMockData ? 'bg-amber-500' : 'bg-green-500'}`}></span>
            {usingMockData ? 'Dados de demonstração' : 'Dados reais do Pinecone'} • 
            {filteredCount} de {totalCount} documentos correspondem aos filtros atuais
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline"
            className="flex items-center"
          >
            <RefreshCw className={`mr-1.5 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? "Atualizando..." : "Atualizar dados"}
          </Button>
          <Button 
            onClick={handleSaveFilters} 
            disabled={saving}
            className="flex items-center"
          >
            <Save className="mr-1.5 h-4 w-4" />
            {saving ? "Salvando..." : "Salvar filtros"}
          </Button>
          <Button 
            onClick={handleDeleteFilters} 
            disabled={deleting}
            variant="destructive"
            className="flex items-center"
          >
            <Trash className="mr-1.5 h-4 w-4" />
            {deleting ? "Removendo..." : "Remover filtros"}
          </Button>
        </div>
      </div>
      
      {connectionError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de conexão</AlertTitle>
          <AlertDescription>
            Não foi possível conectar ao Pinecone: {connectionError}
            <Button variant="outline" size="sm" className="mt-2" onClick={handleRefresh}>
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {usingMockData && (
        <Alert className="mb-4 bg-amber-50 text-amber-900 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Dados de demonstração</AlertTitle>
          <AlertDescription>
            Estamos exibindo dados de demonstração. Clique em "Atualizar dados" para tentar conectar novamente ao Pinecone.
          </AlertDescription>
        </Alert>
      )}
      
      {documents.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-muted/10">
          <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Nenhum documento encontrado</p>
          <p className="text-muted-foreground mb-4">
            Não há documentos disponíveis para filtrar no namespace 1.
          </p>
          <Button className="mt-2" onClick={handleRefresh}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Tentar novamente
          </Button>
        </div>
      ) : (
        <Accordion 
          type="multiple" 
          value={expandedAccordions} 
          onValueChange={setExpandedAccordions} 
          className="w-full"
        >
          {filterColumns.map(column => {
            const uniqueValues = getUniqueValues(column);
            
            if (uniqueValues.length === 0) return null;
            const isAllSelected = areAllSelected(column);
            
            return (
              <AccordionItem key={column} value={column}>
                <AccordionTrigger 
                  onClick={(e) => {
                    e.preventDefault();
                    handleAccordionChange(column);
                  }}
                  className="capitalize"
                >
                  <div className="flex items-center">
                    {column} 
                    {filters[column]?.length ? (
                      <span className="ml-2 bg-primary text-primary-foreground text-xs font-medium rounded-full px-2 py-0.5">
                        {filters[column].length}
                      </span>
                    ) : null}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-4">
                    <div className="flex items-center space-x-2 mb-2 pb-1 border-b">
                      <Checkbox 
                        id={`select-all-${column}`}
                        checked={isAllSelected}
                        onCheckedChange={(checked) => 
                          handleSelectAll(column, checked === true)
                        }
                      />
                      <label 
                        htmlFor={`select-all-${column}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center">
                          <CheckSquare className="mr-1 h-4 w-4" />
                          Selecionar Todos
                        </div>
                      </label>
                    </div>
                    
                    {refreshing ? (
                      // Esqueletos de carregamento durante o refresh
                      Array(Math.min(5, uniqueValues.length || 3)).fill(0).map((_, idx) => (
                        <div key={`skeleton-${idx}`} className="flex items-center space-x-2 py-1">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-[120px]" />
                        </div>
                      ))
                    ) : (
                      // Valores reais
                      uniqueValues.map(value => (
                        <div key={`${column}-${value}`} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`${column}-${value}`}
                            checked={Boolean(filters[column]?.includes(value))}
                            onCheckedChange={(checked) => 
                              handleFilterChange(column, value, checked === true)
                            }
                          />
                          <label 
                            htmlFor={`${column}-${value}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {value}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
      
      <div className="flex justify-between pt-4">
        <Button 
          onClick={handleSaveFilters} 
          disabled={saving || documents.length === 0}
          className="w-[48%]"
        >
          <Save className="mr-1.5 h-4 w-4" />
          {saving ? "Salvando..." : "Salvar filtros"}
        </Button>
        <Button 
          onClick={handleDeleteFilters} 
          disabled={deleting || documents.length === 0}
          variant="destructive"
          className="w-[48%]"
        >
          <Trash className="mr-1.5 h-4 w-4" />
          {deleting ? "Removendo..." : "Remover filtros"}
        </Button>
      </div>
    </div>
  );
}
