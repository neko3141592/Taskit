import { NextRequest, NextResponse } from "next/server";
import { callingFunction } from "@/lib/functionCalling";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {

    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }
    const uid = session.user.id;
    const body = await req.json();
    const messages = body.messages as Message[];
    const responseMessages = await callingFunction(messages, uid);
    return NextResponse.json(responseMessages);
}
