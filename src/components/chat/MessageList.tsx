
import React from 'react';
import { CodeBlock } from '@/components/ui/code-block';

interface Message {
  pergunta: string;
  resposta: string;
}

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  // Função para detectar e formatar blocos de código
  const formatMessage = (text: string) => {
    if (!text) return [];
    
    // Regex para encontrar blocos de código (texto com múltiplas linhas de código)
    const codeBlockRegex = /```(?:(\w+)\n)?([\s\S]*?)```/g;
    
    // Dividir a mensagem em partes (texto e blocos de código)
    let lastIndex = 0;
    const parts = [];
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Adicionar texto antes do bloco de código
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.substring(lastIndex, match.index)
        });
      }
      
      // Adicionar o bloco de código
      const language = match[1] || 'typescript';
      const code = match[2].trim();
      
      parts.push({
        type: 'code',
        content: code,
        language
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Adicionar texto restante
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex)
      });
    }
    
    // Se não encontrou blocos de código, retorna o texto original
    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  };

  return (
    <div className="space-y-4 mt-4">
      {messages.map((message, index) => (
        <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="font-medium text-burgundy">Pergunta:</h3>
          <p className="mb-4 whitespace-pre-wrap">{message.pergunta}</p>
          
          <h3 className="font-medium text-burgundy">Resposta:</h3>
          <div className="whitespace-pre-wrap">
            {formatMessage(message.resposta).map((part, i) => {
              if (part.type === 'code') {
                return <CodeBlock key={i} code={part.content} language={part.language} />;
              } else {
                return <p key={i}>{part.content}</p>;
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
