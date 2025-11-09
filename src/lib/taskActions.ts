import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';

export async function getTaskById(id: string) {
    try {
        return await prisma.task.findUnique({
            where: { id },
            include: { tags: true, subject: true }
        });
    } catch (error) {
        console.error('getTaskById error:', error);
        throw error;
    }
}

export async function getTasks(options: {
    userId: string;
    statusParam?: string;
    subjectId?: string;
    sort?: string;
    order?: string;
    limit?: number;
    skip?: number;
    dueDateFrom?: string;
    dueDateTo?: string;
}) {
    try {
        const {
            userId,
            statusParam,
            subjectId,
            sort = 'dueDate',
            order = 'asc',
            limit = 20,
            skip = 0,
            dueDateFrom,
            dueDateTo
        } = options;

        const where: Prisma.TaskWhereInput = { userId };
        if (statusParam) {
            const statusArray = statusParam.split('+').map(s => s.trim());
            if (statusArray.length === 1) {
                where.status = statusArray[0] as unknown as TaskStatus;
            } else {
                where.status = { in: statusArray as unknown as TaskStatus[] };
            }
        }
        if (subjectId) where.subjectId = subjectId;

        if (dueDateFrom || dueDateTo) {
            where.dueDate = {};
            if (dueDateFrom) {
                where.dueDate.gte = new Date(dueDateFrom);
            }
            if (dueDateTo) {
                where.dueDate.lte = new Date(dueDateTo);
            }
        }

        const orderBy: { [key: string]: string } = {};
        orderBy[sort] = order;

        const tasks = await prisma.task.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            include: { tags: true, subject: true }
        });

        const totalCount = await prisma.task.count({ where });

        return { tasks, totalCount };
    } catch (error) {
        console.error('getTasks error:', error);
        throw error;
    }
}

export async function updateTaskById(id: string, body: Task & { tags?: string[] }) {
    try {
        return await prisma.task.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                status: body.status,
                dueDate: body.dueDate,
                subjectId: body.subjectId,
                tags: body.tags
                    ? {
                        set: [],
                        connectOrCreate: body.tags.map((tag: string) => ({
                            where: { name: tag },
                            create: { name: tag }
                        }))
                    }
                    : undefined,
                pages: body.pages as unknown as Prisma.InputJsonValue,
            },
            include: { tags: true, subject: true }
        });
    } catch (error) {
        console.error('updateTaskById error:', error);
        throw error;
    }
}

export async function createTask(data: {
    title: string;
    description: string;
    dueDate: string;
    userId: string;
    subjectId?: string;
    status?: string;
    tags?: string[];
}){
    try {
        return await prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                dueDate: new Date(data.dueDate),
                userId: data.userId,
                subjectId: data.subjectId ?? null,
                status: data.status as unknown as TaskStatus ?? 'NOT_STARTED',
                tags: data.tags && Array.isArray(data.tags)
                    ? {
                        connectOrCreate: data.tags.map((tagName: string) => ({
                            where: { name: tagName },
                            create: { name: tagName }
                        }))
                    }
                    : undefined
            },
            include: { tags: true, subject: true, tests: true }
        });
    } catch (error) {
        console.error('createTask error:', error);
        throw error;
    }
}

export async function deleteTaskById(id: string): Promise<void> {
    try {
        await prisma.task.delete({
            where: { id }
        });
    } catch (error) {
        console.error('deleteTaskById error:', error);
        throw error;
    }
}

export async function suggestNextTasks(userId: string, currentTask: Task): Promise<Task[]> {
    try {
        const { tasks } = await getTasks({ userId, statusParam: 'NOT_STARTED+IN_PROGRESS', sort: 'dueDate', order: 'asc', limit: 10 });
        const prompt = `
            現在のタスクの情報を与えるので、次に実行するタスクを提案してください。提案したタスクのidの配列を「コードブロックやバッククォートを使わず、純粋なJSON配列のみ」で返してください。提案は5個以内(なるべく5個)にし、とくに関連が深いタスクを選んでください。
            現在のタスク:
            ${
                `{
                    id:${currentTask.id},
                    title:${currentTask.title},
                    description:${currentTask.description},
                    dueDate: ${currentTask.dueDate},
                    subject: ${currentTask.subject?.name}
                }`
            }
            あなたが選ぶべきタスク一覧:[
                ${
                    tasks.map((task) => (
                        `{
                            id:${task.id},
                            title:${task.title},
                            description:${task.description},
                            dueDate: ${task.dueDate},
                            subject: ${task.subject?.name}
                        }`
                    ))
                }
            ]
        `;

        const response = await fetch(`${process.env.OPENAI_API_URL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: `${process.env.OPENAI_API_MODEL}`,
                messages: [
                    { role: 'system', content: 'あなたは優秀なタスク管理アシスタントです。次に実行するべき現在のタスクと関連が深いタスクを5個以内で提案します。提案はタスクのidの配列(string[])で返してください。' },
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const taskIdsString = data.choices[0].message.content.trim();
        console.log('LLM Response:', taskIdsString);
        const taskIds = JSON.parse(taskIdsString) as string[];
        console.log('Suggested Task IDs:', taskIds);
        const suggestedTasks = tasks.filter(task => taskIds.includes(task.id) && task.id !== currentTask.id);
        return suggestedTasks as unknown as Task[];
    } catch (error) {
        console.error('suggestNextTasks error:', error);
        throw error;
    }
}