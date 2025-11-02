import OpenAI from 'openai';

export async function generateTags(title: string, description: string, existingTags: string[] = []): Promise<string[]> {
    const prompt = `
        以下のタスクのタイトルと説明から、関連するタグを3~5個生成してください。他のタスクで使われているタグも渡すので、それも参考にしてください。
        タイトル: ${title},
        説明: ${description},
        他のタスクで使われているタグ: ${existingTags.join(', ')}
    `;
    console.log(`endpoint ${process.env.OPENAI_API_URL}/v1/chat/completions`);
    const response = await fetch(`${process.env.OPENAI_API_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: `${process.env.OPENAI_API_MODEL}`,
            messages: [
                { role: 'system', content: 'あなたは優秀なタグ抽出アシスタントです。あなたはタグをカンマ区切りで出力します。' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 100,
            temperature: 0.7
        })
    });

    const data = await response.json();
    const tagString = data.choices[0].message.content.trim();
    const tags = tagString.split(',').map((tag: string) => tag.trim());
    return tags;
}

