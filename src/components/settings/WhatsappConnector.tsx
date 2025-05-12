
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import QRCode from 'react-qr-code';

export function WhatsappConnector() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappToken, setWhatsappToken] = useState('');
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  
  const handleConnect = () => {
    if (!phoneNumber || !whatsappToken) {
      toast({
        title: "Campos obrigatórios",
        description: "Número de telefone e Token do WhatsApp são obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    if (connected) {
      // Desconectar
      setConnected(false);
      setShowQrCode(false);
      toast({
        title: "WhatsApp desconectado",
        description: "Sua conta de WhatsApp foi desconectada com sucesso."
      });
      return;
    }
    
    // Se não está conectado, iniciar processo de conexão
    setConnecting(true);
    setShowQrCode(true);
    
    // Simulando uma conexão bem-sucedida após 3 segundos
    setTimeout(() => {
      setConnected(true);
      setConnecting(false);
      toast({
        title: "WhatsApp conectado",
        description: "Sua conta de WhatsApp foi conectada com sucesso!"
      });
    }, 3000);
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações do WhatsApp foram salvas com sucesso!"
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conectar WhatsApp</CardTitle>
        <CardDescription>
          Integre sua conta do WhatsApp para receber notificações e interagir com a plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="whatsapp-token" className="text-sm font-medium">Token do WhatsApp</label>
            <Input 
              id="whatsapp-token"
              type="password"
              placeholder="Insira seu token do WhatsApp"
              value={whatsappToken}
              onChange={(e) => setWhatsappToken(e.target.value)}
              disabled={connected}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone-number" className="text-sm font-medium">Número do WhatsApp</label>
            <Input 
              id="phone-number"
              placeholder="+55 (xx) xxxxx-xxxx"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={connected}
            />
          </div>
          
          <Button 
            onClick={handleConnect} 
            disabled={connecting}
            variant={connected ? "destructive" : "default"}
            className="w-full"
          >
            {connecting ? "Conectando..." : connected ? "Desconectar WhatsApp" : "Conectar WhatsApp"}
          </Button>
          
          {showQrCode && !connected && (
            <div className="flex justify-center p-4 bg-white border rounded-lg my-4">
              <QRCode value="https://iapropria.tech/whatsapp-connect" size={200} />
            </div>
          )}
          
          {connected && (
            <div className="bg-green-50 border-green-200 border p-4 rounded-lg text-center text-green-700">
              WhatsApp conectado com sucesso!
            </div>
          )}
        </div>
        
        {connected && (
          <div className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-medium">Configurações</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Receber notificações</p>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações de novos documentos e mensagens no WhatsApp
                  </p>
                </div>
                <Switch 
                  checked={receiveNotifications} 
                  onCheckedChange={setReceiveNotifications}
                />
              </div>
            </div>
            
            <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
