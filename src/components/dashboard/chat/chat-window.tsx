'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
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
        <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-sm z-50 flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-gray-900 dark:text-white" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">Taskit AI</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-sm flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-white dark:text-gray-900" />
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">AI アシスタント</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">学習の悩みや質問に答えます</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">何でも聞いてください</p>
              </div>
            ) : (
              messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-sm text-sm ${
                      message.role === 'user'
                        ? 'bg-teal-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-sm text-sm text-gray-900 dark:text-white">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-900 dark:bg-white rounded-full animate-bounce" />
                    <span className="inline-block w-1.5 h-1.5 bg-gray-900 dark:bg-white rounded-full animate-bounce delay-100" />
                    <span className="inline-block w-1.5 h-1.5 bg-gray-900 dark:bg-white rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="flex gap-2">
              <Input
                placeholder="メッセージを入力..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-sm focus-visible:ring-0 focus-visible:border-gray-900 dark:focus-visible:border-gray-300 transition-colors"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-teal-600 text-white hover:bg-teal-500 rounded-sm px-3"
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
        className="fixed bottom-6 right-6 w-14 h-14 bg-teal-600 text-white rounded-sm hover:bg-teal-500 transition-colors flex items-center justify-center z-50"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </>
  );
}