type Role =  OpenAIRole | 'error'  | 'task_select' | 'user_disabled' | 'tasks' | 'todos';

type OpenAIRole = 'user' | 'assistant' | 'system' | 'function';


interface Message {
    id: string;
    role: Role;
    sessionId?: string;
    userId?: string;
    name?: string;
    content: string;
    timestamp: Date;
    function_call?: {
        name?: string;
        arguments?: string;
    };
}

interface OpenAIMessage {
    role: 'user' | 'assistant' | 'system' | 'function';
    content?: string;
    name?: string; 
    function_call?: {
        name: string;
        arguments: string;
    };
}
interface Chat {
    id: string;
    userId: string;
    title: string | null;
    createdAt: string;
    updatedAt: string;
    messages: {
        id: string;
        chatId: string;
        role: string;
        content: string;
        timestamp: string;
    }[];
}
