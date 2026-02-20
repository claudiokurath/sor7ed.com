const TOKEN = 'ntn_v35904089083VjK8sE1ZyGTQQs6lmPVJNdSzGF10RlL19e';
const TOOLS_ID = '08ac767d313845ca91886ce45c379b99';

async function seedTools() {
    console.log('🚀 Seeding High-Quality Tools...');

    const tools = [
        { name: 'Hyperfocus Timer', emoji: '⏱️', desc: 'Custom intervals with soft chimes for seamless task transitions.', kw: 'FOCUS', branch: 'Mind' },
        { name: 'ADHD Tax Calculator', emoji: '💸', desc: 'Visualize the cost of late fees and impulse buys to reclaim your wealth.', kw: 'GROWTH', branch: 'Wealth' },
        { name: 'Body Doubling Match', emoji: '👥', desc: 'Find silent partners for accountability sessions anytime.', kw: 'CONNECTION', branch: 'Connection' },
        { name: 'Sensory Safe Map', emoji: 'muted', desc: 'Crowdsourced quiet spaces for when the world is too loud.', kw: 'ImPRESSION', branch: 'Impression' },
        { name: 'Dopamine Menu Builder', emoji: '⚡', desc: 'Create a personalized list of quick wins vs deeper recharges.', kw: 'ENERGY', branch: 'Body' },
        { name: 'Executive Function Triage', emoji: '🧠', desc: 'Decision matrix for when everything feels urgent.', kw: 'TECH', branch: 'Tech' },
        { name: 'Email Script Generator', emoji: '📧', desc: 'Polite templates for declined invites and late replies.', kw: 'CONNECTION', branch: 'Connection' },
        { name: 'Spoon Theory Tracker', emoji: '🥄', desc: 'Daily energy budgeting for chronic fatigue management.', kw: 'ENERGY', branch: 'Body' }
    ];

    const headers = { 'Authorization': 'Bearer ' + TOKEN, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' };

    // 1. Get Schema for Status
    const dbRes = await fetch(`https://api.notion.com/v1/databases/${TOOLS_ID}`, { method: 'GET', headers: { 'Authorization': 'Bearer ' + TOKEN, 'Notion-Version': '2022-06-28' } });
    const db = await dbRes.json();
    const sProp = db.properties.Status;

    let statusVal = { select: { name: 'Published' } }; // Default
    if (sProp && sProp.type === 'status') {
        const opts = sProp.status.options;
        const match = opts.find(o => o.name === 'Published' || o.name === 'Live') || opts[opts.length - 1];
        statusVal = { status: { name: match.name } };
    } else if (sProp && sProp.type === 'select') {
        statusVal = { select: { name: 'Published' } };
    }

    // 2. Create Tools
    let count = 0;
    for (const t of tools) {
        const payload = {
            parent: { database_id: TOOLS_ID },
            icon: { emoji: t.emoji.length <= 2 ? t.emoji : '🔧' }, // Handle text emoji like 'muted' -> default
            properties: {
                'Name': { title: [{ text: { content: t.name } }] },
                'Description': { rich_text: [{ text: { content: t.desc } }] },
                'Status': statusVal,
                'WhatsApp Keyword': { rich_text: [{ text: { content: t.kw } }] },
                'Branch': { select: { name: t.branch } }
            }
        };

        try {
            const createRes = await fetch('https://api.notion.com/v1/pages', {
                method: 'POST', headers, body: JSON.stringify(payload)
            });
            if (createRes.ok) { process.stdout.write('.'); count++; }
            else { console.log(`\n❌ Error "${t.name}":`, (await createRes.text()).substring(0, 50)); }
        } catch (e) { }
    }
    console.log(`\n✅ Created ${count} premium tools.`);
}

seedTools();
