import { UserMessage } from './user-message';
import { AssistantMessage } from './assistant-message';
import { TasksMessage } from './tasks-message';
import { DisabledMessage } from './disabled-message';
import { ErrorMessage } from './error-message';
import { TodosMessage } from './todos-message';

interface MessageRendererProps {
  message: Message;
}

export function MessageRenderer({ message }: MessageRendererProps) {
    if (message.role === 'task_select' || message.role === 'function') {
        return null;
    }

    if (message.role === 'tasks') {
        return <TasksMessage key={message.id} content={message.content} />;
    }

    if (message.role === 'user_disabled') {
        return <DisabledMessage key={message.id} content={message.content} />;
    }

    if (message.role === 'error') {
        return <ErrorMessage key={message.id} content={message.content} />;
    }

    if (message.role === 'user') {
        return <UserMessage key={message.id} content={message.content} />;
    }

    if (message.role === 'assistant') {
        return <AssistantMessage key={message.id} content={message.content} />;
    }

    if (message.role === 'todos') {
        return <TodosMessage key={message.id} content={message.content} />;
    }

  return null;
}
