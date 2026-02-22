import os
import json
import urllib.request
import re
import time
import requests

NOTION_API_KEY = "ntn_X35904089085dj81e9AJCIrVsEbWQ8gPoL5e4iKqGXv69W"
BLOG_DB_ID = "db668e4687ed455498357b8d11d2c714"
WHATSAPP_DB_ID = "30e0d6014acc8032b605c7a99f8ae112"
GEMINI_KEY = os.environ.get('GEMINI_API_KEY')

headers = {
    "Authorization": f"Bearer {NOTION_API_KEY}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json"
}

def call_gemini(prompt, retries=10):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_KEY}"
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    for attempt in range(retries):
        try:
            res = requests.post(url, json=data)
            if res.status_code == 200:
                res_json = res.json()
                return res_json['candidates'][0]['content']['parts'][0]['text']
            elif res.status_code == 429:
                wait_time = (2 ** attempt) + 2
                print(f"   ⚠️ Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
                continue
            else:
                print(f"   ❌ Gemini Error: {res.status_code} {res.text}")
                time.sleep(2)
        except Exception as e:
            print(f"   ❌ Network Error: {e}")
            time.sleep(2)
    return None

def update_notion_page(page_id, content):
    url = f"https://api.notion.com/v1/pages/{page_id}"
    data = {
        "properties": {
            "Template": {"rich_text": [{"text": {"content": content[:2000]}}]}
        }
    }
    res = requests.patch(url, headers=headers, json=data)
    return res.status_code == 200

def get_all_pages(db_id):
    url = f"https://api.notion.com/v1/databases/{db_id}/query"
    pages = []
    has_more = True
    next_cursor = None
    while has_more:
        query_data = {}
        if next_cursor: query_data['start_cursor'] = next_cursor
        res = requests.post(url, headers=headers, json=query_data).json()
        pages.extend(res['results'])
        has_more = res['has_more']
        next_cursor = res['next_cursor']
    return pages

def process():
    print("🚀 Fetching data...")
    wa_pages = get_all_pages(WHATSAPP_DB_ID)
    missing = []
    for p in wa_pages:
        name = p['properties']['Template Name']['title'][0]['plain_text'] if p['properties']['Template Name']['title'] else 'Untitled'
        has_template = 'rich_text' in p['properties'].get('Template', {}) and len(p['properties']['Template']['rich_text']) > 0
        if not has_template:
            missing.append({'name': name, 'id': p['id']})
            
    if not missing:
        print("✅ No missing templates found.")
        return

    print(f"📂 Found {len(missing)} missing templates.")
    
    blog_pages = get_all_pages(BLOG_DB_ID)
    blog_map = {}
    for p in blog_pages:
        trigger_prop = p['properties'].get('WhatsApp Trigger', {}).get('rich_text', [])
        trigger = trigger_prop[0]['plain_text'] if trigger_prop else ''
        if trigger:
            content_prop = p['properties'].get('Content', {}).get('rich_text', [])
            content = ''.join([t['plain_text'] for t in content_prop])
            title = p['properties']['Title']['title'][0]['plain_text'] if p['properties']['Title']['title'] else 'Untitled'
            branch = p['properties']['Branch']['select']['name'] if p['properties']['Branch']['select'] else 'Mind'
            blog_map[trigger.upper()] = {'content': content, 'title': title, 'branch': branch}

    for i, m in enumerate(missing):
        trigger_name = m['name'].upper()
        if trigger_name not in blog_map:
            print(f"[{i+1}/{len(missing)}] ⚠️ Skipping {m['name']} (no blog post).")
            continue
            
        blog_post = blog_map[trigger_name]
        print(f"[{i+1}/{len(missing)}] Generating for: {m['name']}...")
        
        vault_link = f"https://sor7ed.com/blog/{urllib.parse.quote(blog_post['title'])}"
        
        prompt = f"""You are a senior neuro-architect at SOR7ED. 
Create a premium WhatsApp-friendly protocol for the topic: "{blog_post['title']}".
Trigger Keyword: {m['name']}
Branch: {blog_post['branch']}
Source Material: {blog_post['content'][:3000]}

Follow the "SOR7ED Stealth Luxury" WhatsApp format:
- Use emojis sparingly but effectively to guide the eye.
- Keep bullets short and high-impact.
- Focus on the "Smallest Next Step" for executive dysfunction.
- Use a supportive, validating, non-clinical tone.

Format:
Hey! Ready to resolve this.

📌 **The Hidden Friction:** [1 sentence on why this is hard for ND brains]
⚡ **The Neuro-Shift:** [1 sentence reframe]

🛠️ **THE PROTOCOL:**
1. [Action 1 - Smallest step]
2. [Action 2 - Follow up]
3. [Action 3 - Clean up/Finish]

Read Full Analysis: {vault_link}

Reply anytime for more help.
— SOR7ED"""

        content = call_gemini(prompt)
        if content:
            # Clean gemini response
            content = re.sub(r'^```markdown\n', '', content)
            content = re.sub(r'^```\n', '', content)
            content = re.sub(r'\n```$', '', content)
            
            if update_notion_page(m['id'], content):
                print(f"   ✅ Template Uploaded.")
            else:
                print(f"   ❌ Upload Failed.")
        else:
            print(f"   ❌ Generation Failed.")
        
        time.sleep(1) # Rate limit protection

if __name__ == "__main__":
    process()
