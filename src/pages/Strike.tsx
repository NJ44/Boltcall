import React, { useEffect, useState, useRef, Suspense } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Share2, Copy, Check } from 'lucide-react';
import Header from '../components/Header';
import { PromptBox } from '../components/ui/chatgpt-prompt-input';
import { cn } from '../lib/utils';
import { NeuralNetworkBackground } from '../components/ui/neural-network-background';

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
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [dislikedMessages, setDislikedMessages] = useState<Set<string>>(new Set());
  const [copiedMessages, setCopiedMessages] = useState<Set<string>>(new Set());

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
    <div className="h-screen flex flex-col relative overflow-hidden bg-black">
      {/* Neural Network Background */}
      <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <Suspense fallback={<div className="fixed inset-0 bg-blue-950" style={{ zIndex: 0 }} />}>
          <NeuralNetworkBackground />
        </Suspense>
      </div>
      
      <div className="relative flex flex-col h-full" style={{ position: 'relative', zIndex: 100 }}>
        <Header />
        
        {/* Black overlay when messages exist */}
        {messages.length > 0 && (
          <div className="fixed inset-0 bg-black/80 pointer-events-none" style={{ zIndex: 5 }} />
        )}
        
        <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden" style={{ position: 'relative', zIndex: 100 }}>
          {/* Hero Section - Only show when no messages */}
          {messages.length === 0 && (
            <section className="pt-20 md:pt-40 pb-12 px-4 sm:px-6 lg:px-8 relative" style={{ position: 'relative', zIndex: 100 }}>
              <div className="max-w-5xl mx-auto relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className="text-center mb-8"
                >
                  <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 text-white leading-tight">
                    Meet <span className="text-blue-400">Strike</span>
                  </h1>
                  
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed">
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
              "flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-4 relative min-h-0 chat-scrollbar",
              messages.length > 0 ? "pt-20 md:pt-32" : ""
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
                    "flex flex-col",
                    message.sender === 'user' ? 'items-end' : 'items-start'
                  )}
                >
                  {message.sender === 'user' ? (
                    <div className="max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 bg-gray-600 text-white rounded-br-sm">
                      <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                        {message.text}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base whitespace-pre-wrap break-words text-white max-w-[80%] sm:max-w-[70%]">
                      {typingProgress[message.id] !== undefined
                        ? message.text.slice(0, typingProgress[message.id])
                        : message.text}
                      {typingProgress[message.id] !== undefined && typingProgress[message.id] < message.text.length && (
                        <span className="animate-pulse">|</span>
                      )}
                    </p>
                  )}
                  {message.sender === 'ai' && (typingProgress[message.id] === undefined || typingProgress[message.id] >= message.text.length) && (
                    <div className="flex items-center gap-0.5 mt-2 -ml-[7px]">
                      <button
                        onClick={() => {
                          setLikedMessages(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(message.id)) {
                              newSet.delete(message.id);
                            } else {
                              newSet.add(message.id);
                              setDislikedMessages(prevDis => {
                                const newDisSet = new Set(prevDis);
                                newDisSet.delete(message.id);
                                return newDisSet;
                              });
                            }
                            return newSet;
                          });
                        }}
                        className={cn(
                          "flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors text-xs",
                          likedMessages.has(message.id)
                            ? "text-blue-400 hover:text-blue-300"
                            : "text-white/60 hover:text-white/80"
                        )}
                        title="Like"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDislikedMessages(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(message.id)) {
                              newSet.delete(message.id);
                            } else {
                              newSet.add(message.id);
                              setLikedMessages(prevLike => {
                                const newLikeSet = new Set(prevLike);
                                newLikeSet.delete(message.id);
                                return newLikeSet;
                              });
                            }
                            return newSet;
                          });
                        }}
                        className={cn(
                          "flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors text-xs",
                          dislikedMessages.has(message.id)
                            ? "text-red-400 hover:text-red-300"
                            : "text-white/60 hover:text-white/80"
                        )}
                        title="Dislike"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            if (navigator.share) {
                              await navigator.share({
                                title: 'Strike AI Response',
                                text: message.text,
                              });
                            } else {
                              // Fallback: copy to clipboard
                              await navigator.clipboard.writeText(message.text);
                              setCopiedMessages(prev => new Set(prev).add(message.id));
                              setTimeout(() => {
                                setCopiedMessages(prev => {
                                  const newSet = new Set(prev);
                                  newSet.delete(message.id);
                                  return newSet;
                                });
                              }, 2000);
                            }
                          } catch (err) {
                            console.error('Error sharing:', err);
                          }
                        }}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors text-xs text-white/60 hover:text-white/80"
                        title="Share"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(message.text);
                            setCopiedMessages(prev => new Set(prev).add(message.id));
                            setTimeout(() => {
                              setCopiedMessages(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(message.id);
                                return newSet;
                              });
                            }, 2000);
                          } catch (err) {
                            console.error('Error copying:', err);
                          }
                        }}
                        className={cn(
                          "flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors text-xs",
                          copiedMessages.has(message.id)
                            ? "text-green-400 hover:text-green-300"
                            : "text-white/60 hover:text-white/80"
                        )}
                        title="Copy"
                      >
                        {copiedMessages.has(message.id) ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
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
          <div className="pt-4 pb-6 px-4 sm:px-6 lg:px-8 relative flex-shrink-0 -mt-[490px]" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 100 }}>
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="w-full" style={{ pointerEvents: 'auto' }}>
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
                    { question: "What's the best marketing strategy for my business?", agentId: 'marketing' },
                    { question: "How can I increase my sales conversion rate?", agentId: 'sales' },
                    { question: "How can I improve my Google search rankings?", agentId: 'google-ranking' },
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
                      className="px-3 py-1.5 text-xs rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-blue-400 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
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

