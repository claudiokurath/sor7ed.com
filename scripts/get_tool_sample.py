import os
import json
import urllib.request

TOKEN = os.environ.get('NOTION_TOOLS_TOKEN')
DB_ID = os.environ.get('NOTION_TOOLS_DATABASE_ID')

def get_sample():
    url = f"https://api.notion.com/v1/databases/{DB_ID}/query"
    req = urllib.request.Request(url, method='POST')
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Notion-Version", "2022-06-28")
    req.add_header("Content-Type", "application/json")
    
    data = json.dumps({"page_size": 1}).encode()
    try:
        with urllib.request.urlopen(req, data=data) as f:
            res = json.loads(f.read().decode())
            if res['results']:
                print(json.dumps(res['results'][0]['properties'], indent=2))
            else:
                print("No tools found in DB.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_sample()
