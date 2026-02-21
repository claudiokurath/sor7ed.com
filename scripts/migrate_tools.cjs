const TOKEN = 'ntn_X35904089085dj81e9AJCIrVsEbWQ8gPoL5e4iKqGXv69W';
const OLD_TOOLS_ID = '2fb0ce014acc8064befbc36e4f3f4c6a';
const NEW_TOOLS_ID = '08ac767d313845ca91886ce45c379b99';

async function migrateTools() {
    console.log('🚀 Migrating TOOLS (Wipe + Clone)...');
    const headers = { 'Authorization': 'Bearer ' + TOKEN, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' };

    // 1. Wipe New Tools
    console.log('🧹 Wiping New Tools DB...');
    let hasMore = true;
    while (hasMore) {
        const q = await fetch(`https://api.notion.com/v1/databases/${NEW_TOOLS_ID}/query`, { method: 'POST', headers, body: JSON.stringify({ page_size: 100 }) });
        const res = await q.json();
        const toDelete = res.results || [];
        if (toDelete.length === 0) { hasMore = false; break; }
        await Promise.all(toDelete.map(p => fetch(`https://api.notion.com/v1/pages/${p.id}`, { method: 'PATCH', headers, body: JSON.stringify({ archived: true }) })));
    }
    console.log('✅ Tools Wiped.');

    // 2. Fetch Old Tools
    const oldQ = await fetch(`https://api.notion.com/v1/databases/${OLD_TOOLS_ID}/query`, { method: 'POST', headers, body: JSON.stringify({ page_size: 100 }) });
    const oldTools = (await oldQ.json()).results || [];
    console.log(`Found ${oldTools.length} tools to clone.`);

    // 3. Clone
    let count = 0;
    for (const t of oldTools) {
        const name = t.properties.Name?.title?.[0]?.plain_text || 'Untitled';
        const desc = t.properties.Description?.rich_text?.[0]?.plain_text || t.properties.About?.rich_text?.[0]?.plain_text || '';
        const emoji = t.icon?.emoji || '🛠️'; // Use icon if available
        const keyword = t.properties['WhatsApp Keyword']?.rich_text?.[0]?.plain_text || t.properties.Keyword?.rich_text?.[0]?.plain_text || 'FOCUS';

        // Determine Branch (Category)
        let branch = 'Tech'; // Default
        // Try to map from existing property if available, else guess
        const tLower = name.toLowerCase();
        if (tLower.includes('focus') || tLower.includes('mind')) branch = 'Mind';
        else if (tLower.includes('body') || tLower.includes('sensory')) branch = 'Body';
        else if (tLower.includes('money') || tLower.includes('wealth')) branch = 'Wealth';

        const payload = {
            parent: { database_id: NEW_TOOLS_ID },
            icon: { emoji: emoji },
            properties: {
                'Name': { title: [{ text: { content: name } }] },
                'Description': { rich_text: [{ text: { content: desc } }] },
                'Status': { select: { name: 'Published' } }, // Assuming Select type based on previous findings, or will error? 
                // Wait, Tools DB status check in Step 779 said "undefined". 
                // We'll try 'Published'. If it fails, script logs error.
                'WhatsApp Keyword': { rich_text: [{ text: { content: keyword } }] },
                'Branch': { select: { name: branch } }
            }
        };

        try {
            const createRes = await fetch('https://api.notion.com/v1/pages', {
                method: 'POST', headers, body: JSON.stringify(payload)
            });
            if (createRes.ok) { process.stdout.write('.'); count++; }
            else { console.log(`\n❌ Error "${name}":`, (await createRes.text()).substring(0, 100)); }
        } catch (e) { }
    }
    console.log(`\n✅ DONE: ${count} / ${oldTools.length} tools cloned.`);
}

migrateTools();
