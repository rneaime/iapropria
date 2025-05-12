
import { DB_CONFIG } from '../config/env';
import { toast } from '../components/ui/use-toast';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  nome_empresa: string;
  cidade: string;
  estado: string;
  pais: string;
  logado: boolean;
}

// Na prática, estas funções fariam chamadas a uma API backend
// No ambiente frontend, estamos simulando para demonstração

export const authService = {
  login: async (email: string, senha: string): Promise<Usuario | null> => {
    try {
      // Simulando uma chamada de API
      console.log(`Tentando login com: ${email} usando DB: ${DB_CONFIG.HOST}`);
      
      // Em um ambiente real, isto seria uma chamada de API para o backend
      // que por sua vez se conectaria ao PostgreSQL
      
      // Simulando um usuário para demonstração
      if (email && senha) {
        const usuario = {
          id: 1,
          nome: "John Doe",
          email: email,
          telefone: "(11) 99999-9999",
          nome_empresa: "Tech Company",
          cidade: "São Paulo",
          estado: "SP",
          pais: "Brasil",
          logado: true
        };
        
        localStorage.setItem("usuarioAtual", JSON.stringify(usuario));
        return usuario;
      }
      return null;
    } catch (error) {
      console.error("Erro no login:", error);
      toast({
        title: "Erro de login",
        description: "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
        variant: "destructive"
      });
      return null;
    }
  },

  cadastrar: async (
    nome: string, 
    email: string, 
    senha: string, 
    telefone: string, 
    nome_empresa: string, 
    cidade: string, 
    estado: string, 
    pais: string
  ): Promise<boolean> => {
    try {
      // Simulando uma chamada de API
      console.log(`Cadastrando usuário: ${nome}, ${email}`);
      
      // Em um ambiente real, isto seria uma chamada de API para o backend
      // que por sua vez se conectaria ao PostgreSQL
      
      // Simulando sucesso
      if (nome && email && senha) {
        const usuario = {
          id: Math.floor(Math.random() * 1000),
          nome,
          email,
          telefone,
          nome_empresa,
          cidade,
          estado,
          pais,
          logado: true
        };
        
        localStorage.setItem("usuarioAtual", JSON.stringify(usuario));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível completar o cadastro. Tente novamente mais tarde.",
        variant: "destructive"
      });
      return false;
    }
  },

  recuperarSenha: async (email: string): Promise<boolean> => {
    try {
      // Simulando uma chamada de API
      console.log(`Recuperando senha para: ${email}`);
      
      // Em um ambiente real, isto seria uma chamada de API para o backend
      // que por sua vez enviaria um email com uma senha temporária
      
      // Simulando sucesso
      if (email) {
        toast({
          title: "Email enviado",
          description: "Verifique sua caixa de entrada para recuperar sua senha.",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro na recuperação de senha:", error);
      return false;
    }
  },

  getUsuarioAtual: (): Usuario | null => {
    const usuarioString = localStorage.getItem("usuarioAtual");
    if (usuarioString) {
      return JSON.parse(usuarioString);
    }
    return null;
  },

  logout: (): void => {
    localStorage.removeItem("usuarioAtual");
  }
};
