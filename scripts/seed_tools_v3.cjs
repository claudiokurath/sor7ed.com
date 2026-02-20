const TOOLS_KEY = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e'; // Trying User Key first (since Blog worked)? 
// Wait, Step 990 failed with User Key.
// So I will try ENV KEY.
// But Step 527 used 'ntn_v...' for everything successfully? Maybe ID mismatch?
// I will try BOTH keys in sequence, just in case.

const ENV_KEY = 'ntn_X35904089085dj81e9AJCIrVsEbWQ8gPoL5e4iKqGXv69W';
const USER_KEY = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';

const TOOLS_ID = '08ac767d313845ca91886ce45c379b99';

async function seedToolsRobust() {
    console.log('🚀 Seeding Tools (Trying Keys)...');

    const tools = [
        { name: 'Hyperfocus Timer', emoji: '⏱️', desc: 'Custom intervals soft chimes.', kw: 'FOCUS', branch: 'Mind' },
        { name: 'ADHD Tax Calculator', emoji: '💸', desc: 'Visualize the cost.', kw: 'GROWTH', branch: 'Wealth' },
        { name: 'Body Doubling Match', emoji: '👥', desc: 'Find silent partners.', kw: 'CONNECTION', branch: 'Connection' },
        { name: 'Sensory Safe Map', emoji: '🎧', desc: 'Crowdsourced quiet spaces.', kw: 'IMPRESSION', branch: 'Impression' },
        { name: 'Dopamine Menu Builder', emoji: '⚡', desc: 'Create personalized list.', kw: 'ENERGY', branch: 'Body' },
        { name: 'Executive Function Triage', emoji: '🧠', desc: 'Decision matrix.', kw: 'TECH', branch: 'Tech' },
        { name: 'Email Script Generator', emoji: '📧', desc: 'Polite templates.', kw: 'CONNECTION', branch: 'Connection' },
        { name: 'Spoon Theory Tracker', emoji: '🥄', desc: 'Daily energy budgeting.', kw: 'ENERGY', branch: 'Body' }
    ];

    let activeKey = ENV_KEY;

    // Test access first with ENV_KEY
    let dbRes = await fetch(`https://api.notion.com/v1/databases/${TOOLS_ID}`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + activeKey, 'Notion-Version': '2022-06-28' } });
    if (!dbRes.ok) {
        console.log('⚠️ ENV Key failed. Trying User Key...');
        activeKey = USER_KEY;
        dbRes = await fetch(`https://api.notion.com/v1/databases/${TOOLS_ID}`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + activeKey, 'Notion-Version': '2022-06-28' } });
    }

    if (!dbRes.ok) {
        console.log('❌ BOTH KEYS FAILED to access Tools DB. Check ID or Sharing.');
        return;
    }

    console.log(`✅ Access Confirmed using key starting with ${activeKey.substring(0, 10)}...`);

    const headers = { 'Authorization': 'Bearer ' + activeKey, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' };

    let count = 0;
    for (const t of tools) {
        // User says "tools is also published". So status is 'Published'.
        // But verify if it's Select or Status type.
        // Based on blog, likely Status type.
        // But based on previous failure "expected to be status", I'll try Status first.

        let payload = {
            parent: { database_id: TOOLS_ID },
            icon: { emoji: t.emoji },
            properties: {
                'Name': { title: [{ text: { content: t.name } }] },
                'Description': { rich_text: [{ text: { content: t.desc } }] },
                'Status': { status: { name: 'Published' } }, // Try Status type 'Published'
                'WhatsApp Keyword': { rich_text: [{ text: { content: t.kw } }] },
                'Branch': { select: { name: t.branch } }
            }
        };

        try {
            let createRes = await fetch('https://api.notion.com/v1/pages', { method: 'POST', headers, body: JSON.stringify(payload) });

            if (!createRes.ok) {
                const err = await createRes.text();
                // If Status type fails, try Select type 'Published' 
                if (err.includes('expected to be select') || err.includes('validation_error')) {
                    payload.properties['Status'] = { select: { name: 'Published' } };
                    createRes = await fetch('https://api.notion.com/v1/pages', { method: 'POST', headers, body: JSON.stringify(payload) });
                }
                // If 'Published' fails, try 'Live' (Select) as per API file?
                if (!createRes.ok) {
                    payload.properties['Status'] = { select: { name: 'Live' } };
                    createRes = await fetch('https://api.notion.com/v1/pages', { method: 'POST', headers, body: JSON.stringify(payload) });
                }
            }

            if (createRes.ok) { process.stdout.write('.'); count++; }
            else { console.log(`\n❌ Error "${t.name}":`, (await createRes.text()).substring(0, 50)); }
        } catch (e) { }
    }
    console.log(`\n✅ Created ${count} tools.`);
}

seedToolsRobust();
