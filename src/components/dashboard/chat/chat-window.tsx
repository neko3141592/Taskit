'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Search, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import Link from 'next/link';
import { MessageRenderer } from './message';

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTaskSelect, setShowTaskSelect] = useState(false);
  const [taskSearch, setTaskSearch] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [showChatList, setShowChatList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    try {
      const res = await axios.get<APIResponse<Chat[]>>('/api/chats');
      setChats(res.data.data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const createNewChat = async () => {
    try {
      const res = await axios.post<APIResponse<Chat>>('/api/chats', {});
      setCurrentChatId(res.data.data.id);
      setMessages([]);
      fetchChats();
      setShowChatList(false);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };


  useEffect(() => {
    if (isOpen) {
      fetchChats();
    }
  }, [isOpen]);


  const loadChat = async (chatId: string) => {
    try {
      const res = await axios.get<APIResponse<Chat>>(`/api/chats/${chatId}`);
      const chat = res.data.data;
      setCurrentChatId(chat.id);
      setMessages(chat.messages.map(msg => ({
        id: msg.id,
        role: msg.role as Message['role'],
        content: msg.content,
        timestamp: new Date(msg.timestamp)
      })));
      setShowChatList(false);
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const saveMessages = async (newMessages: Message[], chatId?: string) => {
    const targetChatId = chatId || currentChatId;
    if (!targetChatId) return;
    
    try {
      await axios.post(`/api/chats/${targetChatId}/messages`, {
        messages: newMessages
      });
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };


  useEffect(() => {
    const lastMessage = messages.at(-1);
    if (lastMessage?.role === 'task_select') {
      setShowTaskSelect(true);
      fetchTasks('');
    }
  }, [messages]);

  const fetchTasks = async (query: string) => {
    setLoadingTasks(true);
    try {
      const res = await axios.get<APIResponse<{ tasks: Task[] }>>('/api/tasks', {
        params: { title: query || undefined }
      });
      setTasks(res.data.data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskSearch(e.target.value);
    fetchTasks(e.target.value);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    let chatId = currentChatId;
    if (!chatId) {
      try {
        const res = await axios.post<APIResponse<Chat>>('/api/chats', {});
        chatId = res.data.data.id;
        setCurrentChatId(chatId);
        await fetchChats();
      } catch (error) {
        console.error('Error creating chat:', error);
        return;
      }
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    await saveMessages([userMessage], chatId);

    try {
      const response = await fetch('/api/generate/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const responseMessages: Message[] = await response.json();
      setMessages(responseMessages);
      
      const newResponseMessages = responseMessages.slice(newMessages.length);
      await saveMessages(newResponseMessages, chatId);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: crypto.randomUUID(),
        role: 'error' as const,
        content: 'エラーが発生しました。もう一度お試しください。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      await saveMessages([errorMessage], chatId);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSelect = async (taskId: string) => {
    let chatId = currentChatId;
    if (!chatId) {
      try {
        const res = await axios.post<APIResponse<Chat>>('/api/chats', {});
        chatId = res.data.data.id;
        setCurrentChatId(chatId);
        await fetchChats();
      } catch (error) {
        console.error('Error creating chat:', error);
        return;
      }
    }
    
    const taskSelectMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user_disabled',
      content: `タスクID: ${taskId}`,
      timestamp: new Date()
    };

    const newMessages = [...messages, taskSelectMessage];
    setMessages(newMessages);
    setShowTaskSelect(false);
    setLoading(true);

    await saveMessages([taskSelectMessage], chatId);


    fetch('/api/generate/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: newMessages
      }),
    })
      .then(res => res.json())
      .then(async (responseMessages: Message[]) => {
        setMessages(responseMessages);
        const newResponseMessages = responseMessages.slice(newMessages.length);
        await saveMessages(newResponseMessages, chatId);
      })
      .catch(async error => {
        console.error('Chat error:', error);
        const errorMessage = {
          id: crypto.randomUUID(),
          role: 'error' as const,
          content: 'エラーが発生しました。',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        await saveMessages([errorMessage], chatId);
      })
      .finally(() => {
        setLoading(false);
      });
  };



  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm z-50 flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-neutral-900 dark:text-white" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight">Taskit AI</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                onClick={() => setShowChatList(!showChatList)}
                title="チャット履歴"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                onClick={createNewChat}
                title="新しいチャット"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* チャット履歴リスト */}
          {showChatList && (
            <div className="absolute top-14 left-0 right-0 bottom-0 bg-white dark:bg-neutral-900 z-10 flex flex-col">
              <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">チャット履歴</h4>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
                {chats.length === 0 ? (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">
                    チャット履歴がありません
                  </p>
                ) : (
                  chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => loadChat(chat.id)}
                      className={`w-full text-left p-3 rounded-sm border transition-colors ${
                        currentChatId === chat.id
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-teal-500 dark:hover:border-teal-500'
                      }`}
                    >
                      <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {chat.title || chat.messages[0]?.content?.slice(0, 30) || '新しいチャット'}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        {new Date(chat.updatedAt).toLocaleDateString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-neutral-50 dark:bg-neutral-800">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 bg-neutral-900 dark:bg-white rounded-sm flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-white dark:text-neutral-900" />
                </div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">AI アシスタント</p>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2">タスク管理をサポートします</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">「タスクを追加して」「明日のタスクを教えて」など</p>
              </div>
            ) : (
              messages.map(message => <MessageRenderer key={message.id} message={message} />)
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 px-3 py-2 rounded-sm text-sm text-neutral-900 dark:text-white">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-neutral-900 dark:bg-white rounded-full animate-bounce" />
                    <span className="inline-block w-1.5 h-1.5 bg-neutral-900 dark:bg-white rounded-full animate-bounce delay-100" />
                    <span className="inline-block w-1.5 h-1.5 bg-neutral-900 dark:bg-white rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showTaskSelect && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <div className="bg-white dark:bg-neutral-800 rounded-sm p-4 max-w-md w-full mx-4 max-h-[500px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">タスクを選択してください</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      setShowTaskSelect(false);
                      setTaskSearch('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    placeholder="タスクを検索..."
                    className="pl-10 shadow-none rounded-sm bg-neutral-50 dark:bg-neutral-900"
                    value={taskSearch}
                    onChange={handleSearchChange}
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 min-h-0 max-h-60 ">
                  {loadingTasks ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 text-neutral-400 animate-spin" />
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="px-4 py-8 text-sm text-neutral-500 text-center">
                      タスクが見つかりません
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <button
                        key={task.id}
                        className="w-full flex items-start gap-3 p-3 rounded-sm border border-neutral-200 dark:border-neutral-700 hover:border-teal-500 dark:hover:border-teal-500 transition-colors text-left"
                        onClick={() => {
                          handleTaskSelect(task.id);
                          setTaskSearch('');
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {task.subject && (
                              <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: task.subject.color ?? '#000' }}
                                />
                                {task.subject.name}
                              </span>
                            )}
                            {task.dueDate && (
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                {new Date(task.dueDate).toLocaleDateString('ja-JP', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowTaskSelect(false);
                      setTaskSearch('');
                    }}
                    className="w-full"
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 py-3 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex gap-2">
              <Input
                placeholder="メッセージを入力..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && e.metaKey && handleSend()}
                className="flex-1 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 rounded-sm focus-visible:ring-0 focus-visible:border-neutral-900 dark:focus-visible:border-neutral-300 transition-colors"
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