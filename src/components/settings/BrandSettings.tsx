
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function BrandSettings() {
  const [siteName, setSiteName] = useState('IAprópria');
  const [tabName, setTabName] = useState('IAprópria');
  const [siteLogo, setSiteLogo] = useState<File | null>(null);
  const [tabLogo, setTabLogo] = useState<File | null>(null);
  const [siteLogoPreview, setSiteLogoPreview] = useState<string | null>(null);
  const [tabLogoPreview, setTabLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [logoPosition, setLogoPosition] = useState<'lado' | 'topo'>('lado');
  
  const handleSiteLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSiteLogo(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSiteLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleTabLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTabLogo(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setTabLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveSettings = () => {
    setSaving(true);
    
    // Em uma aplicação real, enviaríamos estas informações para o servidor
    setTimeout(() => {
      // Simular atualização do título da página
      document.title = tabName;
      
      toast({
        title: "Personalização salva",
        description: "Suas configurações de marca foram salvas com sucesso!"
      });
      setSaving(false);
    }, 1500);
  };

  // Exemplo de como o logo e nome da empresa apareceriam
  const LogoPreview = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Pré-visualização</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`flex ${logoPosition === 'lado' ? 'flex-row items-center' : 'flex-col items-center'} space-x-2`}>
          {siteLogoPreview && (
            <div className={`${logoPosition === 'lado' ? 'h-10 w-10' : 'h-16 w-16 mb-2'}`}>
              <img 
                src={siteLogoPreview} 
                alt="Logo Preview" 
                className="h-full w-full object-contain"
              />
            </div>
          )}
          <span className="text-lg font-medium">{siteName || 'IAprópria'}</span>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalização da Marca</CardTitle>
        <CardDescription>
          Configure o nome e o logotipo do site para personalizar sua experiência.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="site-name">Nome da Empresa</Label>
          <Input 
            id="site-name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="Nome da empresa"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="site-logo">Logo da Empresa</Label>
          <div className="flex items-center space-x-4">
            <Input 
              id="site-logo"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleSiteLogoChange}
              className="max-w-xs"
            />
            {siteLogoPreview && (
              <div className="h-12 w-12">
                <img 
                  src={siteLogoPreview} 
                  alt="Logo Preview" 
                  className="h-full w-full object-contain"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Recomendado: imagem quadrada de pelo menos 100x100 pixels em formato PNG ou JPG.
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Posição do logo</p>
            <p className="text-xs text-muted-foreground">
              Exibir o logo ao lado ou acima do nome da empresa
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Topo</span>
            <Switch 
              checked={logoPosition === 'lado'} 
              onCheckedChange={(checked) => setLogoPosition(checked ? 'lado' : 'topo')}
            />
            <span className="text-sm">Lado</span>
          </div>
        </div>
        
        <LogoPreview />
        
        <div className="space-y-2">
          <Label htmlFor="tab-name">Nome da Aba do Navegador</Label>
          <Input 
            id="tab-name"
            value={tabName}
            onChange={(e) => setTabName(e.target.value)}
            placeholder="Nome da aba"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tab-logo">Logo da Aba (Favicon)</Label>
          <div className="flex items-center space-x-4">
            <Input 
              id="tab-logo"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleTabLogoChange}
              className="max-w-xs"
            />
            {tabLogoPreview && (
              <div className="h-6 w-6">
                <img 
                  src={tabLogoPreview} 
                  alt="Favicon Preview" 
                  className="h-full w-full object-contain"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Recomendado: imagem quadrada de 32x32 ou 16x16 pixels em formato PNG.
          </p>
        </div>
        
        <Button 
          onClick={handleSaveSettings} 
          disabled={saving}
          className="w-full"
        >
          {saving ? "Salvando..." : "Salvar Personalização"}
        </Button>
      </CardContent>
    </Card>
  );
}
