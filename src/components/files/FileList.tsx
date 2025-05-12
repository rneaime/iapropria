
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface File {
  id: string;
  name: string;
  path: string;
}

interface FileListProps {
  folderPath?: string;
}

export function FileList({ folderPath }: FileListProps) {
  // Mock files for the UI
  const [files, setFiles] = useState<File[]>([
    { id: '1', name: 'document.pdf', path: `${folderPath}/document.pdf` },
    { id: '2', name: 'image.jpg', path: `${folderPath}/image.jpg` },
    { id: '3', name: 'report.docx', path: `${folderPath}/report.docx` },
  ]);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleDeleteFile = (file: File) => {
    // In a real app, this would call an API to delete the file
    setFiles(files.filter(f => f.id !== file.id));
    
    toast({
      title: "Arquivo deletado",
      description: `${file.name} foi removido com sucesso!`,
    });
    
    if (selectedFile?.id === file.id) {
      setSelectedFile(null);
    }
  };
  
  const handleViewFile = (file: File) => {
    // In a real app, this would open the file in a new tab
    toast({
      title: "Visualizando arquivo",
      description: `Abrindo ${file.name}...`,
    });
  };
  
  if (!folderPath) {
    return (
      <div className="text-center text-muted-foreground p-4">
        Configure o caminho da pasta para ver os arquivos.
      </div>
    );
  }
  
  if (files.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        Nenhum arquivo encontrado neste diretório.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Caminho da pasta: {folderPath}</h3>
        <select
          className="w-full p-2 border rounded"
          value={selectedFile?.id || ""}
          onChange={(e) => {
            const file = files.find(f => f.id === e.target.value);
            setSelectedFile(file || null);
          }}
        >
          <option value="">Selecione um arquivo</option>
          {files.map(file => (
            <option key={file.id} value={file.id}>
              {file.name}
            </option>
          ))}
        </select>
      </div>
      
      {selectedFile && (
        <div className="flex space-x-2">
          <Button 
            variant="destructive" 
            onClick={() => handleDeleteFile(selectedFile)}
          >
            Deletar
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleViewFile(selectedFile)}
          >
            Visualizar
          </Button>
        </div>
      )}
    </div>
  );
}
