import { NextRequest, NextResponse } from 'next/server';
import { generateTags } from '@/lib/tagActions';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const title = searchParams.get('title') || '';
        const description = searchParams.get('description') || '';
        const existingTagsParam = searchParams.get('existingTags') || '';
        const existingTags = existingTagsParam ? existingTagsParam.split(',').map(tag => tag.trim()) : [];
        const tags = await generateTags(title, description, existingTags);
        return NextResponse.json({ 
            status: 'success',
            data: tags
        }, { status: 200 });
    } catch (error) {
        console.error('Error generating tags:', error);
        return NextResponse.json({ 
            status: 'error',
            message: 'Failed to generate tags'
        }, { status: 500 });
    }
}