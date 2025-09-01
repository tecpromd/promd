import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';

const ChatbotIA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Olá! Sou o assistente de IA do ProMD. Como posso ajudá-lo com seus estudos médicos hoje?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simular chamada para OpenAI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: 'medical_education'
        })
      });

      let botResponse;
      if (response.ok) {
        const data = await response.json();
        botResponse = data.response;
      } else {
        // Fallback para respostas pré-definidas
        botResponse = generateFallbackResponse(inputMessage);
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('cardiologia') || lowerMessage.includes('coração')) {
      return 'Cardiologia é uma área fundamental! Algumas dicas de estudo:\n\n• Foque nos mecanismos fisiopatológicos\n• Pratique interpretação de ECG\n• Estude farmacologia cardiovascular\n• Revise casos clínicos de insuficiência cardíaca\n\nQuer que eu elabore algum tópico específico?';
    }
    
    if (lowerMessage.includes('pneumologia') || lowerMessage.includes('pulmão')) {
      return 'Pneumologia é essencial para o USMLE! Pontos-chave:\n\n• Mecânica respiratória e espirometria\n• Diagnóstico diferencial de dispneia\n• Patologias intersticiais vs obstrutivas\n• Interpretação de gasometria arterial\n\nPrecisa de ajuda com algum caso específico?';
    }
    
    if (lowerMessage.includes('estudo') || lowerMessage.includes('estudar')) {
      return 'Ótima pergunta sobre estratégias de estudo! Recomendo:\n\n• Repetição espaçada (use nosso sistema!)\n• Questões práticas diárias\n• Revisão ativa com flashcards\n• Simulados regulares\n• Foco nas fraquezas identificadas\n\nQual área você gostaria de priorizar?';
    }
    
    if (lowerMessage.includes('usmle') || lowerMessage.includes('step')) {
      return 'Preparação para USMLE Step 1:\n\n• First Aid como base\n• UWorld para questões (ou nosso banco!)\n• Pathoma para patologia\n• Sketchy para micro/pharma\n• Anki para revisão\n\nEstá em que fase da preparação?';
    }
    
    return 'Entendo sua dúvida! Como assistente médico, posso ajudar com:\n\n• Explicações de conceitos médicos\n• Estratégias de estudo\n• Análise de casos clínicos\n• Dicas para USMLE\n• Revisão de disciplinas\n\nPode ser mais específico sobre o que precisa?';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Botão flutuante - responsivo e sem sobreposição */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-promd-navy to-promd-sky text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-30 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Janela do chat - responsiva */}
      <div className={`fixed inset-0 md:inset-auto md:bottom-20 md:right-6 md:w-96 md:h-[500px] bg-white dark:bg-slate-800 md:rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col z-40 transition-all duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-promd-navy to-promd-sky text-white md:rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm md:text-base">Assistente ProMD</h3>
              <p className="text-xs opacity-90">IA Médica Especializada</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 md:gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'bot' && (
                <div className="w-6 h-6 md:w-8 md:h-8 bg-promd-navy text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 md:w-4 md:h-4" />
                </div>
              )}
              
              <div className={`max-w-[85%] md:max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                <div className={`p-2 md:p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-promd-navy text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                }`}>
                  <p className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {message.type === 'user' && (
                <div className="w-6 h-6 md:w-8 md:h-8 bg-promd-sky text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 md:w-4 md:h-4" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-2 md:gap-3 justify-start">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-promd-navy text-white rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 md:w-4 md:h-4" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 p-2 md:p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                  <span className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                    Pensando...
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-700" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
          <div className="flex gap-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua dúvida médica..."
              className="flex-1 resize-none border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-xs md:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-promd-navy"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="w-8 h-8 md:w-10 md:h-10 bg-promd-navy text-white rounded-lg hover:bg-promd-navy/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <Send className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
          
          {/* Sugestões rápidas */}
          <div className="flex flex-wrap gap-1 md:gap-2 mt-2 md:mt-3">
            {[
              'Dicas de cardiologia',
              'Como estudar para USMLE',
              'Explicar caso clínico'
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputMessage(suggestion)}
                className="px-2 md:px-3 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-35 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ChatbotIA;

