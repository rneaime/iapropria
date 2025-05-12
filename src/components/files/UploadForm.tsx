
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
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

interface UploadFormProps {
  userId?: string;
}

export function UploadForm({ userId = "1" }: UploadFormProps) {
  const [folderPath, setFolderPath] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFolderSave = () => {
    // In a real app, this would call an API to save the folder path
    toast({
      title: "Pasta configurada",
      description: `Caminho da pasta salvo: ${folderPath}`,
    });
  };
  
  const handleFileUpload = () => {
    if (!selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Selecione um arquivo para upload",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would call an API to upload the file
    toast({
      title: "Arquivo enviado",
      description: `${selectedFile.name} foi enviado com sucesso!`,
    });
    
    setSelectedFile(null);
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
    
    return allowedTypes.includes(file.type);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gerenciamento de Arquivos</h2>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="arquivos-salvos">
          <AccordionTrigger>Arquivos Salvos Temporário</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Configuração da Pasta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Caminho da pasta"
                      value={folderPath}
                      onChange={(e) => setFolderPath(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleFolderSave}>Salvar pasta</Button>
                </div>
              </CardContent>
              <CardFooter>
                {folderPath && (
                  <FileList folderPath={folderPath} />
                )}
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
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (isValidFileType(file)) {
                        setSelectedFile(file);
                      } else {
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
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleFileUpload} 
                  disabled={!selectedFile || !folderPath}
                >
                  Enviar Arquivo
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
            <UpsertForm userId={userId} folderPath={folderPath} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
