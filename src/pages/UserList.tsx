
import React, { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, UserPlus } from "lucide-react";

interface User {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  nome_empresa: string;
  cidade: string;
  estado: string;
  pais: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Em um ambiente real, isso seria uma chamada à API
      // Para simular, estamos criando dados fictícios
      const mockUsers: User[] = [
        {
          id: 1,
          nome: "João Silva",
          email: "joao@example.com",
          telefone: "(11) 99999-8888",
          nome_empresa: "Empresa A",
          cidade: "São Paulo",
          estado: "SP",
          pais: "Brasil"
        },
        {
          id: 2,
          nome: "Maria Oliveira",
          email: "maria@example.com",
          telefone: "(21) 98888-7777",
          nome_empresa: "Empresa B",
          cidade: "Rio de Janeiro",
          estado: "RJ",
          pais: "Brasil"
        },
        {
          id: 3,
          nome: "Carlos Santos",
          email: "carlos@example.com",
          telefone: "(31) 97777-6666",
          nome_empresa: "Empresa C",
          cidade: "Belo Horizonte",
          estado: "MG",
          pais: "Brasil"
        }
      ];
      
      // Simular atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(mockUsers);
      toast({
        title: "Usuários carregados",
        description: `${mockUsers.length} usuários encontrados`,
      });
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Usuários</CardTitle>
            <CardDescription>Gerenciamento de usuários da plataforma</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={fetchUsers}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Localização</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.nome}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.telefone}</TableCell>
                    <TableCell>{user.nome_empresa}</TableCell>
                    <TableCell>{`${user.cidade}, ${user.estado}, ${user.pais}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserList;
