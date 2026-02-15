import { parse } from 'querystring'

// Taxonomy and Routing Logic from Master Document (v1)
const BRANCHES = ['Mind', 'Wealth', 'Body', 'Tech', 'Connection', 'Impression', 'Growth']

const UTILITY_RESPONSES: Record<string, string> = {
    'MENU': "📍 SOR7ED Main Menu\n\n- [TEMPLATES]: Browse free neuro-architecture kits.\n- [LABS]: Open interactive operational tools.\n- [HELP]: Get support and see SLAs.\n\nEverything in the Registry is now [FREE].",
    'HELP': "🆘 SOR7ED Help\n\nI am an automated system delivering free tools for ND brains. \n\nStandard SLAs:\n- Delivery: Instant via keyword\n- Support: 24-48h\n\nReply 'HUMAN' for help.",
    'CREDITS': "💳 Operational Status\n\nEffective Feb 2026: All core templates and lab tools are now [FREE]. \n\nConcierge services are currently in beta. No credits required for primary protocols.",
    'PARK': "🅿️ Protocol Parked\n\nI've paused this sequence. I'll check in with you tomorrow with one smallest next step. Reply RESUME anytime.",
    'STOP': "🛑 Opt-out Confirmed\n\nAll automations stopped. I won't message you again unless you re-start a protocol.",
    'TIMELINE': "⏳ System Timeline\n\nCurrent Request Status: [ACTIVE]\nEstimated Completion: Same-day (SLA compliant)."
}

const ALIAS_MAP: Record<string, string> = {
    'ACTION KIT': 'ACTIONKIT', 'EXECUTIVE DYSFUNCTION': 'ACTIONKIT', 'LOW FRICTION': 'ACTIONKIT',
    'TIME BLINDNESS': 'TIMERAILS', 'TIMERS': 'TIMERAILS', 'FINISH CLEANLY': 'TIMERAILS',
    'AFTER WORK': 'LANDINGRITUAL', 'DECOMPRESSION': 'LANDINGRITUAL', 'UNMASKING': 'LANDINGRITUAL',
    'MONEY RESET': 'MONEYRESET', 'IMPULSE SPEND': 'MONEYRESET', 'DEBT': 'MONEYRESET',
    'MELTDOWN': 'WORKPARK', 'SHUTDOWN': 'WORKPARK', 'OVERWHELM': 'WORKPARK',
    'CONSENT KIT': 'CONSENTKIT', 'INTIMACY': 'CONSENTKIT',
    'CAPACITY SCRIPT': 'CAPACITYSCRIPT', 'MASKING INTIMACY': 'CAPACITYSCRIPT',
    'BOUNDARIES PACK': 'BOUNDARIESPACK', 'HOLIDAY SCRIPTS': 'BOUNDARIESPACK',
    'THERAPY BRIEF': 'THERAPYBRIEF', 'THERAPY PREP': 'THERAPYBRIEF',
    'GAMING RAILS': 'GAMINGRAILS', 'GAME TIME': 'GAMINGRAILS'
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

    let bodyData = req.body
    if (typeof req.body === 'string') {
        try { bodyData = parse(req.body) } catch (e) { }
    }

    const { Body } = bodyData || {}
    const rawTrigger = (Body || '').trim().toUpperCase()

    // 1. Resolve Canonical Trigger
    const trigger = ALIAS_MAP[rawTrigger] || rawTrigger

    // 2. Handle Global Utility Words
    if (UTILITY_RESPONSES[trigger]) {
        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${UTILITY_RESPONSES[trigger]}</Message></Response>`)
    }

    const TOKEN = (process.env.NOTION_TOKEN || '').trim()
    const BLOG_DB_ID = (process.env.NOTION_BLOG_DATABASE_ID || process.env.BLOG_DB_ID || '').trim()
    const TOOLS_DB_ID = (process.env.NOTION_TOOLS_DATABASE_ID || process.env.TOOLS_DB_ID || '').trim()

    try {
        if (!TOKEN || !BLOG_DB_ID) throw new Error("Vercel Config Error: Missing Notion Configuration.")

        // Logic Skeleton: Detect -> Reflect -> Branch -> Offer -> Deliver

        let match = null
        let replyMessage = ""
        let branch = "Mind"

        // Search Tools first (Primary operational layer)
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
        match = toolsData.results?.[0]

        if (match) {
            const props = match.properties
            branch = props.Branch?.select?.name || "Mind"
            const template = props.Template?.rich_text?.[0]?.plain_text || props.Description?.rich_text?.[0]?.plain_text || ""

            // Pattern: Reflect + Branch + Deliver
            replyMessage = `Reflected: You want the ${props.Name?.title?.[0]?.plain_text}. Got it. [Branch: ${branch}]\n\n${template}`
        }

        // Search Blog/Articles if no tool match
        if (!replyMessage) {
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
            match = blogData.results?.[0]

            if (match) {
                const props = match.properties
                branch = props.Branch?.select?.name || "Mind"
                const template = (props.Template?.rich_text?.[0]?.plain_text || props['Template ']?.rich_text?.[0]?.plain_text || "")

                replyMessage = `Reflected: Opening "${props.Title?.title?.[0]?.plain_text}". [Branch: ${branch}]\n\n${template}`
            }
        }

        if (!replyMessage) {
            replyMessage = `SOR7ED Bot: "${trigger}" unknown. Valid protocols include FIDGET, FOCUS, BREAK, MOOD. \n\nReply MENU for more.`
        }

        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${replyMessage}</Message></Response>`)

    } catch (error: any) {
        res.setHeader('Content-Type', 'text/xml')
        return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>⚠️ SYSTEM ERROR: ${error.message}</Message></Response>`)
    }
}
