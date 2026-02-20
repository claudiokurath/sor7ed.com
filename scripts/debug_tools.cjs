const NOTION_TOKEN = 'ntn_X35904089085dj81e9AJCIrVsEbWQ8gPoL5e4iKqGXv69W';
const DATABASE_ID = '08ac767d313845ca91886ce45c379b99'; // From your .env

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

async function debugTools() {
    console.log('🔍 Inspecting TOOLS database schema...');
    try {
        const response = await notionRequest(`databases/${DATABASE_ID}`, 'GET');
        console.log('Properties found:');
        Object.keys(response.properties).forEach(key => {
            console.log(`- "${key}" (${response.properties[key].type})`);
        });

        const query = await notionRequest(`databases/${DATABASE_ID}/query`, 'POST', { page_size: 5 });
        if (query.results.length === 0) {
            console.log('⚠️ Database is EMPTY or Bot has no access.');
        } else {
            console.log(`✅ Found ${query.results.length} tools. Sample:`);
            const props = query.results[0].properties;
            console.log(`Name: ${props.Name?.title?.[0]?.plain_text}`);
            console.log(`Status Type: ${props.Status?.type}`);
            if (props.Status?.status) console.log(`Status Name: ${props.Status.status.name}`);
            else if (props.Status?.select) console.log(`Status Name: ${props.Status.select.name}`);
        }
    } catch (e) {
        console.error('❌ Error:', e.message);
    }
}

debugTools();
