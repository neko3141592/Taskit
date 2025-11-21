import { AVAILABLE_FUNCTIONS } from './availableFunctions';
import { getTasks, createTask, deleteTaskById, suggestNextTasks } from './taskActions';
import { getTodosByDate } from './testActions';

const MAX_FUNCTION_CALLS = 3;

async function executeFunction(
    functionName: string, 
    args: any, 
    userId: string
): Promise<{ success: true; result: any } | { success: false; error: string }> {
    try {
        switch (functionName) {
            case 'displayTasks':

                return { success: true, result: { action: 'display_tasks' } };
            
            case 'getTasks': {
                const tasksResult = await getTasks({ ...args, userId });
                const now = new Date();
                const filteredTasks = (tasksResult.tasks || []).filter((task: any) => {
                    if (!task.dueDate) return true; 
                    return new Date(task.dueDate) >= now; 
                });
                return { success: true, result: { tasks: filteredTasks, totalCount: filteredTasks.length } };
            }
            
            case 'createTask':
                const newTask = await createTask({ userId, ...args });
                return { success: true, result: newTask };
            
            case 'deleteTaskById':
                const deleteResult = await deleteTaskById(args.id);
                return { success: true, result: deleteResult };
            
            case 'suggestNextTasks':
                const suggestions = await suggestNextTasks(userId, args.currentTaskId);
                return { success: true, result: suggestions };
            
            case 'getTodosByDate':
                const todos = await getTodosByDate(args.start, args.end, userId);
                return { success: true, result: todos };
            
            default:
                return { success: false, error: `未対応の関数: ${functionName}` };
        }
    } catch (error: unknown) {
        console.error(`Function execution error [${functionName}]:`, error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : String(error) 
        };
    }
}


function filterMessagesForOpenAI(messages: Message[]): OpenAIMessage[] {
    return messages
        .filter(msg => 
            msg.role === 'user' || 
            msg.role === 'assistant' || 
            msg.role === 'function' ||
            msg.role === 'user_disabled'
        )
        .map(msg => {
            const role: 'user' | 'assistant' | 'function' = 
                msg.role === 'user_disabled' ? 'user' :
                msg.role === 'user' ? 'user' :
                msg.role === 'assistant' ? 'assistant' : 'function';
            
            const openAIMsg: OpenAIMessage = {
                role,
                content: msg.content || ''
            };
            
            if (role === 'function' && msg.name) {
                openAIMsg.name = msg.name;
            }
            
            return openAIMsg;
        });
}

export async function callingFunction(inputMessages: Message[], userId: string): Promise<Message[]> {
    const messages: Message[] = [...inputMessages];
    let functionCallCount = 0;

    const now = new Date();
    const systemPrompt = `
        あなたはTaskitのAIアシスタントです。タスクの作成・検索・削除などは必ず用意された関数を使ってください。IDが必要な操作でIDが不明な場合は、displayTasks関数を使ってユーザーにタスクを選択させてください。
        重要: 「Todo」「やるべきこと」に関する質問には getTodosByDate 関数を使用してください。「タスク」に関する質問には getTasks 関数を使用してください。
        
        現在時刻: ${now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
    現在日時（ISO形式）: ${now.toISOString()}

    - 「今日」は ${now.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })} です
    - 「明日」は ${new Date(now.getTime() + 24*60*60*1000).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })} です
    - 「明後日」は ${new Date(now.getTime() + 2*24*60*60*1000).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })} です
    - 日付範囲を指定する際は、開始時刻を00:00:00、終了時刻を23:59:59に設定してください
    - 期限が過去のタスクは提案しないでください
    - 日付を比較する際は必ず「日本時間（JST）」の現在時刻を基準にしてください
    `;

    try {
        while (functionCallCount < MAX_FUNCTION_CALLS) {
            const openAIMessages = [
                {
                    role: 'system' as const,
                    content: systemPrompt,
                },
                ...filterMessagesForOpenAI(messages)
            ];

            console.log('[Function Calling] Calling OpenAI API, loop:', functionCallCount);
            console.log(openAIMessages);

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
                    function_call: 'auto',
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[Function Calling] OpenAI API Error:', response.status, errorText);
                messages.push({
                    id: crypto.randomUUID(),
                    role: 'error',
                    content: `APIエラーが発生しました。もう一度お試しください。`,
                    timestamp: new Date()
                });
                break;
            }

            const data = await response.json();
            const aiMessage = data.choices?.[0]?.message;

            if (!aiMessage) {
                console.error('[Function Calling] No AI message in response');
                messages.push({
                    id: crypto.randomUUID(),
                    role: 'error',
                    content: 'AIからの応答がありませんでした。',
                    timestamp: new Date()
                });
                break;
            }

            if (aiMessage.function_call) {
                const { name: functionName, arguments: argsString } = aiMessage.function_call;
                console.log('[Function Calling] Function call:', functionName);
                console.log(messages)

                let args: any = {};
                try {
                    args = JSON.parse(argsString || '{}');
                } catch (e) {
                    console.error('[Function Calling] Failed to parse arguments:', argsString);
                }

                const execResult = await executeFunction(functionName, args, userId);

                if (!execResult.success) {
                    messages.push({
                        id: crypto.randomUUID(),
                        role: 'function',
                        name: functionName,
                        content: JSON.stringify({ error: execResult.error }),
                        timestamp: new Date()
                    });
                    functionCallCount++;
                    continue;
                }

                if (functionName === 'displayTasks') {
                    messages.push({
                        id: crypto.randomUUID(),
                        role: 'task_select',
                        content: '',
                        timestamp: new Date()
                    });
                    break;
                }

                if (functionName === 'getTasks') {
                    messages.push({
                        id: crypto.randomUUID(),
                        role: 'tasks',
                        content: JSON.stringify(execResult.result),
                        timestamp: new Date()
                    });
                    break;
                }

                if (functionName === 'getTodosByDate') {
                    messages.push({
                        id: crypto.randomUUID(),
                        role: 'todos',
                        content: JSON.stringify({ todos: execResult.result }),
                        timestamp: new Date()
                    });
                    break;
                }


                messages.push({
                    id: crypto.randomUUID(),
                    role: 'function',
                    name: functionName,
                    content: JSON.stringify(execResult.result),
                    timestamp: new Date()
                });

                functionCallCount++;
                continue;
            }


            if (aiMessage.content) {
                messages.push({
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: aiMessage.content,
                    timestamp: new Date()
                });
            }

            break;
        }

        if (functionCallCount >= MAX_FUNCTION_CALLS) {
            console.warn('[Function Calling] Max function calls reached');
        }

    } catch (error: unknown) {
        console.error('[Function Calling] Unexpected error:', error);
        messages.push({
            id: crypto.randomUUID(),
            role: 'error',
            content: 'エラーが発生しました。もう一度お試しください。',
            timestamp: new Date()
        });
    }

    console.log('[Function Calling] Completed with', messages.length, 'messages');
    return messages;
}
