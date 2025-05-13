
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { UpsertMetadata, upsertService } from '@/services/upsertService';
import { INDEX_NAME } from '@/config/env';
import { pineconeService } from '@/services/pineconeService';
import { toast } from '@/hooks/use-toast';

interface UpsertFormProps {
  userId: string;
  folderPath?: string;
  uploadedFile?: {id: string, name: string, path: string} | null;
}

export function UpsertForm({ 
  userId, 
  folderPath,
  uploadedFile
}: UpsertFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [savedFiles, setSavedFiles] = useState<{id: string, name: string, path: string}[]>([]);
  const [selectedSavedFile, setSelectedSavedFile] = useState<string>('');
  
  // Metadados para o upsert
  const [metadata, setMetadata] = useState<UpsertMetadata>({
    tipo_documento: '',
    departamento: '',
    categoria: '',
    subcategoria: '',
    responsavel: '',
    status: '',
    prioridade: '',
    filtro8: '',
    filtro9: '',
    filtro10: '',
  });
  
  // Carregar arquivos salvos quando o componente montar ou o folderPath mudar
  useEffect(() => {
    if (folderPath) {
      console.log("Carregando arquivos salvos do caminho:", folderPath);
      // Em um aplicativo real, isso seria uma chamada à API para listar os arquivos
      const mockFiles = [
        { id: '1', name: 'documento.pdf', path: `${folderPath}/documento.pdf` },
        { id: '2', name: 'image.jpg', path: `${folderPath}/image.jpg` },
        { id: '3', name: 'report.docx', path: `${folderPath}/report.docx` },
      ];
      
      setSavedFiles(mockFiles);
    }
  }, [folderPath]);
  
  // Detectar quando um novo arquivo é carregado pelo componente pai
  useEffect(() => {
    if (uploadedFile) {
      console.log("Arquivo carregado do UploadForm:", uploadedFile);
      
      // Adicionar à lista de arquivos se ainda não estiver
      setSavedFiles(prev => {
        const exists = prev.some(file => file.id === uploadedFile.id);
        if (!exists) {
          return [...prev, uploadedFile];
        }
        return prev;
      });
      
      // Selecionar automaticamente o arquivo enviado
      setSelectedSavedFile(uploadedFile.name);
    }
  }, [uploadedFile]);
  
  const handleMetadataChange = (field: keyof UpsertMetadata, value: string) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Selecione um arquivo para upload",
        variant: "destructive"
      });
      return;
    }
    
    if (!folderPath) {
      toast({
        title: "Caminho não definido",
        description: "Configure o caminho da pasta primeiro",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    try {
      console.log(`Iniciando upload do arquivo ${selectedFile.name} para ${folderPath}`);
      
      // Upload do arquivo
      const filePath = await upsertService.uploadFile(selectedFile, folderPath);
      console.log("Upload concluído. Caminho do arquivo:", filePath);
      
      toast({
        title: "Arquivo enviado",
        description: `${selectedFile.name} foi enviado com sucesso!`,
      });
      
      // Atualizar a lista de arquivos simulada
      const newFile = {
        id: String(Date.now()),
        name: selectedFile.name,
        path: filePath
      };
      
      setSavedFiles(prev => [...prev, newFile]);
      setSelectedSavedFile(newFile.name);
      setSelectedFile(null);
      
      // Limpar o input de arquivo
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error("Erro no upload:", error);
      toast({
        title: "Erro no upload",
        description: `Falha ao enviar o arquivo: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleProcessFile = async () => {
    if (!selectedSavedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Selecione um arquivo para processar",
        variant: "destructive"
      });
      return;
    }
    
    if (!metadata.tipo_documento) {
      toast({
        title: "Tipo de documento obrigatório",
        description: "Por favor, informe o tipo de documento",
        variant: "destructive"
      });
      return;
    }
    
    setProcessing(true);
    
    try {
      // Adicionar nome do arquivo e data aos metadados
      const filePath = savedFiles.find(f => f.name === selectedSavedFile)?.path || '';
      const fileName = selectedSavedFile;
      const updatedMetadata = {
        ...metadata,
        nome_arquivo: fileName,
        data_processamento: new Date().toISOString().split('T')[0]
      };
      
      console.log(`Processando arquivo ${filePath} com namespace ${userId} e metadados:`, updatedMetadata);
      
      const result = await upsertService.processFile(filePath, userId, updatedMetadata);
      console.log("Resultado do processamento:", result);
      
      if (result.status === "success") {
        toast({
          title: "Processamento concluído",
          description: result.message,
        });
      } else {
        toast({
          title: "Erro no processamento",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro no processamento:", error);
      toast({
        title: "Erro no processamento",
        description: `Falha ao processar o arquivo: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const isValidFileType = (file: File) => {
    const supportedFormats = upsertService.getSupportedFormats();
    console.log("Verificando formato do arquivo:", file.type);
    console.log("Formatos suportados:", supportedFormats);
    return supportedFormats.includes(file.type);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Upsert de Arquivo</h2>
      <p className="text-red-500">Depois que você enviou o arquivo é necessário fazer o upsert do arquivo</p>
      
      {/* Formulário de upload adicional (opcional, caso queira fazer upload diretamente aqui) */}
      <Card>
        <CardHeader>
          <CardTitle>Enviar Arquivo</CardTitle>
          <CardDescription>
            Se necessário, faça o upload de outro arquivo aqui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            id="file-upload"
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (isValidFileType(file)) {
                  setSelectedFile(file);
                  console.log("Arquivo selecionado:", file.name);
                } else {
                  console.error("Formato inválido:", file.type);
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
            disabled={!selectedFile || uploading || !folderPath}
          >
            {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {uploading ? "Enviando..." : "Enviar Arquivo"}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Processar Arquivo (Upsert)</CardTitle>
          <CardDescription>
            Selecione um arquivo e preencha os metadados para processá-lo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {folderPath ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Selecione um arquivo</label>
                <select
                  className="w-full p-2 border rounded"
                  value={selectedSavedFile}
                  onChange={(e) => setSelectedSavedFile(e.target.value)}
                >
                  <option value="">-- Selecione --</option>
                  {savedFiles.map(file => (
                    <option key={file.id} value={file.name}>
                      {file.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedSavedFile && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Index</label>
                      <Input 
                        value={INDEX_NAME}
                        disabled={true}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Namespace (User ID)</label>
                      <Input 
                        value={userId}
                        disabled={true}
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mt-4">Metadados</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de Documento*</label>
                      <Input 
                        value={metadata.tipo_documento}
                        onChange={(e) => handleMetadataChange('tipo_documento', e.target.value)}
                        placeholder="Tipo de documento"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Departamento</label>
                      <Input 
                        value={metadata.departamento}
                        onChange={(e) => handleMetadataChange('departamento', e.target.value)}
                        placeholder="Departamento"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Categoria</label>
                      <Input 
                        value={metadata.categoria}
                        onChange={(e) => handleMetadataChange('categoria', e.target.value)}
                        placeholder="Categoria"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Subcategoria</label>
                      <Input 
                        value={metadata.subcategoria}
                        onChange={(e) => handleMetadataChange('subcategoria', e.target.value)}
                        placeholder="Subcategoria"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Responsável</label>
                      <Input 
                        value={metadata.responsavel}
                        onChange={(e) => handleMetadataChange('responsavel', e.target.value)}
                        placeholder="Responsável"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <Input 
                        value={metadata.status}
                        onChange={(e) => handleMetadataChange('status', e.target.value)}
                        placeholder="Status"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Prioridade</label>
                      <Input 
                        value={metadata.prioridade}
                        onChange={(e) => handleMetadataChange('prioridade', e.target.value)}
                        placeholder="Prioridade"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Filtro 8</label>
                      <Input 
                        value={metadata.filtro8}
                        onChange={(e) => handleMetadataChange('filtro8', e.target.value)}
                        placeholder="Filtro 8"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Filtro 9</label>
                      <Input 
                        value={metadata.filtro9}
                        onChange={(e) => handleMetadataChange('filtro9', e.target.value)}
                        placeholder="Filtro 9"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Filtro 10</label>
                      <Input 
                        value={metadata.filtro10}
                        onChange={(e) => handleMetadataChange('filtro10', e.target.value)}
                        placeholder="Filtro 10"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground p-4">
              Configure o caminho da pasta para continuar.
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleProcessFile} 
            disabled={!selectedSavedFile || processing || !metadata.tipo_documento}
            className="w-full"
          >
            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Upload className="mr-2 h-4 w-4" />
            {processing ? "Processando..." : "Processar Arquivo (Upsert)"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
