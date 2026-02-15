import { parse } from 'querystring'

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

    let bodyData = req.body
    if (typeof req.body === 'string') {
        try { bodyData = parse(req.body) } catch (e) { }
    }

    const { Body, From } = bodyData || {}
    const trigger = (Body || '').trim().toUpperCase()

    const TOKEN_BLOG = (process.env.NOTION_BLOG_TOKEN || process.env.NOTION_TOKEN || '').trim()
    const TOKEN_TOOLS = (process.env.NOTION_TOOLS_TOKEN || process.env.NOTION_TOKEN || '').trim()
    const DB_BLOG = (process.env.NOTION_BLOG_DATABASE_ID || process.env.BLOG_DB_ID || '').trim()
    const DB_TOOLS = (process.env.NOTION_TOOLS_DATABASE_ID || process.env.TOOLS_DB_ID || '').trim()

    try {
        if (!TOKEN_BLOG || !DB_BLOG) throw new Error("Vercel Config Error: Missing Notion Configuration.")

        // PARALLEL SEARCH: Check both Protocols (Blog) and Tools databases simultaneously
        const [blogRes, toolsRes] = await Promise.all([
            fetch(`https://api.notion.com/v1/databases/${DB_BLOG}/query`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${TOKEN_BLOG}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
                body: JSON.stringify({ page_size: 100 })
            }),
            DB_TOOLS ? fetch(`https://api.notion.com/v1/databases/${DB_TOOLS}/query`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${TOKEN_TOOLS}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
                body: JSON.stringify({ page_size: 100 })
            }) : Promise.resolve({ ok: true, json: () => Promise.resolve({ results: [] }) })
        ])

        if (!blogRes.ok) throw new Error("Notion Blog API Failed.")

        const [blogData, toolsData]: [any, any] = await Promise.all([
            blogRes.json(),
            toolsRes.ok ? toolsRes.json() : Promise.resolve({ results: [] })
        ])

        let replyMessage = ""

        // 1. Check Blog/Protocols (Match on 'Trigger' property)
        const blogMatch = blogData.results.find((page: any) => {
            const props = page.properties
            const nodeTrigger = props.Trigger?.rich_text?.[0]?.plain_text || ""
            return nodeTrigger.trim().toUpperCase() === trigger
        })

        if (blogMatch) {
            const props = blogMatch.properties
            const templateProp = props['Template '] || props['Template'] || props['Reply']
            if (templateProp?.rich_text?.[0]) {
                replyMessage = templateProp.rich_text.map((t: any) => t.plain_text).join('')
            }
        }

        // 2. Check Tools (Match on 'Keyword' property if not found in Blog)
        if (!replyMessage) {
            const toolMatch = toolsData.results.find((page: any) => {
                const props = page.properties
                const nodeKeyword = props.Keyword?.rich_text?.[0]?.plain_text || ""
                return nodeKeyword.trim().toUpperCase() === trigger
            })

            if (toolMatch) {
                const props = toolMatch.properties
                const desc = props.Description?.rich_text?.[0]?.plain_text || props.desc?.rich_text?.[0]?.plain_text || ""
                replyMessage = `Tool: ${props.Name?.title?.[0]?.plain_text}\n\n${desc}`
            }
        }

        // 3. Fallbacks
        if (!replyMessage) {
            if (trigger === 'HI' || trigger === 'HELLO' || trigger === 'INDEX') {
                const protocolCount = blogData.results.filter((p: any) => p.properties.Trigger?.rich_text?.[0]).length
                replyMessage = `Welcome to SOR7ED Bot. We have ${protocolCount} protocols live. \n\nKeywords include: FRIEND, PARENTANGER, THERAPY, REGULATION. \n\nText any keyword to begin.`
            } else {
                replyMessage = `SOR7ED Bot: "${trigger}" not found. Text HI or INDEX for active keywords.`
            }
        }

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${replyMessage}</Message></Response>`)

    } catch (error: any) {
        console.error('Bot Error:', error)
        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>⚠️ BOT ERROR: ${error.message}</Message></Response>`)
    }
}
