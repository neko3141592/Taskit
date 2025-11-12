'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // TODO: API実装後にここで呼び出し
    // 仮のレスポンス
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'こんにちは！何かお手伝いできることはありますか？',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white border border-gray-200 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-teal-50 via-cyan-50 to-teal-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="h-5 w-5 text-teal-600 animate-pulse" />
                <div className="absolute inset-0 blur-sm bg-teal-400/20 rounded-full" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Taskit AI</h3>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse delay-100" />
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse delay-200" />
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute inset-0 blur-xl bg-gradient-to-br from-teal-400 to-teal-500 rounded-full opacity-30 animate-pulse" />
                </div>
                <p className="text-sm font-semibold text-gray-900">AI アシスタント</p>
                <p className="text-xs text-gray-600 mt-2">学習の悩みや質問に答えます</p>
                <p className="text-xs text-gray-500 mt-1">何でも聞いてください</p>
              </div>
            ) : (
              messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm text-gray-900 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-teal-500 rounded-full animate-bounce" />
                    <span className="inline-block w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-100" />
                    <span className="inline-block w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="px-4 py-3 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                placeholder="メッセージを入力..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 shadow-none border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus-visible:ring-teal-500"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-teal-600 text-white hover:bg-teal-500 rounded-lg px-3 shadow-sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 開閉ボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-teal-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-teal-500 transition-all flex items-center justify-center z-50 hover:scale-110"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Sparkles className="h-6 w-6 animate-pulse" />
        )}
      </button>
    </>
  );
}