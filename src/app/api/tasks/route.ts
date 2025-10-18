import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';
import type { Prisma, TaskStatus } from '@/generated/prisma/client';
import { auth } from '@/../auth';


export async function GET(req: NextRequest) {

    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }
    const uid = session.user.id;

    const searchParams = req.nextUrl.searchParams;
    const sort: string = searchParams.get('sort') ?? 'dueDate'; 
    const order: string = searchParams.get('order') ?? 'asc';
    const statusParam = searchParams.get('status');
    const subjectId: string | undefined = searchParams.get('subject') ?? undefined;
    const limit: number = Number(searchParams.get('limit')) || 20;
    const skip: number = Number(searchParams.get('skip')) || 0;


    const where: Prisma.TaskWhereInput = { userId: uid! };
    if (statusParam) {
        const statusArray = statusParam.split('+').map(s => s.trim());
        if (statusArray.length === 1) {
            where.status = statusArray[0] as TaskStatus;
        } else {
            where.status = { in: statusArray as TaskStatus[] };
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

    return NextResponse.json({ 
        status: 'success', 
        message: '', 
        data: {
            tasks,
            totalCount
        }
    }, { status: 200 });
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }
    const uid = session.user.id;

    const { title, description, dueDate, subjectId, status, tags } = await req.json();

    if (!title || !dueDate) {
        return NextResponse.json({ 
            status: 'error',
            message: 'title and description is required'
        }, { status: 400 });
    }

    try {
        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                dueDate: new Date(dueDate),
                userId: uid!,
                subjectId: subjectId ?? null,
                status: status ?? 'NOT_STARTED',
                tags: tags && Array.isArray(tags)
                    ? {
                        connectOrCreate: tags.map((tagName: string) => ({
                            where: { name: tagName },
                            create: { name: tagName }
                        }))
                    }
                    : undefined
            },
            include: { tags: true, subject: true, tests: true }
            
        });

        return NextResponse.json({ 
            status: 'success',
            message: 'created new task',
            data: newTask
        }, { status: 201 });
    } catch (err) {

        console.error(err);
        return NextResponse.json({ 
            status: 'error',
            message: error
        }, { status: 500 });
    }
}