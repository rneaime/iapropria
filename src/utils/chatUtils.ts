
// Adapter functions to convert between different message formats

// Convert from pergunta/resposta format to user/assistant format
export function convertToStandardMessages(messages: Array<{ pergunta: string, resposta: string }>) {
  const standardMessages: Array<{ content: string, sender: 'user' | 'assistant' }> = [];
  
  messages.forEach(message => {
    // Add user message
    standardMessages.push({
      content: message.pergunta,
      sender: 'user'
    });
    
    // Add assistant message if it exists
    if (message.resposta) {
      standardMessages.push({
        content: message.resposta,
        sender: 'assistant'
      });
    }
  });
  
  return standardMessages;
}

// Convert from standard format to pergunta/resposta format
export function convertFromStandardMessages(standardMessages: Array<{ content: string, sender: 'user' | 'assistant' }>) {
  const messages: Array<{ pergunta: string, resposta: string }> = [];
  
  // Process pairs of messages
  for (let i = 0; i < standardMessages.length; i += 2) {
    const userMsg = standardMessages[i];
    const assistantMsg = standardMessages[i + 1];
    
    if (userMsg && userMsg.sender === 'user') {
      messages.push({
        pergunta: userMsg.content,
        resposta: assistantMsg?.content || ""
      });
    }
  }
  
  return messages;
}
