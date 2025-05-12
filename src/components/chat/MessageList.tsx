
import React from 'react';

interface Message {
  pergunta: string;
  resposta: string;
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        Nenhuma mensagem ainda. Inicie uma conversa acima.
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      {messages.slice().reverse().map((message, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="font-semibold mb-2">
            <span className="text-primary italic">Pergunta:</span> {message.pergunta}
          </div>
          <div>
            <span className="font-semibold text-secondary">Resposta:</span> {message.resposta || (
              <span className="text-muted-foreground italic">Aguardando resposta...</span>
            )}
          </div>
          <div className="border-t mt-2 pt-2"></div>
        </div>
      ))}
    </div>
  );
}
