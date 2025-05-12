
import React from 'react';

interface Message {
  pergunta: string;
  resposta: string;
}

interface MessageListProps {
  messages: Message[];
  className?: string;
}

export function MessageList({ messages, className = '' }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        Nenhuma mensagem ainda. Inicie uma conversa acima.
      </div>
    );
  }

  return (
    <div className={`space-y-4 pt-4 ${className}`}>
      {messages.slice().reverse().map((message, index) => (
        <div key={index} className="border rounded-lg p-4 bg-background shadow-sm">
          <div className="font-semibold mb-2">
            <span className="text-primary italic">Pergunta:</span> {message.pergunta}
          </div>
          <div className="mt-2">
            <span className="font-semibold text-secondary">Resposta:</span> {message.resposta || (
              <div className="flex items-center mt-2">
                <div className="animate-pulse bg-muted h-3 w-3 mr-1 rounded-full"></div>
                <div className="animate-pulse bg-muted h-3 w-3 mx-1 rounded-full animation-delay-200"></div>
                <div className="animate-pulse bg-muted h-3 w-3 ml-1 rounded-full animation-delay-500"></div>
                <span className="text-muted-foreground italic ml-2">Aguardando resposta...</span>
              </div>
            )}
          </div>
          {index < messages.length - 1 && <div className="border-t mt-2 pt-2"></div>}
        </div>
      ))}
    </div>
  );
}
