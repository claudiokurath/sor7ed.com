import os
import json
import urllib.request

TOKEN = os.environ.get('NOTION_API_KEY')
DB_ID = os.environ.get('NOTION_BLOG_DB_ID')

def dump_page():
    url = f"https://api.notion.com/v1/databases/{DB_ID}/query"
    req = urllib.request.Request(url, method="POST")
    req.add_header('Authorization', f'Bearer {TOKEN}')
    req.add_header('Notion-Version', '2022-06-28')
    req.add_header('Content-Type', 'application/json')
    
    body = {
        "filter": {
            "property": "Trigger",
            "rich_text": { "contains": "DOPAMINE" }
        }
    }
    
    try:
        with urllib.request.urlopen(req, data=json.dumps(body).encode()) as response:
            res = json.loads(response.read().decode())
            if res['results']:
                for page in res['results']:
                    trigger = page['properties']['Trigger']['rich_text'][0]['plain_text']
                    print(f"Full Trigger: '{trigger}'")
            else:
                print("No page found for trigger DOPAMINE")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    dump_page()
