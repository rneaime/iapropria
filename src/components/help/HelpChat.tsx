import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ChatInterface } from "@/components/chat/ChatInterface";

export function HelpChat() {
  const [messages, setMessages] = useState<Array<{ content: string, sender: 'user' | 'assistant' }>>([
    {
      content: 'Olá! Sou o assistente da IAprópria. Como posso ajudá-lo hoje?',
      sender: 'assistant'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSendMessage = async (message: string, urls?: string[]) => {
    // Add user message to the list
    const userMessage = {
      content: message,
      sender: 'user' as const
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Em um ambiente real, aqui seria feita a chamada para a API
      // que processaria a pergunta usando o prompt_ajuda.py
      // Por enquanto, vamos simular uma resposta após um delay
      
      setTimeout(() => {
        let processedMessage = message;
        
        // Se houver URLs, adiciona as informações simuladas delas à mensagem
        if (urls && urls.length > 0) {
          processedMessage += "\n\nInformações extraídas dos links:";
          urls.forEach(url => {
            processedMessage += `\nLink: ${url}\nTítulo: Título simulado para ${url}\nConteúdo simulado do link...`;
          });
        }
        
        const assistantMessage = {
          content: generateResponse(processedMessage),
          sender: 'assistant' as const
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível processar sua mensagem."
      });
      setIsLoading(false);
    }
  };
  
  // Função para gerar respostas simuladas (será substituída pela integração real)
  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('como fazer upload')) {
      return "Para fazer upload de arquivos, navegue até a opção 'Enviar Arquivo' no menu lateral. Você poderá selecionar arquivos do seu computador e adicionar metadados importantes para categorização.\n\nExemplo de código para upload:\n```javascript\nasync function uploadFile(file) {\n  const formData = new FormData();\n  formData.append('file', file);\n  \n  const response = await fetch('/api/upload', {\n    method: 'POST',\n    body: formData\n  });\n  \n  return response.json();\n}\n```";
    } else if (lowerQuestion.includes('filtro') || lowerQuestion.includes('filtrar')) {
      return "Os filtros de metadados podem ser acessados através da opção 'Parâmetros' no menu. Selecione os valores desejados para refinar as consultas à base de conhecimento.\n\nExemplo de como usar filtros:\n```typescript\ninterface Filter {\n  fieldName: string;\n  value: string | number | boolean;\n}\n\nfunction applyFilters(filters: Filter[]) {\n  // Implementação do filtro\n  return filteredResults;\n}\n```";
    } else if (lowerQuestion.includes('conectar') || lowerQuestion.includes('api')) {
      return "Para conectar APIs, acesse a opção 'Conectar API' no menu. Você precisará fornecer o nome da API, chave (API Key), segredo (Secret) e URL base.\n\nExemplo de config:\n```json\n{\n  \"apiName\": \"ExampleAPI\",\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"apiSecret\": \"YOUR_API_SECRET\",\n  \"baseUrl\": \"https://api.example.com/v1\"\n}\n```";
    } else if (lowerQuestion.includes('whatsapp')) {
      return "A conexão com WhatsApp é feita através do menu 'Conectar WhatsApp'. Insira seu token e número de telefone para ativar a integração.";
    } else if (lowerQuestion.includes('cadastro') || lowerQuestion.includes('editar perfil')) {
      return "Você pode editar seu perfil e informações de cadastro na opção 'Editar Cadastro' no menu lateral.";
    } else if (lowerQuestion.includes('personalizar') || lowerQuestion.includes('logo') || lowerQuestion.includes('tema')) {
      return "Para personalizar sua interface, incluindo logo e nome da empresa, acesse a opção 'Personalizar' no menu lateral.";
    } else if (lowerQuestion.includes('código') || lowerQuestion.includes('code') || lowerQuestion.includes('programar')) {
      return "Aqui está um exemplo de como você pode usar nossa API em um script Python:\n\n```python\nimport requests\n\ndef query_api(query, api_key):\n    headers = {\n        'Authorization': f'Bearer {api_key}',\n        'Content-Type': 'application/json'\n    }\n    \n    payload = {\n        'query': query,\n        'options': {\n            'limit': 10\n        }\n    }\n    \n    response = requests.post(\n        'https://api.iapropria.com/v1/search',\n        json=payload,\n        headers=headers\n    )\n    \n    return response.json()\n\n# Exemplo de uso\nresultados = query_api('Como implementar autenticação?', 'sua-chave-api')\nprint(resultados)\n```";
    } else {
      return "Entendi sua pergunta. Para obter mais informações sobre este tópico, recomendo consultar nossa documentação completa ou entrar em contato com o suporte técnico através do e-mail suporte@iapropria.com";
    }
  };
  
  return (
    <div className="h-[600px]">
      <ChatInterface
        initialMessages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder="Digite sua pergunta..."
        enableSearch={true}
      />
    </div>
  );
}
