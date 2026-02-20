import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOOLS_KEY || process.env.NOTION_API_KEY })
const TOOLS_DB_ID = process.env.NOTION_TOOLS_DB_ID!

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
        const response = await (notion.databases as any).query({
            database_id: TOOLS_DB_ID,
            filter: {
                property: 'Status',
                status: { equals: 'Published' }
            },
            sorts: [{ property: 'Name', direction: 'ascending' }],
        })

        const tools = (response.results as any[]).map((page: any) => {
            const props = page.properties
            const branch = props.Branch?.select?.name || ''
            return {
                id: props.Slug?.rich_text?.[0]?.plain_text || page.id,
                emoji: props.Emoji?.rich_text?.[0]?.plain_text || '🔧',
                name: props.Name?.title?.[0]?.plain_text || 'Untitled',
                description: props.Description?.rich_text?.[0]?.plain_text || '',
                whatsappKeyword: props['WhatsApp Keyword']?.rich_text?.[0]?.plain_text || '',
                category: branch,
                branchColor: BRANCH_COLORS[branch] || '#F5C614',
            }
        })

        res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
        return res.status(200).json(tools)
    } catch (error: any) {
        console.error('Failed to fetch tools:', error.message)
        return res.status(500).json({ error: 'Failed to fetch tools', message: error.message })
    }
}
