import os
import json
import urllib.request

TOKEN = os.environ.get('NOTION_TOOLS_TOKEN')
DB_ID = os.environ.get('NOTION_TOOLS_DATABASE_ID')

def notion_api(endpoint, method, data=None):
    url = f"https://api.notion.com/v1/{endpoint}"
    req = urllib.request.Request(url, method=method)
    req.add_header('Authorization', f'Bearer {TOKEN}')
    req.add_header('Notion-Version', '2022-06-28')
    req.add_header('Content-Type', 'application/json')
    body = json.dumps(data).encode('utf-8') if data else None
    try:
        with urllib.request.urlopen(req, data=body) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    res = notion_api(f"databases/{DB_ID}/query", "POST", {"page_size": 1})
    print(json.dumps(res, indent=2))
