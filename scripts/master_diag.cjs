const TOOLS_ID = '08ac767d313845ca91886ce45c379b99'; const MASTER_KEY = 'ntn_X35904089085dj81e9AJCIrVsEbWQ8gPoL5e4iKqGXv69W'; const BLOG_ID = 'db668e4687ed455498357b8d11d2c714'; const INSIGHTS_ID = '30a0d6014acc81809644c6769eebefac';

async function checkDB(name, id, token) {
  console.log(`\n🔍 Checking ${name} (${id})`);
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${id}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_size: 1 })
    });
    
    if (response.ok) {
        console.log(`✅ SUCCESS: Access Confirmed for ${name}`);
    } else {
        console.log(`❌ FAILED: ${response.status} ${response.statusText}`);
        // console.log(await response.text());
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e.message}`);
  }
}

async function run() {
    await checkDB('TOOLS', TOOLS_ID, MASTER_KEY);
    await checkDB('BLOG', BLOG_ID, MASTER_KEY);
    await checkDB('INSIGHTS', INSIGHTS_ID, MASTER_KEY);
}
run();

