import { Client } from '@notionhq/client'
import { parse } from 'querystring'

// Blog/Protocols Notion Client
const blogNotion = new Client({ auth: process.env.NOTION_BLOG_TOKEN })
const BLOG_DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID

// Tools Notion Client
const toolsNotion = new Client({ auth: process.env.NOTION_TOOLS_TOKEN })
const TOOLS_DATABASE_ID = process.env.NOTION_TOOLS_DATABASE_ID

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed')
    }

    let bodyData = req.body
    if (typeof req.body === 'string') {
        bodyData = parse(req.body)
    }

    const { Body, From } = bodyData || {}
    const message = (Body || '').trim()
    const trigger = message.toUpperCase()

    console.log(`Bot received: "${message}" from ${From}`)

    try {
        let replyMessage = ""

        // 1. Search Protocols (Blog) Database
        if (BLOG_DATABASE_ID) {
            const blogRes = await blogNotion.databases.query({
                database_id: BLOG_DATABASE_ID,
                filter: {
                    property: 'Trigger',
                    rich_text: { equals: trigger }
                }
            })

            if (blogRes.results.length > 0) {
                const page = blogRes.results[0]
                const props = (page as any).properties
                const templateProp = props['Template '] || props['Template']

                if (templateProp && templateProp.rich_text) {
                    replyMessage = templateProp.rich_text.map((t: any) => t.plain_text).join('')
                }
            }
        }

        // 2. Search Tools Database (if not found in Protocols)
        if (!replyMessage && TOOLS_DATABASE_ID) {
            const toolsRes = await toolsNotion.databases.query({
                database_id: TOOLS_DATABASE_ID,
                filter: {
                    property: 'Keyword',
                    rich_text: { equals: trigger }
                }
            })

            if (toolsRes.results.length > 0) {
                const page = toolsRes.results[0]
                const props = (page as any).properties
                // For tools, we might use Description or a specific WhatsApp field if it existed
                // Based on previous inspections, Description is most likely
                const descProp = props.Description
                if (descProp && descProp.rich_text) {
                    replyMessage = descProp.rich_text.map((t: any) => t.plain_text).join('')
                }
            }
        }

        // 3. Fallback if no keyword found in either DB
        if (!replyMessage) {
            // No random AI info, just a strict lookup failure message
            replyMessage = `Protocol "${trigger}" not found in S0R7ED registry. \n\nText "INDEX" for available keywords.`
        }

        // Return TwiML XML response
        const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${replyMessage}</Message>
</Response>`

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(twiml)

    } catch (error: any) {
        console.error('Bot Error:', error)
        res.setHeader('Content-Type', 'text/xml')
        return res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><Response><Message>System error. Try again later.</Message></Response>')
    }
}
