import os
import json
import urllib.request

TOKEN = os.environ.get('NOTION_BLOG_TOKEN')
DB_ID = os.environ.get('NOTION_BLOG_DATABASE_ID')

def test_notion():
    url = f"https://api.notion.com/v1/databases/{DB_ID}/query"
    req = urllib.request.Request(url, method="POST")
    req.add_header('Authorization', f'Bearer {TOKEN}')
    req.add_header('Notion-Version', '2022-06-28')
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req, data=json.dumps({}).encode()) as response:
            res = json.loads(response.read().decode())
            print(f"✅ Connection Successful! Found {len(res.get('results', []))} results.")
    except Exception as e:
        if hasattr(e, 'read'):
            error_details = e.read().decode()
            print(f"❌ Notion API Error: {error_details}")
        else:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_notion()
