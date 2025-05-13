
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, urls?: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Digite sua mensagem..."
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [urlMode, setUrlMode] = useState(false);
  const [urls, setUrls] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      const urlList = urlMode && urls ? urls.split(',').map(url => url.trim()) : undefined;
      onSendMessage(message, urlList);
      setMessage("");
      setUrls("");
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={urlMode}
          onCheckedChange={(checked) => setUrlMode(checked as boolean)}
          id="url-mode"
          disabled={disabled}
        />
        <label 
          htmlFor="url-mode"
          className="text-sm text-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Extrair informações de um ou mais links
        </label>
      </div>
      
      {urlMode && (
        <Input
          placeholder="Digite os links desejados (separados por vírgula)"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          disabled={disabled}
          className="mb-2"
        />
      )}
      
      <div className="flex items-end space-x-2">
        <Textarea
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 min-h-[80px] max-h-[200px] resize-y"
          disabled={disabled}
        />
        <Button 
          type="submit" 
          disabled={disabled || !message.trim()} 
          className="h-10 w-10 p-0"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Enviar</span>
        </Button>
      </div>
    </form>
  );
}
