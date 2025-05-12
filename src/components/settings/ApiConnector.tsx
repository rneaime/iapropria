
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiKeyManager } from './ApiKeyManager';

export function ApiConnector() {
  return (
    <Card>
      <CardHeader className="bg-burgundy text-white rounded-t-md">
        <CardTitle>Conectar API</CardTitle>
        <CardDescription className="text-white/80">
          Gerencie as conexões de API e integrações com serviços externos
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ApiKeyManager />
      </CardContent>
    </Card>
  );
}
