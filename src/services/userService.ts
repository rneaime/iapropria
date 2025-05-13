import { DB_CONFIG } from "../config/env";
import database from "../lib/database";

// Interface para o usuário
export interface User {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  criado_em?: Date;
  ultimo_acesso?: Date;
  status?: "ativo" | "inativo" | "pendente";
  tipo?: "admin" | "usuario" | "cliente";
  avatar?: string;
  telefone?: string;
  nome_empresa?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  logado?: boolean;
}

// Usuários simulados para o frontend
const usuariosSimulados: User[] = [
  {
    id: 1,
    nome: "Admin Teste",
    email: "admin@iapropria.com",
    senha: "123456",
    criado_em: new Date("2023-01-01"),
    ultimo_acesso: new Date(),
    status: "ativo",
    tipo: "admin",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    telefone: "(11) 99999-9999",
    nome_empresa: "IA Própria",
    cidade: "São Paulo",
    estado: "SP",
    pais: "Brasil",
    logado: true
  },
  {
    id: 2,
    nome: "Usuário Regular",
    email: "usuario@exemplo.com",
    senha: "123456",
    criado_em: new Date("2023-02-15"),
    ultimo_acesso: new Date(),
    status: "ativo",
    tipo: "usuario",
    telefone: "(11) 88888-8888",
    nome_empresa: "Empresa Exemplo",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    pais: "Brasil",
    logado: false
  }
];

export const userService = {
  // Obter lista de usuários
  getUsuarios: async (): Promise<User[]> => {
    try {
      // Tentar buscar do banco de dados
      const result = await database.query('SELECT * FROM usuarios');
      
      // Se a consulta retornou dados, usá-los
      if (result.rows.length > 0) {
        return result.rows;
      }
    } catch (error) {
      console.error("Erro ao buscar usuários do banco:", error);
    }
    
    // Fallback para dados simulados
    return Promise.resolve(usuariosSimulados);
  },
  
  // Obter usuário por ID
  getUsuarioPorId: async (id: number): Promise<User | null> => {
    try {
      const result = await database.query('SELECT * FROM usuarios WHERE id = $1', [id]);
      
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (error) {
      console.error(`Erro ao buscar usuário ID ${id}:`, error);
    }
    
    // Fallback para dados simulados
    const usuario = usuariosSimulados.find(u => u.id === id);
    return Promise.resolve(usuario || null);
  },
  
  // Obter usuário por e-mail
  getUsuarioPorEmail: async (email: string): Promise<User | null> => {
    const usuario = usuariosSimulados.find(u => u.email.toLowerCase() === email.toLowerCase());
    return Promise.resolve(usuario || null);
  },
  
  // Autenticar usuário
  autenticarUsuario: async (email: string, senha: string): Promise<User | null> => {
    const usuario = usuariosSimulados.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
    );
    return Promise.resolve(usuario || null);
  },
  
  // Criar usuário
  criarUsuario: async (dadosUsuario: Omit<User, "id" | "criado_em" | "ultimo_acesso">): Promise<User> => {
    // Em um ambiente real, isso seria uma inserção no banco de dados
    const novoUsuario: User = {
      ...dadosUsuario,
      id: usuariosSimulados.length + 1,
      criado_em: new Date(),
      ultimo_acesso: new Date()
    };
    
    usuariosSimulados.push(novoUsuario);
    return Promise.resolve(novoUsuario);
  },
  
  // Atualizar usuário
  atualizarUsuario: async (id: number, dadosUsuario: Partial<User>): Promise<User | null> => {
    const index = usuariosSimulados.findIndex(u => u.id === id);
    if (index === -1) return Promise.resolve(null);
    
    usuariosSimulados[index] = {
      ...usuariosSimulados[index],
      ...dadosUsuario,
      ultimo_acesso: new Date()
    };
    
    return Promise.resolve(usuariosSimulados[index]);
  },
  
  // Excluir usuário
  excluirUsuario: async (id: number): Promise<boolean> => {
    const index = usuariosSimulados.findIndex(u => u.id === id);
    if (index === -1) return Promise.resolve(false);
    
    usuariosSimulados.splice(index, 1);
    return Promise.resolve(true);
  }
};

// Função exportada para compatibilidade com código existente
export const getUsers = async (): Promise<User[]> => {
  return userService.getUsuarios();
};
