
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { authService } from "@/services/authService";

interface LoginFormProps {
  onLogin: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onForgotPassword, onRegister }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await authService.login(email, senha);
      if (result) {
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!"
        });
        onLogin();
      } else {
        toast({
          title: "Falha no login",
          description: "Email ou senha incorretos.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar o login. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-muted-foreground mt-2">
          Acesse sua conta para continuar
        </p>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <Button variant="outline" onClick={onRegister} disabled={loading} className="flex-1">
          Criar conta
        </Button>
        <Button variant="ghost" onClick={onForgotPassword} disabled={loading} className="flex-1">
          Esqueci minha senha
        </Button>
      </div>
    </div>
  );
};
