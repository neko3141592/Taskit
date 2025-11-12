import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createTest, getTestsByUserId } from "@/lib/testActions";


export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }
    const uid = session.user.id;

    const { name, startDate, endDate } = await req.json();

    const test = await createTest(uid, { name, startDate: new Date(startDate), endDate: new Date(endDate) });

    return NextResponse.json(test);
}

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }
    const uid = session.user.id;

    const tests = await getTestsByUserId(uid);

    return NextResponse.json(tests);
}