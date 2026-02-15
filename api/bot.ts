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
    const BLOG_DB_ID = (process.env.NOTION_BLOG_DATABASE_ID || process.env.BLOG_DB_ID || '').trim()
    const TOOLS_DB_ID = (process.env.NOTION_TOOLS_DATABASE_ID || process.env.TOOLS_DB_ID || '').trim()

    try {
        if (!TOKEN || !BLOG_DB_ID) throw new Error("Vercel Config Error: Missing Notion Configuration.")

        // 1. Check Blog/Articles Database
        const blogResponse = await fetch(`https://api.notion.com/v1/databases/${BLOG_DB_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Trigger',
                    rich_text: { equals: trigger }
                },
                page_size: 1
            })
        })

        const blogData = await blogResponse.json()
        let match = blogData.results?.[0]
        let replyMessage = ""

        if (match) {
            const props = match.properties
            const templateProp = props['Template '] || props['Template'] || props['Reply']
            if (templateProp?.rich_text?.length > 0) {
                replyMessage = templateProp.rich_text.map((t: any) => t.plain_text).join('')
            }
        }

        // 2. If no match, Check Tools Database
        if (!replyMessage && TOOLS_DB_ID) {
            const toolsResponse = await fetch(`https://api.notion.com/v1/databases/${TOOLS_DB_ID}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filter: {
                        property: 'WhatsApp CTA',
                        rich_text: { equals: trigger }
                    },
                    page_size: 1
                })
            })

            const toolsData = await toolsResponse.json()
            const toolMatch = toolsData.results?.[0]
            if (toolMatch) {
                const props = toolMatch.properties
                const templateProp = props['Template'] || props['Description']
                if (templateProp?.rich_text?.length > 0) {
                    replyMessage = templateProp.rich_text.map((t: any) => t.plain_text).join('')
                }
            }
        }

        if (!replyMessage) {
            if (trigger === 'INDEX' || trigger === 'HI') {
                replyMessage = "Welcome to SOR7ED Bot. \n\nActive Keywords: \n- FIDGET\n- FOCUS\n- BREAK\n- MOOD\n- ROUTINE\n- SOCIAL\n\nText any keyword from the registry to begin."
            } else {
                replyMessage = `SOR7ED Bot: "${trigger}" unknown. Text INDEX for valid keywords.`
            }
        }

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${replyMessage}</Message></Response>`)

    } catch (error: any) {
        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>⚠️ BOT ERROR: ${error.message}</Message></Response>`)
    }
}
