import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';


export async function getTaskById(id: string) {
    return prisma.task.findUnique({
        where: { id },
        include: { tags: true, subject: true }
    });
}

export async function getTasks(options: {
    userId: string;
    statusParam?: string;
    subjectId?: string;
    sort?: string;
    order?: string;
    limit?: number;
    skip?: number;
}) {
    const {
        userId,
        statusParam,
        subjectId,
        sort = 'dueDate',
        order = 'asc',
        limit = 20,
        skip = 0
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
}

export async function updateTaskById(id: string, body: Task) {
    return prisma.task.update({
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
                    connectOrCreate: body.tags.map((tag: Tag) => ({
                        where: { name: tag.name },
                        create: { name: tag.name }
                    }))
                }
                : undefined,
            pages: body.pages as unknown as Prisma.InputJsonValue,
        },
        include: { tags: true, subject: true }
    });
}

export async function createTask(data: {
    title: string;
    description: string;
    dueDate: string;
    userId: string;
    subjectId?: string;
    status?: string;
    tags?: string[];
}) {
    return prisma.task.create({
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
}
