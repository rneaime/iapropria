
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileList } from './FileList';
import { UpsertForm } from './UpsertForm';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { authService } from '@/services/authService';
import { Loader2 } from "lucide-react";

interface UploadFormProps {
  userId?: string;
}

export function UploadForm({ userId = "1" }: UploadFormProps) {
  // Fixed folder path
  const folderPath = `/home/iapropria/${userId}`;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<{id: string, name: string, path: string} | null>(null);
  
  const handleFileUpload = () => {
    if (!selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Selecione um arquivo para upload",
        variant: "destructive"
      });
      return;
    }
    
    // Simulação de upload
    setIsUploading(true);
    
    // Em um aplicativo real, isso seria uma chamada à API para upload
    setTimeout(() => {
      console.log(`Arquivo ${selectedFile.name} enviado para ${folderPath}`);
      
      toast({
        title: "Arquivo enviado",
        description: `${selectedFile.name} foi enviado com sucesso!`,
      });
      
      // Salvar informações do arquivo para uso no UpsertForm
      const newFile = {
        id: String(Date.now()),
        name: selectedFile.name,
        path: `${folderPath}/${selectedFile.name}`
      };
      setUploadedFile(newFile);
      
      setSelectedFile(null);
      setIsUploading(false);
      
      // Limpar input de arquivo
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }, 1500);
  };
  
  const isValidFileType = (file: File) => {
    const allowedTypes = [
      "application/pdf", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "audio/mpeg", 
      "audio/wav", 
      "audio/ogg",
      "image/jpeg", 
      "image/png", 
      "text/plain",
      "text/x-python"
    ];
    
    console.log("Verificando tipo de arquivo:", file.type);
    return allowedTypes.includes(file.type);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gerenciamento de Arquivos</h2>
      
      <Accordion type="single" collapsible className="w-full" defaultValue="folder-config">
        <AccordionItem value="folder-config">
          <AccordionTrigger>Informações da Pasta</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Pasta de Armazenamento</CardTitle>
                <CardDescription>
                  Seus arquivos serão armazenados neste local
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Caminho da pasta"
                      value={folderPath}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <FileList folderPath={folderPath} />
              </CardFooter>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Accordion type="single" collapsible className="w-full" defaultValue="upload">
        <AccordionItem value="upload">
          <AccordionTrigger>Upload de Arquivos</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Fazer o Upload Aqui</CardTitle>
                <CardDescription>
                  Formatos suportados: pdf, docx, xlsx, pptx, mp3, wav, ogg, jpg, jpeg, png, txt, py
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    id="file-input"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (isValidFileType(file)) {
                          console.log("Arquivo válido selecionado:", file.name);
                          setSelectedFile(file);
                        } else {
                          console.error("Formato de arquivo inválido:", file.type);
                          toast({
                            title: "Formato de arquivo inválido",
                            description: "O formato do arquivo selecionado não é suportado.",
                            variant: "destructive"
                          });
                          e.target.value = "";
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleFileUpload} 
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isUploading ? "Enviando..." : "Enviar Arquivo"}
                </Button>
              </CardFooter>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Accordion type="single" collapsible className="w-full" defaultValue="upsert">
        <AccordionItem value="upsert">
          <AccordionTrigger>Processamento de Arquivos (Upsert)</AccordionTrigger>
          <AccordionContent>
            <UpsertForm 
              userId={userId} 
              folderPath={folderPath} 
              uploadedFile={uploadedFile}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
