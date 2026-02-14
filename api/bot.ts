import { Client } from '@notionhq/client'
import { parse } from 'querystring'

// @ts-ignore
const notion = new Client({ auth: process.env.NOTION_BLOG_TOKEN })
// @ts-ignore
const BLOG_DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed')
    }

    // Twilio sends application/x-www-form-urlencoded
    let bodyData = req.body
    if (typeof req.body === 'string') {
        bodyData = parse(req.body)
    }

    const { Body, From } = bodyData || {}
    const message = (Body || '').trim()
    const trigger = message.toUpperCase()

    console.log(`Bot received: "${message}" from ${From}`)

    try {
        if (!BLOG_DATABASE_ID) throw new Error('NOTION_BLOG_DATABASE_ID not set')

        // Search for the matching Trigger in the database
        const response = await (notion.databases as any).query({
            database_id: BLOG_DATABASE_ID,
            filter: {
                property: 'Trigger',
                rich_text: { equals: trigger }
            }
        })

        let replyMessage = ""

        if (response.results.length > 0) {
            const page = response.results[0]
            const props = (page as any).properties
            const templateProp = props['Template '] || props['Template']

            if (templateProp && templateProp.rich_text) {
                // Join all rich text blocks to handle Notion's 2000-char limit chunking
                replyMessage = templateProp.rich_text.map((t: any) => t.plain_text).join('')
            }
        }

        // If no protocol match, send a simple feedback message
        if (!replyMessage) {
            replyMessage = `Protocol "${trigger}" not found. \n\nText "INDEX" to see all available SOR7ED keywords.`
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
        const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>The SOR7ED system is currently under maintenance. Please try again soon.</Message>
</Response>`
        res.setHeader('Content-Type', 'text/xml')
        return res.status(500).send(errorTwiml)
    }
}
