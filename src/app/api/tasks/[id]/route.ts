import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { Prisma, TaskStatus } from '@/generated/prisma/client';



export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { ok, error, uid } = await verifyFirebaseToken(req);
    if (!ok) {
        return NextResponse.json({ 
            status: 'error',
            message: error
        }, { status: 401 });
    }
    const { id } = await params;
    const task = await prisma.task.findUnique({
        where: { id },
        include: { tags: true, subject: true }
    });

    return NextResponse.json({
        status: 'success',
        message: 'タスクの取得に成功しました',
        data: task
    }, { status: 200 });
}


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const { ok, error, uid } = await verifyFirebaseToken(req);
    if (!ok) {
        return NextResponse.json({ 
            status: 'error',
            message: error
        }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();

    const updatedTask = await prisma.task.update({
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
            pages: body.pages, 
        },
        include: { tags: true, subject: true }
    });

    return NextResponse.json({
        status: 'success',
        message: 'タスクを更新しました',
        data: updatedTask
    }, { status: 200 });
}