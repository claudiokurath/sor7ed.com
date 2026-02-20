const NOTION_TOKEN = 'ntn_X35904089085dj81e9AJCIrVsEbWQ8gPoL5e4iKqGXv69W';
const DATABASE_ID = 'db668e4687ed455498357b8d11d2c714';

async function notionRequest(endpoint, method, body) {
    const url = `https://api.notion.com/v1/${endpoint}`;
    const response = await fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Notion API Error: ${response.status} ${text}`);
    }

    return response.json();
}

async function debugSchema() {
    console.log('🔍 Inspecting actual database schema...');
    try {
        const response = await notionRequest(`databases/${DATABASE_ID}`, 'GET');
        console.log('Properties found:');
        Object.keys(response.properties).forEach(key => {
            console.log(`- "${key}" (${response.properties[key].type})`);
        });

        const query = await notionRequest(`databases/${DATABASE_ID}/query`, 'POST', { page_size: 1 });
        if (query.results.length > 0) {
            console.log('\nSample post data:');
            const props = query.results[0].properties;
            console.log(`Title: ${props.Title?.title?.[0]?.plain_text}`);
            console.log(`Status: ${props.Status?.status?.name}`);
            console.log(`WhatsApp Keyword: ${props['WhatsApp Keyword']?.rich_text?.[0]?.plain_text}`);
            console.log(`Trigger: ${props['Trigger']?.rich_text?.[0]?.plain_text}`);
        }
    } catch (e) {
        console.error('❌ Error:', e.message);
    }
}

debugSchema();
