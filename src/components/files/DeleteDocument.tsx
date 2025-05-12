
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { pineconeService } from "@/services/pineconeService";
import { Trash } from "lucide-react";

interface DeleteDocumentProps {
  userId: string;
  onDocumentDeleted?: () => void;
}

export function DeleteDocument({ userId, onDocumentDeleted }: DeleteDocumentProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [documentsInCategory, setDocumentsInCategory] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  
  // Carregar documentos
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await pineconeService.buscarDocumentos(userId);
        setDocuments(docs);
        
        // Extrair categorias únicas
        const uniqueCategories = Array.from(
          new Set(docs.map(doc => doc.categoria).filter(Boolean))
        );
        setCategories(uniqueCategories as string[]);
      } catch (error) {
        console.error("Erro ao buscar documentos:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os documentos.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [userId]);
  
  // Atualizar documentos quando a categoria é alterada
  useEffect(() => {
    if (selectedCategory) {
      const docsInCategory = documents.filter(
        doc => doc.categoria === selectedCategory
      );
      setDocumentsInCategory(docsInCategory);
    } else {
      setDocumentsInCategory([]);
    }
    setSelectedDocument("");
  }, [selectedCategory, documents]);
  
  // Deletar documento
  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;
    
    setDeleting(true);
    try {
      const success = await pineconeService.deletarDocumento(
        userId, 
        selectedDocument
      );
      
      if (success) {
        toast({
          title: "Documento deletado",
          description: "O documento foi removido com sucesso."
        });
        
        // Atualizar lista
        setDocuments(prev => prev.filter(doc => doc.id !== selectedDocument));
        setSelectedDocument("");
        
        if (onDocumentDeleted) {
          onDocumentDeleted();
        }
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível deletar o documento.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao deletar o documento.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Deletar Documentos</h2>
      
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="text-center p-4 border rounded-md bg-muted/20">
            Não há documentos disponíveis.
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Categoria
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedCategory && (
              <div>
                <label htmlFor="document" className="block text-sm font-medium mb-1">
                  Documento
                </label>
                <Select
                  value={selectedDocument}
                  onValueChange={setSelectedDocument}
                  disabled={documentsInCategory.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentsInCategory.map(doc => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.nome_arquivo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {selectedDocument && (
              <Button 
                variant="destructive"
                onClick={handleDeleteDocument}
                disabled={deleting}
                className="w-full"
              >
                <Trash className="h-4 w-4 mr-2" />
                {deleting ? "Deletando..." : "Deletar documento"}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
