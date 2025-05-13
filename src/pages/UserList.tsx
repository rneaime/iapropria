
import React, { useState, useEffect } from 'react';
import { User, userService } from '../services/userService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from '@/hooks/use-toast';

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const fetchedUsers = await userService.getUsuarios();
        setUsers(fetchedUsers);
        console.log('Usuários carregados:', fetchedUsers);
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
        setError('Não foi possível carregar os usuários. Verifique sua conexão.');
        toast({
          title: "Erro ao carregar usuários",
          description: "Verifique o console para mais detalhes.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Usuários</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.nome} />
                      <AvatarFallback>{user.nome.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user.nome}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.nome_empresa || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={
                      user.status === 'ativo' ? 'success' : 
                      user.status === 'inativo' ? 'destructive' : 'default'
                    }>
                      {user.status || 'desconhecido'}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.tipo || 'usuário'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserList;
