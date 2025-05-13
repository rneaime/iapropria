
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
    
    // Regex para encontrar blocos de código com linguagem especificada
    const codeBlockRegex = /```([\w\-+#]+)?\n([\s\S]*?)```/g;
    
    // Regex para encontrar blocos de código em linha (com backticks)
    const inlineCodeRegex = /`([^`]+)`/g;
    
    // Dividir a mensagem em partes (texto e blocos de código)
    let lastIndex = 0;
    const parts = [];
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Adicionar texto antes do bloco de código
      if (match.index > lastIndex) {
        const textBeforeCode = text.substring(lastIndex, match.index);
        // Process inline code in text before code block
        parts.push({
          type: 'text',
          content: processInlineCode(textBeforeCode)
        });
      }
      
      // Adicionar o bloco de código
      const language = match[1]?.trim() || 'typescript';
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
      const remainingText = text.substring(lastIndex);
      parts.push({
        type: 'text',
        content: processInlineCode(remainingText)
      });
    }
    
    // Se não encontrou blocos de código, processa o texto para inline code
    return parts.length > 0 ? parts : [{ type: 'text', content: processInlineCode(text) }];
  };

  // Process inline code with backticks
  const processInlineCode = (text: string) => {
    if (!text) return text;
    
    const parts: JSX.Element[] = [];
    const inlineCodeRegex = /`([^`]+)`/g;
    let lastIndex = 0;
    let match;
    let key = 0;
    
    while ((match = inlineCodeRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={key++}>{text.substring(lastIndex, match.index)}</span>);
      }
      
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 font-mono text-sm">
          {match[1]}
        </code>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < text.length) {
      parts.push(<span key={key++}>{text.substring(lastIndex)}</span>);
    }
    
    return parts.length > 0 ? <>{parts}</> : text;
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
                return <div key={i}>{part.content}</div>;
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
