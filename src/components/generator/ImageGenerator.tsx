
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [imageSize, setImageSize] = useState<string>("512x512");
  const [steps, setSteps] = useState<number>(30);
  const [guidanceScale, setGuidanceScale] = useState<number>(7.5);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const imageSizes = ["256x256", "512x512", "768x768", "1024x1024"];
  
  const handleGenerateImage = () => {
    if (!prompt) {
      toast({
        title: "Prompt vazio",
        description: "O prompt não pode estar vazio.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    // In a real app, this would call an API to generate the image
    setTimeout(() => {
      // Mock generated image with a placeholder
      setGeneratedImage("https://via.placeholder.com/512x512?text=Generated+Image");
      setIsGenerating(false);
      
      toast({
        title: "Imagem gerada",
        description: "Sua imagem foi gerada com sucesso!",
      });
    }, 2000);
  };
  
  const handleDownloadImage = () => {
    if (!generatedImage) return;
    
    // In a real app, this would trigger a file download
    toast({
      title: "Imagem salva",
      description: "Imagem foi salva na sua galeria.",
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gerador de Imagens</h2>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Gerador de Imagens Simples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium mb-1">
                  Descreva a imagem que deseja criar
                </label>
                <Textarea
                  id="prompt"
                  placeholder="Ex: Um gato laranja dormindo em uma cesta azul, luz do sol entrando pela janela"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="image-size" className="block text-sm font-medium mb-1">
                  Tamanho da imagem
                </label>
                <select
                  id="image-size"
                  className="w-full p-2 border rounded"
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value)}
                >
                  {imageSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerateImage}
                disabled={isGenerating || !prompt}
              >
                {isGenerating ? "Gerando..." : "Gerar Imagem"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Opções Avançadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="prompt-advanced" className="block text-sm font-medium mb-1">
                  Prompt Detalhado
                </label>
                <Textarea
                  id="prompt-advanced"
                  placeholder="Descreva com detalhes a imagem que deseja criar..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="negative-prompt" className="block text-sm font-medium mb-1">
                  Prompt Negativo (o que não incluir na imagem)
                </label>
                <Textarea
                  id="negative-prompt"
                  placeholder="Ex: deformado, ruim, borrado, pixelado, baixa qualidade"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  rows={2}
                />
              </div>
              
              <div>
                <label htmlFor="image-size-advanced" className="block text-sm font-medium mb-1">
                  Tamanho da imagem
                </label>
                <select
                  id="image-size-advanced"
                  className="w-full p-2 border rounded"
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value)}
                >
                  {imageSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Passos de geração: {steps}
                </label>
                <Slider
                  value={[steps]}
                  min={10}
                  max={50}
                  step={1}
                  onValueChange={(value) => setSteps(value[0])}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Escala de orientação: {guidanceScale.toFixed(1)}
                </label>
                <Slider
                  value={[guidanceScale]}
                  min={1}
                  max={20}
                  step={0.1}
                  onValueChange={(value) => setGuidanceScale(value[0])}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerateImage}
                disabled={isGenerating || !prompt}
              >
                {isGenerating ? "Gerando..." : "Gerar Imagem"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {generatedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Imagem Gerada</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <img 
              src={generatedImage} 
              alt="Imagem gerada" 
              className="max-w-full h-auto border rounded"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleDownloadImage}>
              Baixar Imagem
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
