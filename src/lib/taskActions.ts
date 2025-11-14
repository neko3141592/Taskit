import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';

export async function getTaskById(id: string) {
    try {
        if (!id) throw new Error('Task id is required');
        return await prisma.task.findUnique({
            where: { id },
            include: { tags: true, subject: true }
        });
    } catch (error) {
        console.error('getTaskById error:', error);
        throw new Error(`Failed to get task by id: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function getTasks(options: {
    userId?: string;
    statusParam?: string;
    subjectId?: string;
    testId?: string;
    sort?: string;
    order?: string;
    limit?: number;
    skip?: number;
    dueDateFrom?: string;
    dueDateTo?: string;
    title?: string; 
}) {
    try {
        const {
            userId,
            statusParam,
            subjectId,
            testId,
            sort = 'dueDate',
            order = 'asc',
            limit = 20,
            skip = 0,
            dueDateFrom,
            dueDateTo,
            title
        } = options;

        const where: Prisma.TaskWhereInput = {};
        if (userId) where.userId = userId;
        if (statusParam) {
            const statusArray = statusParam.split('+').map(s => s.trim());
            if (statusArray.length === 1) {
                where.status = statusArray[0] as unknown as TaskStatus;
            } else {
                where.status = { in: statusArray as unknown as TaskStatus[] };
            }
        }
        if (subjectId) where.subjectId = subjectId;
        if (testId) where.testId = testId;

        if (dueDateFrom || dueDateTo) {
            where.dueDate = {};
            if (dueDateFrom) {
                where.dueDate.gte = new Date(dueDateFrom);
            }
            if (dueDateTo) {
                where.dueDate.lte = new Date(dueDateTo);
            }
        }

        if (title) {
            where.title = { contains: title, mode: 'insensitive' };
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
        throw new Error(`Failed to get tasks: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function updateTaskById(id: string, body: Task & { tags?: string[] }) {
    try {
        if (!id) throw new Error('Task id is required');
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
        throw new Error(`Failed to update task: ${error instanceof Error ? error.message : String(error)}`);
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
        if (!data.title) throw new Error('Task title is required');
        if (!data.dueDate) throw new Error('Task dueDate is required');
        if (!data.userId) throw new Error('Task userId is required');
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
            include: { tags: true, subject: true, test: true }
        });
    } catch (error) {
        console.error('createTask error:', error);
        throw new Error(`Failed to create task: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function deleteTaskById(id: string): Promise<void> {
    try {
        if (!id) throw new Error('Task id is required');
        await prisma.task.delete({
            where: { id }
        });
    } catch (error) {
        console.error('deleteTaskById error:', error);
        throw new Error(`Failed to delete task: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function suggestNextTasks(userId: string, currentTask: Task): Promise<Task[]> {
    try {
        if (!userId) throw new Error('userId is required');
        if (!currentTask || !currentTask.id) throw new Error('currentTask is required');
        const { tasks } = await getTasks({ userId, statusParam: 'NOT_STARTED+IN_PROGRESS', sort: 'dueDate', order: 'asc', limit: 10 });
        const prompt = `
            Given the current task information, suggest the next tasks to do. Return an array of task ids (as pure JSON array, no code block or backticks). Suggest up to 5 tasks, focusing on those most related.
            Current task:
            ${
                `{
                    id:${currentTask.id},
                    title:${currentTask.title},
                    description:${currentTask.description},
                    dueDate: ${currentTask.dueDate},
                    subject: ${currentTask.subject?.name}
                }`
            }
            Available tasks:[
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
                    { role: 'system', content: 'You are a helpful task management assistant. Suggest up to 5 tasks most related to the current task. Return an array of task ids (string[]) only.' },
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
        let taskIds: string[];
        try {
            taskIds = JSON.parse(taskIdsString) as string[];
        } catch (parseError) {
            throw new Error(`Failed to parse LLM response: ${taskIdsString}`);
        }
        console.log('Suggested Task IDs:', taskIds);
        const suggestedTasks = tasks.filter(task => taskIds.includes(task.id) && task.id !== currentTask.id);
        return suggestedTasks as unknown as Task[];
    } catch (error) {
        console.error('suggestNextTasks error:', error);
        throw new Error(`Failed to suggest next tasks: ${error instanceof Error ? error.message : String(error)}`);
    }
}