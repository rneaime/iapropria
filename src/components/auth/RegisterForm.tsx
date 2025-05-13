
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

interface RegisterFormProps {
  onRegister: () => void;
  onCancel: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmaSenha: "",
    telefone: "",
    nomeEmpresa: "",
    cidade: "",
    estado: "",
    pais: ""
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.email || !formData.senha) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.senha !== formData.confirmaSenha) {
      toast({
        title: "Senhas diferentes",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await authService.cadastrar(
        formData.nome,
        formData.email,
        formData.senha,
        formData.telefone,
        formData.nomeEmpresa,
        formData.cidade,
        formData.estado,
        formData.pais
      );
      
      if (result) {
        toast({
          title: "Cadastro realizado",
          description: "Sua conta foi criada com sucesso! Seu diretório de arquivos foi configurado como /home/iapropria/1"
        });
        onRegister();
      } else {
        toast({
          title: "Erro no cadastro",
          description: "Não foi possível realizar o cadastro. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar o cadastro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Cadastro</h1>
        <p className="text-muted-foreground mt-2">
          Crie sua conta para começar
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="nome"
            placeholder="Nome completo"
            value={formData.nome}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <Input
            name="senha"
            type="password"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <Input
            name="confirmaSenha"
            type="password"
            placeholder="Confirmar senha"
            value={formData.confirmaSenha}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <Input
            name="telefone"
            placeholder="Telefone"
            value={formData.telefone}
            onChange={handleChange}
            disabled={loading}
          />
          <Input
            name="nomeEmpresa"
            placeholder="Nome da empresa"
            value={formData.nomeEmpresa}
            onChange={handleChange}
            disabled={loading}
          />
          <Input
            name="cidade"
            placeholder="Cidade"
            value={formData.cidade}
            onChange={handleChange}
            disabled={loading}
          />
          <Input
            name="estado"
            placeholder="Estado"
            value={formData.estado}
            onChange={handleChange}
            disabled={loading}
          />
          <Input
            name="pais"
            placeholder="País"
            value={formData.pais}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </div>
      </form>
    </div>
  );
};
