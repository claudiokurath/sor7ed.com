import os
import json
import urllib.request

TOKEN = os.environ.get('NOTION_TOOLS_TOKEN')
DB_ID = os.environ.get('NOTION_TOOLS_DATABASE_ID')

def dump():
    url = f"https://api.notion.com/v1/databases/{DB_ID}/query"
    req = urllib.request.Request(url, method="POST")
    req.add_header('Authorization', f'Bearer {TOKEN}')
    req.add_header('Notion-Version', '2022-06-28')
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req, data=json.dumps({"page_size": 1}).encode()) as response:
            res = json.loads(response.read().decode())
            print(json.dumps(res['results'][0]['properties'], indent=2))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    dump()
