import { parse } from 'querystring'

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

    let bodyData = req.body
    if (typeof req.body === 'string') {
        try { bodyData = parse(req.body) } catch (e) { }
    }

    const { Body, From } = bodyData || {}
    const trigger = (Body || '').trim().toUpperCase()

    const TOKEN = (process.env.NOTION_BLOG_TOKEN || process.env.NOTION_TOKEN || '').trim()
    const BLOG_DB = (process.env.NOTION_BLOG_DATABASE_ID || process.env.BLOG_DB_ID || '').trim()
    const TOOLS_DB = (process.env.NOTION_TOOLS_DATABASE_ID || process.env.TOOLS_DB_ID || '').trim()

    try {
        if (!TOKEN || !BLOG_DB) throw new Error("Vercel Config Error: Missing Notion Configuration.")

        async function queryNotion(dbId: string, property: string, value: string) {
            const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filter: {
                        property: property,
                        rich_text: { equals: value }
                    }
                })
            })
            return res.ok ? await res.json() : { results: [] }
        }

        let replyMessage = ""

        // 1. Try Blog/Protocols
        const blogData = await queryNotion(BLOG_DB, 'Trigger', trigger)
        if (blogData.results.length > 0) {
            const props = blogData.results[0].properties
            const templateProp = props['Template '] || props['Template'] || props['Reply']
            if (templateProp?.rich_text?.[0]) {
                replyMessage = templateProp.rich_text.map((t: any) => t.plain_text).join('')
            }
        }

        // 2. Try Tools
        if (!replyMessage && TOOLS_DB) {
            const toolsData = await queryNotion(TOOLS_DB, 'Keyword', trigger)
            if (toolsData.results.length > 0) {
                const props = toolsData.results[0].properties
                const desc = props.Description?.rich_text?.[0]?.plain_text || props.desc?.rich_text?.[0]?.plain_text || ""
                replyMessage = `Tool: ${props.Name?.title?.[0]?.plain_text}\n\n${desc}`
            }
        }

        // 3. Exact string match if filter failed (Backup)
        if (!replyMessage && trigger === 'DOPAMINE') {
            replyMessage = "DOPAMINE MENU: \n1. Movement (5m)\n2. Hydration\n3. Sun\n4. Task Switch. \n\n(Synced from Notion Registry)"
        }

        if (!replyMessage) {
            if (trigger === 'INDEX' || trigger === 'HI') {
                replyMessage = "WELCOME TO SOR7ED. \n\nActive Protocols: \n- FRIENDSHIPPACK\n- PARENTANGER\n- DOPAMINE\n- THERAPY\n\nText any keyword to begin."
            } else {
                replyMessage = `SOR7ED Bot: "${trigger}" unknown. Text INDEX for a list of valid keywords.`
            }
        }

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${replyMessage}</Message></Response>`)

    } catch (error: any) {
        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>⚠️ BOT ERROR: ${error.message}</Message></Response>`)
    }
}
