import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createTask, getTasks } from '@/lib/taskActions';

// 共通化完了
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
    const sort = searchParams.get('sort') ?? 'dueDate'; 
    const order = searchParams.get('order') ?? 'asc';
    const statusParam = searchParams.get('status') ?? undefined;
    const subjectId = searchParams.get('subject') ?? undefined;
    const limit = Number(searchParams.get('limit')) || 20;
    const skip = Number(searchParams.get('skip')) || 0;
    const dueDateFrom = searchParams.get('dueDateFrom') ?? undefined;
    const dueDateTo = searchParams.get('dueDateTo') ?? undefined;

    const { tasks, totalCount } = await getTasks({
        userId: uid,
        statusParam,
        subjectId,
        sort,
        order,
        limit,
        skip,
        dueDateFrom,
        dueDateTo
    });

    return NextResponse.json({ 
        status: 'success', 
        message: '', 
        data: { tasks, totalCount }
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
        const newTask = await createTask({
            title,
            description,
            dueDate,
            userId: uid,
            subjectId,
            status,
            tags
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
            message: String(err)
        }, { status: 500 });
    }
}