import { NextRequest, NextResponse } from 'next/server';
import { suggestNextTasks } from '@/lib/taskActions';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {

    const session = await auth();
        if (!session) {
            return NextResponse.json({ 
                status: 'error',
                message: 'Unauthorized'
            }, { status: 401 });
    }
    const userId = session.user?.id;
    if (!userId) {
        return NextResponse.json({ 
            status: 'error',
            message: 'User ID is missing'
        }, { status: 500 });
    }

    try {
        const { currentTask } = await req.json();
        const suggestedTasks = await suggestNextTasks(userId, currentTask);
        return NextResponse.json({ 
            status: 'success',
            data: suggestedTasks
        }, { status: 200 });
    } catch (error) {
        console.error('Error generating tasks:', error);
        return NextResponse.json({ 
            status: 'error',
            message: 'Failed to generate tasks'
        }, { status: 500 });
    }
}   