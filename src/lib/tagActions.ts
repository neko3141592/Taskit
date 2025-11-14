export async function generateTags(title: string, description: string, existingTags: string[] = []): Promise<string[]> {
    try {
        if (!process.env.OPENAI_API_URL || !process.env.OPENAI_API_KEY || !process.env.OPENAI_API_MODEL) {
            throw new Error('OpenAI APIの環境変数が設定されていません');
        }
        if (!title) {
            throw new Error('title is required');
        }

        const prompt = `
            以下のタスクのタイトルと説明から、関連するタグを日本語で3~5個生成してください。他のタスクで使われているタグも渡すので、それも参考にしてください。
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
                temperature: 0.2
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.choices || !data.choices[0]?.message?.content) {
            throw new Error('OpenAI APIのレスポンスが不正です');
        }
        const tagString = data.choices[0].message.content.trim();
        const tags = tagString.split(',').map((tag: string) => tag.trim());
        return tags;
    } catch (error) {
        console.error('Error in generateTags:', error);
        throw error;
    }
}