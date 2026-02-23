import type { VercelRequest, VercelResponse } from '@vercel/node'

const NOTION_API_KEY = (process.env.NOTION_API_KEY || '').trim()
const TOOLS_DB_ID = (process.env.NOTION_TOOLS_DB_ID || '').trim()

const BRANCH_COLORS: Record<string, string> = {
    MIND: '#9B59B6',
    WEALTH: '#27AE60',
    BODY: '#E74C3C',
    TECH: '#3498DB',
    CONNECTION: '#E67E22',
    IMPRESSION: '#F39C12',
    GROWTH: '#16A085',
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
    try {
        if (!NOTION_API_KEY || !TOOLS_DB_ID) {
            console.error('Missing Notion Configuration: NOTION_API_KEY or NOTION_TOOLS_DB_ID')
            return res.status(500).json({ error: 'System configuration error' })
        }

        const response = await fetch(`https://api.notion.com/v1/databases/${TOOLS_DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Status',
                    status: { equals: 'Published' }
                },
                sorts: [{ property: 'Name', direction: 'ascending' }]
            })
        })

        if (!response.ok) {
            const errorBody = await response.text()
            console.error('Notion API Error (Tools):', errorBody)
            return res.status(response.status).json({ error: 'Notion connection failed' })
        }

        const data = await response.json()
        if (!data.results) {
            return res.status(200).json([])
        }

        const tools = data.results.map((page: any) => {
            const props = page.properties
            const branch = props.Branch?.select?.name || ''
            return {
                id: props.Slug?.rich_text?.[0]?.plain_text || page.id,
                emoji: props.Emoji?.rich_text?.[0]?.plain_text || '🔧',
                name: props.Name?.title?.[0]?.plain_text || 'Untitled',
                description: props.Description?.rich_text?.[0]?.plain_text || props['Meta Description']?.rich_text?.[0]?.plain_text || '',
                whatsappKeyword: props['WhatsApp Keyword']?.rich_text?.[0]?.plain_text || '',
                category: branch,
                branchColor: BRANCH_COLORS[branch.toUpperCase()] || '#F5C614',
            }
        })

        res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
        return res.status(200).json(tools)
    } catch (error: any) {
        console.error('Failed to fetch tools:', error.message)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}

