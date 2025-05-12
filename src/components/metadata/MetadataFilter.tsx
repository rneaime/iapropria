
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/components/ui/use-toast";
import { pineconeService } from "@/services/pineconeService";

interface MetadataFilterProps {
  userId: string;
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

export function MetadataFilter({ userId, onFilterChange }: MetadataFilterProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Colunas para filtrar
  const filterColumns = [
    'nome_arquivo', 'categoria', 'departamento', 'responsável', 'prioridade',
    'subcategoria', 'status', 'tipo_documento'
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docs = await pineconeService.buscarDocumentos(userId);
        setDocuments(docs);
        
        // Carregar filtros salvos
        const savedFilters = pineconeService.getFiltros(userId);
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
  
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Filtros de Metadados</h2>
      
      <Accordion type="multiple" className="w-full">
        {filterColumns.map(column => {
          const uniqueValues = getUniqueValues(column);
          
          if (uniqueValues.length === 0) return null;
          
          return (
            <AccordionItem key={column} value={column}>
              <AccordionTrigger className="capitalize">
                {column}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-4">
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
      
      <Button 
        onClick={handleSaveFilters} 
        disabled={saving}
        className="w-full"
      >
        {saving ? "Salvando..." : "Salvar filtros"}
      </Button>
    </div>
  );
}
