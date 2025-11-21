export const AVAILABLE_FUNCTIONS = [
    {
        name: 'displayTasks',
        description: 'ユーザーのタスク一覧を表示します。ユーザーにタスクのIDを選択させるために使用します',
    },
    {
        name: 'getTodosByDate',
        description: '指定した日付範囲内のテストTodo(やるべきこと)を取得します。「今日のTodo」「明日のTodo」「今週のTodo」などのTodoに関する質問にはこの関数を使ってください。タスクではなくTodoを確認する場合に使用します。',
        parameters: {
            type: 'object',
            properties: {
                start: {
                    type: 'string',
                    description: '開始日（ISO8601形式、例: 2025-01-01T00:00:00Z）'
                },
                end: {
                    type: 'string',
                    description: '終了日（ISO8601形式、例: 2025-01-01T23:59:59Z）'
                }
            },
            required: ['start', 'end']
        }
    },
    {
        name: 'getTasks',
        description: 'タイトルや状態、教科などでユーザーのタスク一覧を取得します。',
        parameters: {
            type: 'object',
            properties: {
                statusParam: {
                    type: 'string',
                    description: 'タスクの状態（例: NOT_STARTED+IN_PROGRESS など複数指定可）'
                },
                subjectId: {
                    type: 'string',
                    description: '教科IDで絞り込み'
                },
                sort: {
                    type: 'string',
                    description: 'ソート対象（例: dueDate, title など）'
                },
                order: {
                    type: 'string',
                    enum: ['asc', 'desc'],
                    description: '昇順または降順'
                },
                limit: {
                    type: 'number',
                    description: '取得件数の上限'
                },
                skip: {
                    type: 'number',
                    description: 'スキップする件数（ページング用）'
                },
                dueDateFrom: {
                    type: 'string',
                    description: '期限の開始日（ISO8601形式）'
                },
                dueDateTo: {
                    type: 'string',
                    description: '期限の終了日（ISO8601形式）'
                },
                title: {
                    type: 'string',
                    description: 'タイトルの部分一致キーワード'
                }
            }
        }
    },
    {
        name: 'createTask',
        description: '新しいタスクを作成します。説明は自動で生成してください。タグもなるべく関連することを1~3個つけてください。',
        parameters: {
            type: 'object',
            properties: {
                title: { type: 'string', description: 'タスクのタイトル' },
                description: { type: 'string', description: 'タスクの詳細' },
                dueDate: { type: 'string', description: '期限（ISO8601形式）' },
                subjectId: { type: 'string', description: '教科ID', nullable: true },
                status: { type: 'string', enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'], description: 'タスクの状態', nullable: true },
                tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'タグ名の配列',
                    nullable: true
                }
            },
            required: ['title', 'description', 'dueDate']
        }
    },
    {
        name: 'deleteTaskById',
        description: '指定したIDのタスクを削除します。IDが不明な場合はdisplayTasks関数を使用してタスクIDを取得してください。',
        parameters: {
            type: 'object',
            properties: {
                id: { type: 'string', description: '削除するタスクのID' }
            },
            required: ['id']
        }
    },
    {
        name: 'suggestNextTasks',
        description: '現在のタスクに関連する次のタスクをAIが提案します。',
        parameters: {
            type: 'object',
            properties: {
                currentTaskId: { type: 'string', description: '現在のタスクのID' }
            },
            required: ['currentTaskId']
        }
    },

];