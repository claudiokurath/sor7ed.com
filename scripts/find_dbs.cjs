const TOKEN = 'ntn_X35904089085dj81e9AJCIrVsEbWQ8gPoL5e4iKqGXv69W';
async function findDatabases() {
  const res = await fetch('https://api.notion.com/v1/search', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + TOKEN, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({ filter: { value: 'database', property: 'object' } })
  });
  const data = await res.json();
  data.results.forEach(db => console.log(`DB: ${db.title?.[0]?.plain_text || 'Untitled'} | ID: ${db.id}`));
}
findDatabases();

