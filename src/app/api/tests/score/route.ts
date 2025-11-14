import { NextRequest, NextResponse } from "next/server";
import { createSubject, deleteSubject, updateSubject } from "@/lib/testActions";
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

    createSubject(uid, {
        value: body.value,
        maxValue: body.maxValue,
        userId: body.userId,
        subjectId: body.subjectId,
        testId: body.testId,
    });

    return NextResponse.json({
        status: "success",
        message: "created new subject"
    }, { status: 201 });
}

export async function PATCH (req: NextRequest) {
    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }

    const body: Score = await req.json();

    await updateSubject(body.id, {
            value: body.value,
            maxValue: body.maxValue,
    });

    return NextResponse.json({
        status: "success",
        message: "updated subject"
    }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ 
            status: 'error',
            message: '認証されていません'
        }, { status: 401 });
    }
    const uid = session.user.id;
    const body = await req.json();

    const subjectId = body.id;


    return NextResponse.json({
        status: "success",
        message: "deleted subject"
    }, { status: 200 });
}