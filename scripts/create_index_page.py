import os
import json
import urllib.request

TOKEN = os.environ.get('NOTION_API_KEY')
DB_ID = os.environ.get('NOTION_BLOG_DB_ID')

def create_index():
    url = "https://api.notion.com/v1/pages"
    data = {
        "parent": {"database_id": DB_ID},
        "properties": {
            "Title": {"title": [{"text": {"content": "All Available SOR7ED Protocols"}}]},
            "Trigger": {"rich_text": [{"text": {"content": "INDEX"}}]},
            "Status": {"status": {"name": "Published"}},
            "Branch": {"select": {"name": "SOR7ED"}}
        }
    }
    
    req = urllib.request.Request(url, method='POST')
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Notion-Version", "2022-06-28")
    req.add_header("Content-Type", "application/json")
    
    try:
        with urllib.request.urlopen(req, data=json.dumps(data).encode()) as f:
            res = json.loads(f.read().decode())
            print(f"Created Index Page: {res['id']}")
            return res['id']
    except Exception as e:
        if hasattr(e, 'read'):
            print(f"Error creating index: {e.read().decode()}")
        else:
            print(f"Error: {e}")
        return None

if __name__ == "__main__":
    create_index()
