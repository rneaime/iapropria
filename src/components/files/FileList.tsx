
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Trash } from "lucide-react";

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
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  
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
    
    // Remove from selected files if it's there
    setSelectedFiles(selectedFiles.filter(id => id !== file.id));
  };
  
  const handleViewFile = (file: File) => {
    // In a real app, this would open the file in a new tab
    toast({
      title: "Visualizando arquivo",
      description: `Abrindo ${file.name}...`,
    });
  };
  
  const handleToggleSelectFile = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };
  
  const handleDeleteSelected = () => {
    // Delete all selected files
    const newFiles = files.filter(file => !selectedFiles.includes(file.id));
    setFiles(newFiles);
    
    toast({
      title: "Arquivos deletados",
      description: `${selectedFiles.length} arquivos foram removidos com sucesso!`,
    });
    
    setSelectedFiles([]);
    setSelectedFile(null);
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
        
        <div className="border rounded-md p-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Arquivos disponíveis</h4>
            {selectedFiles.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDeleteSelected}
              >
                <Trash className="h-4 w-4 mr-1" />
                Deletar selecionados ({selectedFiles.length})
              </Button>
            )}
          </div>
          
          <div className="space-y-1">
            {files.map(file => (
              <div key={file.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleToggleSelectFile(file.id)}
                  />
                  <span className="cursor-pointer" onClick={() => handleViewFile(file)}>
                    {file.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteFile(file)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {selectedFile && (
        <div className="flex space-x-2">
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
