import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOOLS_KEY })
const TOOLS_DB_ID = process.env.NOTION_TOOLS_DB_ID!

// Branch → color map (matches branches.ts)
const BRANCH_COLORS: Record<string, string> = {
    MIND: '#9B59B6',
    WEALTH: '#27AE60',
    BODY: '#E74C3C',
    TECH: '#3498DB',
    CONNECTION: '#E67E22',
    IMPRESSION: '#F39C12',
    GROWTH: '#16A085',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const NOTION_TOKEN = process.env.NOTION_TOOLS_KEY || process.env.NOTION_API_KEY;
    const DATABASE_ID = process.env.NOTION_TOOLS_DB_ID;

    if (!NOTION_TOKEN || !DATABASE_ID) {
        console.error('Missing Notion Configuration for Tools');
        return res.status(500).json({ error: 'Missing environment variables' });
    }

    try {
        const url = `https://api.notion.com/v1/databases/${DATABASE_ID}/query`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Status',
                    status: { equals: 'Live' } // Changed from select to status
                },
                sorts: [{ property: 'Name', direction: 'ascending' }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Notion API Error (${response.status}):`, errorText);
            return res.status(response.status).json({ error: 'Notion API failure', details: errorText });
        }

        const data = await response.json() as any;
        const tools = data.results.map((page: any) => {
            const props = page.properties;
            const branch = props.Branch?.select?.name || '';
            const emojiText = props.Emoji?.rich_text?.[0]?.plain_text || '🔧';

            return {
                id: props.Slug?.rich_text?.[0]?.plain_text || page.id,
                emoji: emojiText,
                name: props.Name?.title?.[0]?.plain_text || 'Untitled',
                description: props.Description?.rich_text?.[0]?.plain_text || '',
                whatsappKeyword: props['WhatsApp Keyword']?.rich_text?.[0]?.plain_text || '',
                category: branch,
                branchColor: BRANCH_COLORS[branch] || '#F5C614',
            };
        });

        res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59');
        return res.status(200).json(tools);
    } catch (error: any) {
        console.error('Fetch operation failed for tools:', error.message);
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
