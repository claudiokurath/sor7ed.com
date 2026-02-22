import os
import requests
import json

NOTION_API_KEY = 'ntn_X35904089085dj81e9AJCIrVsEbWQ8gPoL5e4iKqGXv69W'
BLOG_DB_ID = 'db668e4687ed455498357b8d11d2c714'

headers = {
    'Authorization': f'Bearer {NOTION_API_KEY}',
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
}

def get_text_from_block(block):
    block_type = block.get('type')
    if not block_type:
        return ""
    
    content = block.get(block_type, {})
    rich_text = content.get('rich_text', [])
    text = "".join([t.get('plain_text', '') for t in rich_text])
    
    if block_type == 'heading_1':
        return f"# {text}\n"
    elif block_type == 'heading_2':
        return f"## {text}\n"
    elif block_type == 'heading_3':
        return f"### {text}\n"
    elif block_type == 'bulleted_list_item':
        return f"• {text}\n"
    elif block_type == 'numbered_list_item':
        return f"1. {text}\n"
    elif block_type == 'paragraph':
        return f"{text}\n"
    return ""

def sync_post(page_id):
    # 1. Get blocks
    res = requests.get(f'https://api.notion.com/v1/blocks/{page_id}/children', headers=headers)
    if res.status_code != 200:
        print(f"Failed to get blocks for {page_id}")
        return False
    
    blocks = res.json().get('results', [])
    full_text = ""
    for block in blocks:
        full_text += get_text_from_block(block)
    
    if len(full_text) < 10:
        print(f"Skipping {page_id}, content too short.")
        return False

    # 2. Update page
    # We chunk the content because Notion rich_text has limits (2000 chars per item)
    # But for a simple sync, we'll just take the first 2000 or split it.
    # Actually, let's keep it simple and just put it in.
    
    # Notion has a 2000 char limit per rich_text item, we can provide an array of items.
    chunks = [full_text[i:i+2000] for i in range(0, len(full_text), 2000)]
    rich_text_items = [{"text": {"content": chunk}} for chunk in chunks]

    update_payload = {
        "properties": {
            "Content": {
                "rich_text": rich_text_items
            },
            "Status": {
                "status": {"name": "Published"}
            }
        }
    }
    
    res = requests.patch(f'https://api.notion.com/v1/pages/{page_id}', headers=headers, json=update_payload)
    if res.status_code == 200:
        print(f"Successfully synced and published {page_id}")
        return True
    else:
        print(f"Failed to update {page_id}: {res.text}")
        return False

def main():
    print("Starting Blog Content Sync...")
    # Query all pages
    res = requests.post(f'https://api.notion.com/v1/databases/{BLOG_DB_ID}/query', headers=headers)
    data = res.json()
    pages = data.get('results', [])
    
    print(f"Found {len(pages)} pages.")
    
    for page in pages:
        title = page['properties']['Title']['title'][0]['plain_text']
        print(f"Processing: {title}")
        sync_post(page['id'])

if __name__ == "__main__":
    main()
