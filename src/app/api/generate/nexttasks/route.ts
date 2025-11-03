import { NextRequest, NextResponse } from 'next/server';
import { suggestNextTasks } from '@/lib/taskActions';

export async function POST(req: NextRequest) {
    try {
        const { userId, currentTask } = await req.json();
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