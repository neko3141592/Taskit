import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getNotificationCount } from "@/lib/notificationActions";


export async function GET(req: NextRequest) {
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
    const count: {all: number, read: number, unread: number} = await getNotificationCount(userId);
    return NextResponse.json(
        { 
            status: 'success', 
            message: 'Notification count retrieved successfully', 
            data: count 
        }, 
        { status: 200 }
    );
}