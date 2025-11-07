import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { markNotificationAsRead } from '@/lib/notificationActions';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
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
            message: 'User ID not found in session'
        }, { status: 400 });
    }

    await markNotificationAsRead(userId, id);

    return NextResponse.json({
        status: 'success',
        message: 'Notification marked as read successfully'
    }, { status: 200 });
}
