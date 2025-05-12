
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export function AppearanceSettings() {
  const [theme, setTheme] = useState<string>("light");
  const [fontSize, setFontSize] = useState<string>("medium");
  const [compactMode, setCompactMode] = useState<boolean>(false);
  const [burgundyTheme, setBurgundyTheme] = useState<boolean>(true); // Default to true
  const [saving, setSaving] = useState<boolean>(false);

  const handleSaveAppearance = () => {
    setSaving(true);
    
    // Em uma aplicação real, salvaríamos essas configurações
    setTimeout(() => {
      toast({
        title: "Aparência salva",
        description: "Suas preferências de aparência foram salvas com sucesso!"
      });
      setSaving(false);
    }, 1000);
  };

  useEffect(() => {
    // Apply burgundy theme by default when component mounts
    document.documentElement.style.setProperty('--primary', '91 25% 31%'); // #5b3746 in hsl
    document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%');
    
    // Watch for changes to the burgundyTheme state
    if (burgundyTheme) {
      document.documentElement.style.setProperty('--primary', '91 25% 31%'); // #5b3746 in hsl
      document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%');
    } else {
      document.documentElement.style.setProperty('--primary', '222.2 47.4% 11.2%'); // Original dark value
      document.documentElement.style.setProperty('--primary-foreground', '210 40% 98%');
    }
  }, [burgundyTheme]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalizar Aparência</CardTitle>
        <CardDescription>
          Ajuste a aparência da interface de acordo com suas preferências.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Tema</h3>
          <RadioGroup value={theme} onValueChange={setTheme} className="flex space-x-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light-theme" />
              <Label htmlFor="light-theme">Claro</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark-theme" />
              <Label htmlFor="dark-theme">Escuro</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system-theme" />
              <Label htmlFor="system-theme">Sistema</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Tamanho da Fonte</h3>
          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Pequena</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Modo Compacto</p>
            <p className="text-xs text-muted-foreground">
              Reduz o espaçamento entre elementos para mostrar mais conteúdo
            </p>
          </div>
          <Switch 
            checked={compactMode} 
            onCheckedChange={setCompactMode}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Tema Bordô (IAprópria)</p>
            <p className="text-xs text-muted-foreground">
              Utiliza o tema bordô (#5b3746) característico da IAprópria
            </p>
          </div>
          <Switch 
            checked={burgundyTheme} 
            onCheckedChange={setBurgundyTheme}
          />
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={handleSaveAppearance} 
            disabled={saving}
            className={`w-full ${burgundyTheme ? 'bg-[#5b3746] hover:bg-[#4a2c38]' : ''}`}
          >
            {saving ? "Salvando..." : "Salvar Personalização"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
