
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Settings() {
  const [selectedModel, setSelectedModel] = useState<string>("meta-llama/llama-4-scout-17b-16e-instruct");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    "categoria": ["jurídico", "financeiro"],
    "tipo_documento": ["contrato", "relatório"]
  });
  
  const availableFilters = {
    "categoria": ["jurídico", "financeiro", "administrativo", "técnico"],
    "tipo_documento": ["contrato", "relatório", "nota", "apresentação"],
    "confidencialidade": ["público", "interno", "confidencial", "secreto"]
  };
  
  const models = [
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "claude-3.5-sonnet",
    "claude-3-opus",
    "claude-3-sonnet",
    "gpt-4o",
    "gpt-4"
  ];
  
  const handleSaveModel = () => {
    toast({
      title: "Modelo alterado",
      description: `Novo modelo selecionado: ${selectedModel}`
    });
  };
  
  const handleSaveFilters = () => {
    toast({
      title: "Filtros salvos",
      description: "Seus filtros foram atualizados com sucesso!"
    });
  };
  
  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters(prev => {
      const updated = { ...prev };
      if (!updated[category]) {
        updated[category] = [value];
      } else if (updated[category].includes(value)) {
        updated[category] = updated[category].filter(v => v !== value);
        if (updated[category].length === 0) {
          delete updated[category];
        }
      } else {
        updated[category] = [...updated[category], value];
      }
      return updated;
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Parâmetros</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Modelo</CardTitle>
          <CardDescription>Escolha o modelo de IA para usar nas consultas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um modelo" />
            </SelectTrigger>
            <SelectContent>
              {models.map(model => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={handleSaveModel}>Salvar Modelo</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Busca</CardTitle>
          <CardDescription>Configure os filtros para as buscas na base de conhecimento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(availableFilters).map(([category, values]) => (
            <div key={category} className="space-y-2">
              <h3 className="font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
              <div className="grid grid-cols-2 gap-2">
                {values.map(value => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${category}-${value}`} 
                      checked={selectedFilters[category]?.includes(value) || false}
                      onCheckedChange={() => toggleFilter(category, value)}
                    />
                    <label htmlFor={`${category}-${value}`}>{value}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <Button onClick={handleSaveFilters}>Salvar Filtros</Button>
        </CardContent>
      </Card>
    </div>
  );
}
