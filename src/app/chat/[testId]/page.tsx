/**
 * AI Chat Page for Specific Test
 * Chat with AI coach about specific test results
 * @route /chat/[testId]
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatTestPage() {
  const params = useParams();
  const testId = params.testId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting message
    setMessages([
      {
        role: 'assistant',
        content: `Hallo! Ich bin Ihr persönlicher KI-Karriere-Coach. Ich habe Ihre Testergebnisse analysiert und kann Ihnen dabei helfen, Ihre Stärken zu nutzen und sich weiterzuentwickeln. Was möchten Sie besprechen?`,
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setError('');

    // Add user message
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          testId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Chat failed');
      }

      const data = await response.json();

      // Add assistant response
      setMessages([...newMessages, { role: 'assistant', content: data.message }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chat failed');
      // Remove the user message if request failed
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🤖</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">KI-Karriere-Coach</h1>
              <p className="text-sm text-gray-600">Basierend auf Ihren Testergebnissen</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-lg px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-900 shadow-md rounded-lg px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Denke nach...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 pb-2">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Stellen Sie eine Frage zu Ihrer Karriere..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
              rows={2}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Senden
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Drücken Sie Enter zum Senden, Shift+Enter für neue Zeile
          </p>
        </div>
      </div>
    </div>
  );
}
