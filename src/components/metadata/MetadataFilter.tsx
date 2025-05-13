
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
import { Trash, Save, CheckSquare } from "lucide-react";

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
  
  // Colunas para filtrar
  const filterColumns = [
    'nome_arquivo', 'categoria', 'departamento', 'responsavel', 'prioridade',
    'subcategoria', 'status', 'tipo_documento'
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Buscando documentos para Filtro de Metadados, userId:", userId);
        const docs = await pineconeService.buscarDocumentos(userId);
        console.log("Documentos recebidos:", docs);
        setDocuments(docs);
        
        // Carregar filtros salvos
        const savedFilters = pineconeService.getFiltros(userId);
        console.log("Filtros salvos:", savedFilters);
        setFilters(savedFilters);
        
        if (onFilterChange) {
          onFilterChange(savedFilters);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os metadados.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId, onFilterChange]);
  
  // Extrair valores únicos para cada coluna
  const getUniqueValues = (column: string) => {
    const values = new Set<string>();
    documents.forEach(doc => {
      if (doc[column]) {
        values.add(doc[column]);
      }
    });
    return Array.from(values);
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
  
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Filtros de Metadados</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={handleSaveFilters} 
            disabled={saving}
            className="flex items-center"
          >
            <Save className="mr-1 h-4 w-4" />
            {saving ? "Salvando..." : "Salvar filtros"}
          </Button>
          <Button 
            onClick={handleDeleteFilters} 
            disabled={deleting}
            variant="destructive"
            className="flex items-center"
          >
            <Trash className="mr-1 h-4 w-4" />
            {deleting ? "Removendo..." : "Remover filtros"}
          </Button>
        </div>
      </div>
      
      <Accordion type="multiple" className="w-full">
        {filterColumns.map(column => {
          const uniqueValues = getUniqueValues(column);
          
          if (uniqueValues.length === 0) return null;
          const isAllSelected = areAllSelected(column);
          
          return (
            <AccordionItem key={column} value={column}>
              <AccordionTrigger className="capitalize">
                <div className="flex items-center">
                  {column}
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
                      className="text-sm font-medium"
                    >
                      <div className="flex items-center">
                        <CheckSquare className="mr-1 h-4 w-4" />
                        Selecionar Todos
                      </div>
                    </label>
                  </div>
                  
                  {uniqueValues.map(value => (
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
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {value}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      
      <div className="flex justify-between pt-4">
        <Button 
          onClick={handleSaveFilters} 
          disabled={saving}
          className="w-[48%]"
        >
          <Save className="mr-1 h-4 w-4" />
          {saving ? "Salvando..." : "Salvar filtros"}
        </Button>
        <Button 
          onClick={handleDeleteFilters} 
          disabled={deleting}
          variant="destructive"
          className="w-[48%]"
        >
          <Trash className="mr-1 h-4 w-4" />
          {deleting ? "Removendo..." : "Remover filtros"}
        </Button>
      </div>
    </div>
  );
}
