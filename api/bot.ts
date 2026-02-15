import { Client } from '@notionhq/client'
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
    const DB_ID = (process.env.NOTION_BLOG_DATABASE_ID || process.env.BLOG_DB_ID || '').trim()

    try {
        if (!TOKEN || !DB_ID) throw new Error("Config missing on Vercel.")

        const notion = new Client({ auth: TOKEN })

        // 4. Query Notion
        // Using explicit paths to avoid "not a function" errors in some builds
        const response = await notion.databases.query({
            database_id: DB_ID,
            filter: {
                property: 'Trigger',
                rich_text: { equals: trigger }
            }
        })

        let replyMessage = ""

        if (response.results && response.results.length > 0) {
            const page = response.results[0] as any
            const props = page.properties
            const templateProp = props['Template '] || props['Template'] || props['Reply']

            if (templateProp && templateProp.rich_text && templateProp.rich_text.length > 0) {
                replyMessage = templateProp.rich_text.map((t: any) => t.plain_text).join('')
            }
        }

        if (!replyMessage) {
            replyMessage = `SOR7ED Bot: Protocol "${trigger}" not found. Text INDEX for options.`
        }

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${replyMessage}</Message></Response>`)

    } catch (error: any) {
        console.error('Bot Error:', error)
        let msg = error.message || 'Unknown Error'
        if (error.code === 'object_not_found') {
            msg = `Notion Database not found. Please click "..." -> "Add Connections" in Notion and select "SOR7ED".`
        }

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>⚠️ BOT ERROR: ${msg}</Message></Response>`)
    }
}
