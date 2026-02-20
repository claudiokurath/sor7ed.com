const TOKEN = 'ntn_X35904089085dj81e9AJCIrVsEbWQ8gPoL5e4iKqGXv69W';
const TOOLS_ID = '08ac767d313845ca91886ce45c379b99';

async function verifyToolsStatus() {
    console.log('🔍 Verifying Tools Status for API Filter...');

    const headers = { 'Authorization': 'Bearer ' + TOKEN, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' };

    const q = await fetch(`https://api.notion.com/v1/databases/${TOOLS_ID}/query`, { method: 'POST', headers, body: JSON.stringify({ page_size: 1 }) });

    if (!q.ok) {
        console.log('❌ Query failed:', await q.text());
        return;
    }

    const res = await q.json();
    if (res.results.length === 0) {
        console.log('❌ Tools DB Empty.');
        return;
    }

    const t = res.results[0];
    const s = t.properties.Status;

    console.log('Status Property Type:', s.type);
    if (s.type === 'status') {
        console.log('Status Value:', s.status?.name);
    } else if (s.type === 'select') {
        console.log('Status Value:', s.select?.name);
        console.log('⚠️ API Tool.ts filter might be wrong if looking for "Live" but status is', s.select?.name);
    }
}

verifyToolsStatus();
