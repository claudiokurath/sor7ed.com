
const DB_ID = 'db668e4687ed455498357b8d11d2c714';
const TOKEN = 'ntn_X35904089085dj81e9AJCIrVsEbWQ8gPoL5e4iKqGXv69W';

async function fetchPostContent(titlePart) {
    const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            filter: {
                property: 'Title',
                rich_text: {
                    contains: titlePart
                }
            }
        })
    });
    const data = await response.json();
    if (data.results.length > 0) {
        const page = data.results[0];
        const content = page.properties.Content?.rich_text.map(t => t.plain_text).join('');
        console.log(`--- Content for "${titlePart}" ---`);
        console.log(content.slice(0, 500)); // First 500 chars
        console.log('--- End Content ---');
    } else {
        console.log('Post not found');
    }
}

fetchPostContent('Chronic Pain Crossover');
