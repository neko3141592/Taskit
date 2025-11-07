import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getNotifications } from "@/lib/notificationActions";

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

    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const notifications = await getNotifications(userId, skip, limit);

    return NextResponse.json({
        status: 'success',
        message: 'Notifications fetched successfully',
        data: notifications
    }, { status: 200 });

}