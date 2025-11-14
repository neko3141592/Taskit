export const AVAILABLE_FUNCTIONS = [
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
        name: 'getTaskById',
        description: '指定したIDのタスク詳細を取得します。',
        parameters: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'タスクのID'
            }
        },
        required: ['id']
        }
    },
    {
        name: 'createTask',
        description: '新しいタスクを作成します。',
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
        name: 'updateTaskById',
        description: '指定したIDのタスクを更新します。',
        parameters: {
        type: 'object',
        properties: {
            id: { type: 'string', description: 'タスクのID' },
            title: { type: 'string', description: '新しいタイトル', nullable: true },
            description: { type: 'string', description: '新しい詳細', nullable: true },
            status: { type: 'string', enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'], description: '新しい状態', nullable: true },
            dueDate: { type: 'string', description: '新しい期限（ISO8601形式）', nullable: true },
            subjectId: { type: 'string', description: '新しい教科ID', nullable: true },
            tags: {
                type: 'array',
                items: { type: 'string' },
                description: '新しいタグ名の配列',
                nullable: true
            },
            pages: {
                type: 'array',
                items: { type: 'object' },
                description: 'ページ情報（任意）',
                nullable: true
            }
        },
        required: ['id']
        }
    },
    {
        name: 'deleteTaskById',
        description: '指定したIDのタスクを削除します。',
        parameters: {
            type: 'object',
            properties: {
                id: { type: 'string', description: '削除するタスクのID' }
            },
            required: ['id']
        }
    }
];