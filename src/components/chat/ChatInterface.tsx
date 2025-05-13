
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';

interface Message {
  content: string;
  sender: 'user' | 'assistant';
}

interface ChatInterfaceProps {
  title: string;
  initialMessages?: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInterface({ 
  title, 
  initialMessages = [], 
  onSendMessage, 
  isLoading = false,
  placeholder = "Digite sua pergunta..." 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Update component messages when initialMessages change
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      content: inputMessage,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Call the parent handler
    onSendMessage(inputMessage);
    setInputMessage('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="bg-burgundy text-white rounded-t-md p-4">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[calc(100%-76px)]">
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          <div className="p-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 ${
                  message.sender === 'user' ? 'ml-auto text-right' : ''
                }`}
              >
                <div 
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-burgundy text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.content}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.sender === 'user' ? 'Você' : 'Assistente'}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center mb-4">
                <div className="animate-pulse flex space-x-1">
                  <div className="h-2 w-2 bg-burgundy rounded-full"></div>
                  <div className="h-2 w-2 bg-burgundy rounded-full"></div>
                  <div className="h-2 w-2 bg-burgundy rounded-full"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputMessage.trim()} 
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
