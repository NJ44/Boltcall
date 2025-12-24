import React, { useEffect, useState, useRef } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { PromptBox } from '../components/ui/chatgpt-prompt-input';
import { LavaLamp } from '../components/ui/fluid-blob';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Strike: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [typingProgress, setTypingProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Strike AI - Your Intelligent AI Assistant | Strike';
    updateMetaDescription('Experience the future of AI interaction with Strike. Powerful, intuitive, and designed to help you accomplish more with intelligent assistance.');
  }, []);

  // Typing animation effect
  useEffect(() => {
    const typingIntervals: Record<string, NodeJS.Timeout> = {};

    messages.forEach((message) => {
      if (message.sender === 'ai' && typingProgress[message.id] !== undefined) {
        const currentProgress = typingProgress[message.id];
        const fullText = message.text;
        
        if (currentProgress < fullText.length && !typingIntervals[message.id]) {
          typingIntervals[message.id] = setInterval(() => {
            setTypingProgress((prev) => {
              const newProgress = (prev[message.id] || 0) + 1;
              if (newProgress >= fullText.length) {
                if (typingIntervals[message.id]) {
                  clearInterval(typingIntervals[message.id]);
                }
                return { ...prev, [message.id]: fullText.length };
              }
              return { ...prev, [message.id]: newProgress };
            });
          }, 5); // Adjust speed here (lower = faster)
        }
      }
    });

    return () => {
      Object.values(typingIntervals).forEach(interval => clearInterval(interval));
    };
  }, [messages, typingProgress]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const messageText = formData.get("message") as string;
    
    if (!messageText || !messageText.trim()) {
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Reset the form
    event.currentTarget.reset();
    
    // Call webhook
    try {
      const response = await fetch('https://n8n.srv974118.hstgr.cloud/webhook/d8434af6-5bff-47b0-9f85-c8609caddb7c', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText.trim(),
          agent: selectedAgent || null,
          timestamp: new Date().toISOString(),
        }),
      });

      const aiResponse = await response.text();
      
      if (aiResponse && aiResponse.trim()) {
        // Add AI response message
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse.trim(),
          sender: 'ai',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        // Start typing animation
        setTypingProgress(prev => ({ ...prev, [aiMessage.id]: 0 }));
      }
    } catch (error) {
      console.error('Error calling webhook:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      // Start typing animation for error message
      setTypingProgress(prev => ({ ...prev, [errorMessage.id]: 0 }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* LavaLamp Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <LavaLamp />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <Header />
        
        <div className="flex-1 flex flex-col min-h-0">
          {/* Hero Section - Only show when no messages */}
          {messages.length === 0 && (
            <section className="pt-40 pb-12 px-4 sm:px-6 lg:px-8 relative">
              <div className="max-w-5xl mx-auto relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className="text-center mb-8"
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 text-white leading-tight mix-blend-exclusion">
                    Meet <span className="text-blue-400 mix-blend-exclusion">Strike</span>
                  </h1>
                  
                  <p className="text-base md:text-lg lg:text-xl text-white/80 mb-4 max-w-3xl mx-auto leading-relaxed mix-blend-exclusion">
                    Your intelligent AI assistant that helps you accomplish more
                  </p>
                </motion.div>
              </div>
            </section>
          )}

          {/* Chat Messages Area */}
          <div 
            ref={chatContainerRef}
            className={cn(
              "flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-4 relative z-10 min-h-0 chat-scrollbar",
              messages.length > 0 ? "pt-32" : ""
            )}
            style={{ 
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              scrollBehavior: 'smooth'
            }}
            tabIndex={-1}
          >
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className={cn(
                    "flex",
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3",
                      message.sender === 'user'
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-[#1a1a1a] text-white border-2 border-white/30 rounded-bl-sm"
                    )}
                  >
                    <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                      {message.sender === 'ai' && typingProgress[message.id] !== undefined
                        ? message.text.slice(0, typingProgress[message.id])
                        : message.text}
                      {message.sender === 'ai' && typingProgress[message.id] !== undefined && typingProgress[message.id] < message.text.length && (
                        <span className="animate-pulse">|</span>
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="flex justify-start"
                >
                  <div className="bg-[#1a1a1a] text-white border-2 border-white/30 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Input at Bottom - Normal flow */}
          <div className="pt-4 pb-6 px-4 sm:px-6 lg:px-8 relative z-10 flex-shrink-0 -mt-[100px]">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="w-full">
                <PromptBox 
                  ref={textareaRef}
                  name="message"
                  onAgentChange={setSelectedAgent}
                  selectedAgentId={selectedAgent}
                />
              </form>
              
              {/* Common Questions Tags */}
              {messages.length === 0 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {[
                    { question: "How can I increase my sales conversion rate?", agentId: 'sales' },
                    { question: "How can I improve my Google search rankings?", agentId: 'google-ranking' },
                    { question: "What's the best marketing strategy for my business?", agentId: 'marketing' },
                    { question: "How can I accelerate my business growth?", agentId: 'growth' }
                  ].map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (textareaRef.current) {
                          // Set the selected agent
                          setSelectedAgent(item.agentId);
                          
                          // Use React's event system to properly update the value
                          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                            window.HTMLTextAreaElement.prototype,
                            'value'
                          )?.set;
                          if (nativeInputValueSetter) {
                            nativeInputValueSetter.call(textareaRef.current, item.question);
                          }
                          // Create a proper input event that React will recognize
                          const inputEvent = new Event('input', { bubbles: true, cancelable: true });
                          textareaRef.current.dispatchEvent(inputEvent);
                          // Focus the textarea
                          textareaRef.current.focus();
                        }
                      }}
                      className="px-4 py-2 text-sm rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-blue-400 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                    >
                      {item.question}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Strike;

