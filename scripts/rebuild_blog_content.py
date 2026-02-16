import os
import json
import urllib.request
import re
import time

NOTION_TOKEN = os.environ.get('NOTION_BLOG_TOKEN')
NOTION_DB_ID = os.environ.get('NOTION_BLOG_DATABASE_ID')
GEMINI_KEY = os.environ.get('GEMINI_API_KEY')

def call_gemini(prompt, retries=10):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_KEY}"
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    for attempt in range(retries):
        req = urllib.request.Request(url, method='POST')
        req.add_header('Content-Type', 'application/json')
        try:
            with urllib.request.urlopen(req, data=json.dumps(data).encode()) as f:
                res = json.loads(f.read().decode())
                return res['candidates'][0]['content']['parts'][0]['text']
        except Exception as e:
            if hasattr(e, 'code') and e.code == 429:
                wait_time = (2 ** attempt) + 2
                print(f"   ⚠️ Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
                continue
            print(f"   ❌ Gemini Error: {e}")
            time.sleep(2)
    return None

def chunk_text(text, limit=1900):
    return [text[i:i+limit] for i in range(0, len(text), limit)]

def update_notion_page(page_id, content):
    url = f"https://api.notion.com/v1/pages/{page_id}"
    chunks = chunk_text(content)
    rich_text = [{"text": {"content": chunk}} for chunk in chunks]
    
    data = {
        "properties": {
            "Content": {"rich_text": rich_text}
        }
    }
    req = urllib.request.Request(url, method='PATCH')
    req.add_header("Authorization", f"Bearer {NOTION_TOKEN}")
    req.add_header("Notion-Version", "2022-06-28")
    req.add_header("Content-Type", "application/json")
    try:
        urllib.request.urlopen(req, data=json.dumps(data).encode())
        return True
    except Exception as e:
        print(f"   ❌ Notion Update Error: {e}")
        return False

def get_all_pages():
    url = f"https://api.notion.com/v1/databases/{NOTION_DB_ID}/query"
    req = urllib.request.Request(url, method='POST', headers={
        "Authorization": f"Bearer {NOTION_TOKEN}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    })
    
    pages = []
    has_more = True
    next_cursor = None
    
    while has_more:
        query_data = {}
        if next_cursor: query_data['start_cursor'] = next_cursor
        
        try:
            with urllib.request.urlopen(req, data=json.dumps(query_data).encode()) as f:
                res = json.loads(f.read().decode())
                pages.extend(res['results'])
                has_more = res['has_more']
                next_cursor = res['next_cursor']
        except Exception as e:
            print(f"❌ Error fetching pages: {e}")
            break
            
    return pages

def process_blog():
    print("🚀 Fetching all blog posts...")
    pages = get_all_pages()
    print(f"📦 Found {len(pages)} posts.")
    
    for i, page in enumerate(pages):
        page_id = page.get('id')
        props = page.get('properties', {})
        
        title = "Untitled"
        if props.get('Title') and props['Title'].get('title'):
            title = props['Title']['title'][0]['plain_text']
        elif props.get('Name') and props['Name'].get('title'):
            title = props['Name']['title'][0]['plain_text']
            
        # SMART RESUME: Check if 'Content' already matches the template
        current_content = ""
        if props.get('Content') and props['Content'].get('rich_text'):
            current_content = props['Content']['rich_text'][0]['plain_text']
        
        if current_content.startswith('#') and "TL;DR:" in current_content:
            print(f"[{i+1}/{len(pages)}] Skipping: {title} (Already processed)")
            continue

        branch_obj = props.get('Branch')
        branch = "General"
        if branch_obj and branch_obj.get('select'):
            branch = branch_obj['select']['name']
        
        print(f"[{i+1}/{len(pages)}] Processing: {title} (Branch: {branch})")
        
        prompt = f"""You are a high-end protocol writer for SOR7ED, a system for neurodivergent minds. 
Write a blog post for the title: "{title}"
Follow this EXACT TEMPLATE structure:

# {title}

> **TL;DR:** [One bold sentence summarizing the core neuro-architecture insight.]

## The Problem
[Describe the pain point viscerally. Focus on the feeling of overwhelm, friction, or the failure of traditional neurotypical advice. Use 2-3 short paragraphs.]

## The Shift
[The core neuro-divergent reframe or insight. Use "This isn't about trying harder; it's about..." to lead into the solution.]

## The Protocol
[3-5 Actionable, high-friction-reducing steps. Use a numbered list.]

---

### Ready to hand this off?
- **You don't have to do this alone.**
I can handle this entire {branch} branch for you.

> **Text "START" to +44 7966 628285** to begin.

[End of Post]

Keep the tone professional, architectural, and empathetic to ADHD/Autistic brains. No fluff."""

        content = call_gemini(prompt)
        if content:
            content = re.sub(r'^```markdown\n', '', content)
            content = re.sub(r'^```\n', '', content)
            content = re.sub(r'\n```$', '', content)
            
            if update_notion_page(page_id, content):
                print(f"   ✅ Updated.")
            else:
                print(f"   ❌ Failed.")
        else:
            print(f"   ❌ Skipping.")
            
        time.sleep(2)

if __name__ == "__main__":
    process_blog()

