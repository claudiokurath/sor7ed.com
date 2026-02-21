const TOKEN = 'ntn_X35904089085dj81e9AJCIrVsEbWQ8gPoL5e4iKqGXv69W';
const BLOG_ID = 'db668e4687ed455498357b8d11d2c714';

async function checkStatusProp() {
  const response = await fetch(`https://api.notion.com/v1/databases/${BLOG_ID}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 1 })
  });
  const data = await response.json();
  const p = data.results[0];
  console.log('Status Property Structure:', JSON.stringify(p.properties.Status, null, 2));
}
checkStatusProp();

