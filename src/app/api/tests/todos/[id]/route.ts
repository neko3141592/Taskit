import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }

    try {
        const { id } = await context.params;
        const { completed } = await req.json();

        // Todoのテストが自分のものか確認
        const todo = await prisma.todo.findUnique({
            where: { id },
            include: { test: true }
        });

        if (!todo || todo.test.userId !== session.user.id) {
            return NextResponse.json({ 
                status: 'error',
                message: 'Todoが見つかりません'
            }, { status: 404 });
        }

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: { completed }
        });

        return NextResponse.json({ 
            status: 'success',
            data: updatedTodo
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating todo:', error);
        return NextResponse.json({ 
            status: 'error',
            message: 'Todoの更新に失敗しました'
        }, { status: 500 });
    }
}
