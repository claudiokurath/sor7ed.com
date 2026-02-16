import os
import json
import urllib.request

TOKEN = os.environ.get('NOTION_BLOG_TOKEN')
DB_ID = os.environ.get('NOTION_BLOG_DATABASE_ID')

def get_db():
    url = f"https://api.notion.com/v1/databases/{DB_ID}"
    req = urllib.request.Request(url, method="GET")
    req.add_header('Authorization', f'Bearer {TOKEN}')
    req.add_header('Notion-Version', '2022-06-28')
    
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode())
            print(json.dumps(res['properties'], indent=2))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_db()
