import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { auth } from "@/auth";
import { updateTaskById } from "@/lib/taskActions";




export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

    const session = await auth();
    if (!session) {
        return NextResponse.json({ 
            status: 'error',
            message: 'Unauthorized'
        }, { status: 401 });
    }

    const { id } = await params;
    const task = await prisma.task.findUnique({
        where: { id },
        include: { tags: true, subject: true }
    });

    return NextResponse.json({
        status: 'success',
        message: 'success to get task',
        data: task
    }, { status: 200 });
}


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ 
            status: 'error',
            message: 'Unauthorized'
        }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();

    const updatedTask = updateTaskById(id, body);

    return NextResponse.json({
        status: 'success',
        message: 'タスクを更新しました',
        data: updatedTask
    }, { status: 200 });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ 
            status: 'error',
            message: 'Unauthorized'
        }, { status: 401 });
    }
    const { id } = await params;

    await prisma.task.delete({
        where: { id }
    });

    return NextResponse.json({
        status: 'success',
        message: 'タスクを削除しました',
        data: null
    }, { status: 200 });
}