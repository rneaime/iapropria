
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Search } from 'lucide-react';
import { CodeBlock } from "@/components/ui/code-block";
import { ChatInput } from "@/components/chat/ChatInput";

interface Message {
  content: string;
  sender: 'user' | 'assistant';
}

interface ChatInterfaceProps {
  title: string;
  initialMessages?: Message[];
  onSendMessage: (message: string, urls?: string[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  enableSearch?: boolean;
}

export function ChatInterface({ 
  title, 
  initialMessages = [], 
  onSendMessage, 
  isLoading = false,
  placeholder = "Digite sua pergunta...",
  enableSearch = true
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Update component messages when initialMessages change
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = (message: string, urls?: string[]) => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      content: message,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Call the parent handler
    onSendMessage(message, urls);
  };

  // Format message content to handle code blocks
  const formatMessageContent = (content: string) => {
    // Regex for code blocks with language specification
    const codeBlockRegex = /```([\w\-+#]+)?\n([\s\S]*?)```/g;
    
    // Regex for inline code
    const inlineCodeRegex = /`([^`]+)`/g;
    
    const parts: JSX.Element[] = [];
    let lastIndex = 0;
    let match;
    let key = 0;
    
    // Find all code blocks in the message
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textBeforeCode = content.substring(lastIndex, match.index);
        // Process inline code in text before block
        parts.push(
          <span key={key++} className="whitespace-pre-wrap">
            {processInlineCode(textBeforeCode)}
          </span>
        );
      }
      
      // Add code block with syntax highlighting
      const language = match[1]?.trim() || 'text';
      const code = match[2].trim();
      
      parts.push(
        <CodeBlock key={key++} code={code} language={language} />
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text after last code block
    if (lastIndex < content.length) {
      const remainingText = content.substring(lastIndex);
      parts.push(
        <span key={key++} className="whitespace-pre-wrap">
          {processInlineCode(remainingText)}
        </span>
      );
    }
    
    return parts.length > 0 ? parts : <span className="whitespace-pre-wrap">{processInlineCode(content)}</span>;
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
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="bg-burgundy text-white rounded-t-md p-4">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[calc(100%-76px)] overflow-hidden">
        <div className="flex-1 overflow-y-auto">
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
                  {formatMessageContent(message.content)}
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
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder={placeholder}
          />
          {enableSearch && (
            <div className="mt-2 text-xs text-right">
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto" 
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(messages[messages.length - 1]?.content || '')}`, '_blank')}
              >
                <Search className="h-3 w-3 mr-1" />
                Pesquisar na web
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
