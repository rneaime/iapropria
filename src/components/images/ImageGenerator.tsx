
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { aiService } from "@/services/aiService";
import { Download } from "lucide-react";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [outputFormat, setOutputFormat] = useState("png");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleGenerateImage = async () => {
    if (!prompt) {
      toast({
        title: "Prompt obrigatório",
        description: "Por favor, digite uma descrição para a imagem.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await aiService.generateImage(
        prompt,
        negativePrompt,
        aspectRatio,
        outputFormat
      );
      
      setImageUrl(result);
      
      if (!result) {
        toast({
          title: "Erro",
          description: "Não foi possível gerar a imagem. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar a imagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const downloadImage = () => {
    if (!imageUrl) return;
    
    // Criar um elemento <a> temporário
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `imagem-gerada.${outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gerador de Imagens</h2>
      
      <div className="grid gap-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-1">
            Prompt
          </label>
          <Input
            id="prompt"
            placeholder="Descreva a imagem que você deseja gerar..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="negative-prompt" className="block text-sm font-medium mb-1">
            Prompt Negativo (opcional)
          </label>
          <Input
            id="negative-prompt"
            placeholder="Descreva o que você não quer na imagem..."
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="aspect-ratio" className="block text-sm font-medium mb-1">
              Proporção da Imagem
            </label>
            <Select
              value={aspectRatio}
              onValueChange={setAspectRatio}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a proporção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">Quadrada (1:1)</SelectItem>
                <SelectItem value="16:9">Paisagem (16:9)</SelectItem>
                <SelectItem value="9:16">Retrato (9:16)</SelectItem>
                <SelectItem value="4:5">Instagram (4:5)</SelectItem>
                <SelectItem value="2:3">Vertical (2:3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="output-format" className="block text-sm font-medium mb-1">
              Formato da Imagem
            </label>
            <Select
              value={outputFormat}
              onValueChange={setOutputFormat}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          onClick={handleGenerateImage} 
          disabled={loading || !prompt}
          className="w-full"
        >
          {loading ? "Gerando imagem..." : "Gerar Imagem"}
        </Button>
      </div>
      
      {imageUrl && (
        <div className="mt-6 space-y-4">
          <div className="relative border rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt="Imagem gerada" 
              className="w-full h-auto object-contain"
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={downloadImage}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar Imagem
          </Button>
        </div>
      )}
    </div>
  );
}
