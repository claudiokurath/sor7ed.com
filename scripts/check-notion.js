import { Client } from '@notionhq/client'
import fs from 'fs'
import path from 'path'

// Manual .env parsing
const envFile = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8')
envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim()
    }
})

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const databaseId = process.env.NOTION_BLOG_DB_ID

async function checkSchema() {
    try {
        const db = await notion.databases.retrieve({ database_id: databaseId })
        console.log('Database Properties:', Object.keys(db.properties).join(', '))

        if (!db.properties['Template']) console.warn('⚠️ Missing "Template" property')
        if (!db.properties['Trigger']) console.warn('⚠️ Missing "Trigger" property')
    } catch (e) {
        console.error('Error:', e.message)
    }
}

checkSchema()
