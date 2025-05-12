
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { authService } from "@/services/authService";

interface ForgotPasswordFormProps {
  onCancel: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onCancel }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, informe seu email.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await authService.recuperarSenha(email);
      
      if (result) {
        toast({
          title: "Email enviado",
          description: "Verifique sua caixa de entrada para recuperar sua senha."
        });
        onCancel(); // Voltar para o login
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível recuperar a senha. Verifique o email e tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar a recuperação de senha. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Recuperar Senha</h1>
        <p className="text-muted-foreground mt-2">
          Informe seu email para receber instruções de recuperação
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        
        <div className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Voltar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Recuperar senha"}
          </Button>
        </div>
      </form>
    </div>
  );
};
