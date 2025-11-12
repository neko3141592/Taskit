import { NextRequest, NextResponse } from "next/server";
import { getTestById } from "@/lib/testActions";
import { auth } from "@/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }


    const { id } = await params;

    const testData = await getTestById(id);

    if (!testData) {
        return NextResponse.json({ 
            status: 'error',
            message: 'タスクが見つかりません'
        }, { status: 404 });
    }

    return NextResponse.json({ 
        status: "success", 
        message: "successfully fetched task",
        data: testData 
    });
}