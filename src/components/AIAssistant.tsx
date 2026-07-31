'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, MessageSquare, ArrowRight, ExternalLink } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm **ICON**, ICONIC GH's AI Solutions Advisor. 👋\n\nLooking to build a custom website, mobile app, or grow your revenue with digital marketing? Tell me about your project!"
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });

      const data = await res.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "Connect with our team directly on WhatsApp (+233500329461)!"
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (e) {
      console.error('Chat error:', e);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I ran into a connection glitch. Please reach our engineering team directly on WhatsApp (+233500329461)!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent("Hello ICONIC GH! I'd like to discuss a project with your team.");
    window.open(`https://wa.me/233500329461?text=${text}`, '_blank');
  };

  const scrollToContact = () => {
    setIsOpen(false);
    const contactSec = document.getElementById('contact');
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper to format basic Markdown bold (**text**) into <strong>
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Replace **text** with <strong>text</strong>
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const lineContent = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} style={{ color: '#ffffff', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={idx} style={{ display: 'block', marginBottom: line === '' ? '8px' : '3px' }}>
          {lineContent}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Sales Assistant"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #22d3ee 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50px',
          padding: isOpen ? '14px' : '14px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4), 0 0 20px rgba(34, 211, 238, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontWeight: 700,
          fontSize: '0.92rem',
          letterSpacing: '0.3px',
        }}
      >
        {isOpen ? (
          <X size={22} />
        ) : (
          <>
            <Sparkles size={20} style={{ animation: 'spin 4s linear infinite' }} />
            <span>Ask ICON AI</span>
            <span style={{
              background: 'rgba(255,255,255,0.25)',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '0.72rem',
              fontWeight: 800
            }}>AI</span>
          </>
        )}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '88px',
            right: '24px',
            width: 'calc(100vw - 48px)',
            maxWidth: '390px',
            height: '540px',
            maxHeight: 'calc(100vh - 120px)',
            background: 'rgba(11, 15, 25, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(129, 140, 248, 0.25)',
            borderRadius: '24px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.15)',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(180deg, rgba(129, 140, 248, 0.12) 0%, rgba(11, 15, 25, 0.6) 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #818cf8, #22d3ee)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(129, 140, 248, 0.3)'
                }}
              >
                <Bot size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#ffffff' }}>ICON AI</h4>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22d3ee', display: 'inline-block' }} />
                </div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>
                  ICONIC GH Sales & Strategy Consultant
                </p>
              </div>
            </div>

            <button
              onClick={openWhatsApp}
              title="Chat on WhatsApp"
              style={{
                background: 'rgba(37, 211, 102, 0.15)',
                border: '1px solid rgba(37, 211, 102, 0.3)',
                color: '#25D366',
                borderRadius: '10px',
                padding: '6px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
              }}
            >
              WhatsApp <ExternalLink size={12} />
            </button>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  gap: '8px',
                }}
              >
                {m.role === 'assistant' && (
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '8px',
                      background: 'rgba(129, 140, 248, 0.2)',
                      border: '1px solid rgba(129, 140, 248, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#818cf8',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Bot size={14} />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: '82%',
                    padding: '12px 14px',
                    borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: m.role === 'user' 
                      ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    border: m.role === 'user' 
                      ? 'none' 
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    color: m.role === 'user' ? '#ffffff' : '#cbd5e1',
                    fontSize: '0.84rem',
                    lineHeight: '1.45',
                    boxShadow: m.role === 'user' ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
                  }}
                >
                  {renderFormattedText(m.content)}
                </div>

                {m.role === 'user' && (
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    background: 'rgba(129, 140, 248, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#818cf8',
                  }}
                >
                  <Bot size={14} />
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    color: '#94a3b8',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>ICON is typing</span>
                  <span style={{ animation: 'pulse 1s infinite' }}>...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Choice Chips */}
          <div
            style={{
              padding: '8px 14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none',
            }}
          >
            {[
              "💰 View Packages & Prices",
              "🚀 Web Application",
              "📱 Mobile App (iOS/Android)",
              "📈 Digital Marketing"
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                disabled={loading}
                style={{
                  background: 'rgba(129, 140, 248, 0.1)',
                  border: '1px solid rgba(129, 140, 248, 0.25)',
                  color: '#22d3ee',
                  borderRadius: '20px',
                  padding: '5px 11px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '0 14px 8px' }}>
            <button
              onClick={openWhatsApp}
              style={{
                background: '#25D366',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              WhatsApp Us <ArrowRight size={12} />
            </button>
            <button
              onClick={scrollToContact}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Get Custom Quote
            </button>
          </div>

          {/* Form Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{
              padding: '10px 14px 14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about apps, pricing, or custom software..."
              disabled={loading}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '10px 12px',
                color: '#ffffff',
                fontSize: '0.84rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: input.trim() && !loading 
                  ? 'linear-gradient(135deg, #818cf8, #6366f1)' 
                  : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                transition: 'all 0.2s',
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
