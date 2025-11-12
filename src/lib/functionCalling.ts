import { AVAILABLE_FUNCTIONS } from './availableFunctions';
import { getTasks, getTaskById, createTask, updateTaskById, deleteTaskById } from './taskActions';

const MAX_CALLING_COUNT = 3;

export async function executeFunction(functionName: string, args: any, userId: string): Promise<any> {
    try {
        switch (functionName) {
            case 'getTasks':
                return await getTasks({ ...args, userId });
            case 'getTaskById':
                return await getTaskById(args.id);
            case 'createTask':
                return await createTask({ userId, ...args });
            case 'updateTaskById':
                return await updateTaskById(args.id, args);
            case 'deleteTaskById':
                return await deleteTaskById(args.id);
            default:
                throw new Error(`未対応の関数です: ${functionName}`);
        }
    } catch (error) {
        console.error('Function Execution Error:', error);
        return { error: error.message ?? String(error) };
    }
}

export async function callingFunction(message: Message[], userId: string): Promise<Message[]> {
    const messages = [...message]; 
    let loopCount = 0;

    try {
        while (loopCount < MAX_CALLING_COUNT) {
            const openAIMessages = [
                {
                    role: "system",
                    content: "あなたはTaskitのAIアシスタントです。タスクの作成・検索・削除などは必ず用意された関数を使ってください。"
                },
                ...filterMessage(messages)
            ];
            console.log('OpenAI Messages:', openAIMessages);

            const response = await fetch(`${process.env.OPENAI_API_URL}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: process.env.OPENAI_API_MODEL,
                    messages: openAIMessages,
                    functions: AVAILABLE_FUNCTIONS,
                    function_call: 'auto'
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                messages.push({
                    id: crypto.randomUUID(),
                    role: 'error',
                    content: `OpenAI APIエラー: ${response.status} ${response.statusText} - ${errorText}`,
                    timestamp: new Date()
                });
                break;
            }

            const data = await response.json();
            const res = data.choices?.[0]?.message;

            if (!res) {
                messages.push({
                    id: crypto.randomUUID(),
                    role: 'error',
                    content: 'AIからの応答がありませんでした。',
                    timestamp: new Date()
                });
                break;
            }

            if (res.function_call) {
                const functionName = res.function_call.name;
                const args = JSON.parse(res.function_call.arguments);
                const result = await executeFunction(functionName, args, userId);

                messages.push({
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: '',
                    timestamp: new Date(),
                    function_call: result
                });

                loopCount++;
                continue;
            }
            messages.push({
                id: crypto.randomUUID(),
                role: 'assistant',
                content: res.content ?? '',
                timestamp: new Date()
            });
            break;
        }
    } catch (error) {
        console.error('Function Calling Error:', error);
        messages.push({
            id: crypto.randomUUID(),
            role: 'error',
            content: `エラーが発生しました: ${error.message ?? String(error)}`,
            timestamp: new Date()
        });
    }
    
    return messages;
}

function filterMessage (message: Message[]) : OpenAIMessage[] {
    return message
    .filter(msg => msg.role === 'user' || msg.role === 'assistant' || msg.role === 'function')
    .map(msg => {
        const openAIMessage: OpenAIMessage = {
            role: msg.role as 'user' | 'assistant' | 'function',
            content: msg.content
        };
        return openAIMessage;
    });
}
