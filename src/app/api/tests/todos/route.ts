import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }

    try {
        const searchParams = req.nextUrl.searchParams;
        const testId = searchParams.get('testId');

        if (!testId) {
            return NextResponse.json({ 
                status: 'error',
                message: 'testId is required'
            }, { status: 400 });
        }

        // テストが自分のものか確認
        const test = await prisma.test.findUnique({
            where: { 
                id: testId,
                userId: session.user.id
            }
        });

        if (!test) {
            return NextResponse.json({ 
                status: 'error',
                message: 'テストが見つかりません'
            }, { status: 404 });
        }

        const todos = await prisma.todo.findMany({
            where: { testId },
            orderBy: { step: 'asc' }
        });

        return NextResponse.json({ 
            status: 'success',
            data: todos
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching todos:', error);
        return NextResponse.json({ 
            status: 'error',
            message: 'Todoの取得に失敗しました'
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }

    try {
        const { testId, step, title, description, dueDate, estimatedMinutes } = await req.json();

        if (!testId || !title) {
            return NextResponse.json({ 
                status: 'error',
                message: 'testId and title are required'
            }, { status: 400 });
        }

        const test = await prisma.test.findUnique({
            where: { 
                id: testId,
                userId: session.user.id
            }
        });

        if (!test) {
            return NextResponse.json({ 
                status: 'error',
                message: 'テストが見つかりません'
            }, { status: 404 });
        }

        const todo = await prisma.todo.create({
            data: {
                testId,
                step: step || 1,
                title,
                description: description || '',
                dueDate: dueDate ? new Date(dueDate) : new Date(),
                estimatedMinutes: estimatedMinutes || 0,
            }
        });

        return NextResponse.json({ 
            status: 'success',
            message: 'Todoを作成しました',
            data: todo
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating todo:', error);
        return NextResponse.json({ 
            status: 'error',
            message: 'Todoの作成に失敗しました'
        }, { status: 500 });
    }
}
