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

    // Twilio sends application/x-www-form-urlencoded. 
    // Vercel only parses JSON by default.
    let bodyData = req.body
    if (typeof req.body === 'string') {
        bodyData = parse(req.body)
    }

    const { Body, From } = bodyData || {}
    const trigger = (Body || '').trim().toUpperCase()

    console.log(`Bot received: "${trigger}" from ${From}`)

    try {
        if (!BLOG_DATABASE_ID) throw new Error('NOTION_BLOG_DATABASE_ID not set')

        // 1. Query Notion for the matching Trigger
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
            // Note: Database has a trailing space in the "Template " property name
            const templateProp = props['Template '] || props['Template']

            if (templateProp && templateProp.rich_text) {
                replyMessage = templateProp.rich_text.map((t: any) => t.plain_text).join('')
            }
        }

        // 2. Fallback if no match
        if (!replyMessage) {
            if (trigger === 'INDEX' || trigger === 'HI' || trigger === 'HELLO') {
                // Even if INDEX isn't in Notion yet, we can't really fallback to 0 results
                // But since I just synced INDEX, it should find it.
                replyMessage = "Protocol not found. Text 'INDEX' to see all available protocols."
            } else {
                replyMessage = `Protocol "${trigger}" not found. \n\nText 'INDEX' to see all available keywords, or describe your situation and our team will get back to you.`
            }
        }

        // 3. Return TwiML XML response
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
    <Message>The SOR7ED system is currently under maintenance. Please try again in a few minutes.</Message>
</Response>`
        res.setHeader('Content-Type', 'text/xml')
        return res.status(500).send(errorTwiml)
    }
}
