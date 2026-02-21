const TOKEN = 'ntn_X35904089085dj81e9AJCIrVsEbWQ8gPoL5e4iKqGXv69W';
const TOOLS_ID = '08ac767d313845ca91886ce45c379b99';

async function seedToolsBlind() {
    console.log('🚀 Seeding Tools (Blind Force)...');

    const tools = [
        { name: 'Hyperfocus Timer', emoji: '⏱️', desc: 'Custom intervals soft chimes.', kw: 'FOCUS', branch: 'Mind' },
        { name: 'ADHD Tax Calculator', emoji: '💸', desc: 'Visualize the cost.', kw: 'GROWTH', branch: 'Wealth' },
        { name: 'Body Doubling Match', emoji: '👥', desc: 'Find silent partners.', kw: 'CONNECTION', branch: 'Connection' },
        { name: 'Sensory Safe Map', emoji: '🎧', desc: 'Crowdsourced quiet spaces.', kw: 'IMPRESSION', branch: 'Impression' }, // 'muted' -> '🎧'
        { name: 'Dopamine Menu Builder', emoji: '⚡', desc: 'Create personalized list.', kw: 'ENERGY', branch: 'Body' },
        { name: 'Executive Function Triage', emoji: '🧠', desc: 'Decision matrix.', kw: 'TECH', branch: 'Tech' },
        { name: 'Email Script Generator', emoji: '📧', desc: 'Polite templates.', kw: 'CONNECTION', branch: 'Connection' },
        { name: 'Spoon Theory Tracker', emoji: '🥄', desc: 'Daily energy budgeting.', kw: 'ENERGY', branch: 'Body' }
    ];

    const headers = { 'Authorization': 'Bearer ' + TOKEN, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' };

    let count = 0;
    for (const t of tools) {
        const payload = {
            parent: { database_id: TOOLS_ID },
            icon: { emoji: t.emoji },
            properties: {
                'Name': { title: [{ text: { content: t.name } }] },
                'Description': { rich_text: [{ text: { content: t.desc } }] },
                'Status': { select: { name: 'Published' } }, // Assuming Select
                'WhatsApp Keyword': { rich_text: [{ text: { content: t.kw } }] },
                'Branch': { select: { name: t.branch } }
            }
        };

        try {
            const createRes = await fetch('https://api.notion.com/v1/pages', {
                method: 'POST', headers, body: JSON.stringify(payload)
            });

            if (createRes.ok) { process.stdout.write('.'); count++; }
            else {
                const err = await createRes.text();
                console.log(`\n❌ Error "${t.name}": ${err.substring(0, 50)}...`);
                // If Select payload fails (400), try Status payload immediately?
                if (err.includes('expected to be status')) {
                    console.log('Detected Status type mismatch. Retrying as Status Type...');
                    payload.properties['Status'] = { status: { name: 'Published' } };
                    const retry = await fetch('https://api.notion.com/v1/pages', { method: 'POST', headers, body: JSON.stringify(payload) });
                    if (retry.ok) { console.log('✅ Success on Retry!'); count++; }
                }
            }
        } catch (e) {
            console.log(`\nEXCEPTION: ${e.message}`);
        }
    }
    console.log(`\n✅ Created ${count} tools.`);
}

seedToolsBlind();
