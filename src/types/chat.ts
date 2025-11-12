type Role = 'user' | 'assistant' | 'error' | 'task' | 'subject' | 'function';

interface Message {
    id: string;
    role: Role;
    sessionId?: string;
    userId?: string;
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