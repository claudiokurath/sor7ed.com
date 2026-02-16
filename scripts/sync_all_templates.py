import json
import urllib.request
import os
import re

TOKEN = os.environ.get('NOTION_BLOG_TOKEN')
DB_ID = os.environ.get('NOTION_BLOG_DATABASE_ID')

def parse_md(file_path):
    if not os.path.exists(file_path):
        return []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    sections = re.split(r'(?=^#+ TRIGGER:)', content, flags=re.M)
    results = []
    
    for section in sections:
        if not section.strip(): continue
        
        trigger_match = re.search(r'#+ TRIGGER:\s*(.*)', section)
        if not trigger_match: continue
        
        trigger_raw = trigger_match.group(1).strip()
        triggers = re.split(r'[/,]', trigger_raw)
        triggers = [t.strip().upper() for t in triggers if t.strip()]
        
        post_match = re.search(r'\*\*POST:\*\*\s*(.*)', section) or re.search(r'POST:\s*(.*)', section)
        post_title = post_match.group(1).strip() if post_match else ''
        
        template_match = re.search(r'```([\s\S]*?)```', section)
        template_content = template_match.group(1).strip() if template_match else ''
        
        if triggers and template_content:
            results.append({
                'triggers': triggers,
                'title': post_title,
                'content': template_content
            })
            
    return results

def sync_to_notion(templates):
    for item in templates:
        for trigger in item['triggers']:
            print(f"🔄 Syncing trigger: {trigger}...")
            
            # Find page by trigger
            query_url = f"https://api.notion.com/v1/databases/{DB_ID}/query"
            query_data = {
                "filter": {
                    "property": "Trigger",
                    "rich_text": {"equals": trigger}
                }
            }
            
            req = urllib.request.Request(query_url, method='POST')
            req.add_header("Authorization", f"Bearer {TOKEN}")
            req.add_header("Notion-Version", "2022-06-28")
            req.add_header("Content-Type", "application/json")
            
            try:
                with urllib.request.urlopen(req, data=json.dumps(query_data).encode()) as f:
                    res = json.loads(f.read().decode())
                    if res['results']:
                        page_id = res['results'][0]['id']
                        print(f"   Found existing page for {trigger}. Updating...")
                        update_page(page_id, item['content'])
                    else:
                        # Try finding by title
                        print(f"   No trigger match. Searching by title: {item['title']}...")
                        title_query = {
                            "filter": {
                                "property": "Title",
                                "title": {"equals": item['title']}
                            }
                        }
                        req_title = urllib.request.Request(query_url, method='POST')
                        req_title.add_header("Authorization", f"Bearer {TOKEN}")
                        req_title.add_header("Notion-Version", "2022-06-28")
                        req_title.add_header("Content-Type", "application/json")
                        
                        with urllib.request.urlopen(req_title, data=json.dumps(title_query).encode()) as ft:
                            res_t = json.loads(ft.read().decode())
                            if res_t['results']:
                                page_id = res_t['results'][0]['id']
                                print(f"   Found page by title. Setting trigger and template...")
                                update_page_full(page_id, trigger, item['content'])
                            else:
                                print(f"   ❌ Could not find page for {trigger} or {item['title']}. Skipping.")
            except Exception as e:
                print(f"   ❌ Error searching Notion: {e}")

def chunk_text(text, limit=1900):
    return [text[i:i+limit] for i in range(0, len(text), limit)]

def update_page(page_id, template):
    url = f"https://api.notion.com/v1/pages/{page_id}"
    chunks = chunk_text(template)
    rich_text = [{"text": {"content": chunk}} for chunk in chunks]
    
    data = {
        "properties": {
            "Template ": {"rich_text": rich_text}
        }
    }
    req = urllib.request.Request(url, method='PATCH')
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Notion-Version", "2022-06-28")
    req.add_header("Content-Type", "application/json")
    try:
        urllib.request.urlopen(req, data=json.dumps(data).encode())
        print(f"   ✅ Updated Template successfully.")
    except Exception as e:
        if hasattr(e, 'read'):
            print(f"   ❌ Failed to update page: {e.read().decode()}")
        else:
            print(f"   ❌ Failed to update page: {e}")

def update_page_full(page_id, trigger, template):
    url = f"https://api.notion.com/v1/pages/{page_id}"
    chunks = chunk_text(template)
    rich_text = [{"text": {"content": chunk}} for chunk in chunks]
    
    data = {
        "properties": {
            "Trigger": {"rich_text": [{"text": {"content": trigger}}]},
            "Template ": {"rich_text": rich_text}
        }
    }
    req = urllib.request.Request(url, method='PATCH')
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Notion-Version", "2022-06-28")
    req.add_header("Content-Type", "application/json")
    try:
        urllib.request.urlopen(req, data=json.dumps(data).encode())
        print(f"   ✅ Updated Trigger and Template successfully.")
    except Exception as e:
        if hasattr(e, 'read'):
            print(f"   ❌ Failed to update page full: {e.read().decode()}")
        else:
            print(f"   ❌ Failed to update page full: {e}")

if __name__ == "__main__":
    files = [
        'PDF_TEMPLATES_EXTRACTED.md',
        'TEMPLATES_FINAL_BATCH.md',
        'AGENCYPLAN_TEMPLATE.md',
        'CONSENT_TEMPLATE.md',
        'INDEX_TEMPLATE.md'
    ]
    all_content = []
    for f in files:
        print(f"Reading {f}...")
        all_content.extend(parse_md(f))
        
    print(f"Found {len(all_content)} distinct templates.")
    sync_to_notion(all_content)
