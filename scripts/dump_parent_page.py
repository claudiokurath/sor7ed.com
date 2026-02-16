import os
import json
import urllib.request

TOKEN = os.environ.get('NOTION_BLOG_TOKEN')
DB_ID = os.environ.get('NOTION_BLOG_DATABASE_ID')

def dump_page():
    url = f"https://api.notion.com/v1/databases/{DB_ID}/query"
    req = urllib.request.Request(url, method="POST")
    req.add_header('Authorization', f'Bearer {TOKEN}')
    req.add_header('Notion-Version', '2022-06-28')
    req.add_header('Content-Type', 'application/json')
    
    body = {
        "filter": {
            "property": "Trigger",
            "rich_text": { "contains": "PARENT" }
        }
    }
    
    try:
        with urllib.request.urlopen(req, data=json.dumps(body).encode()) as response:
            res = json.loads(response.read().decode())
            if res['results']:
                page = res['results'][0]
                props = page['properties']
                print("Post Body content:")
                pb = props.get('Post Body', {}).get('rich_text', [])
                for t in pb:
                    print(t.get('plain_text', ''))
            else:
                print("No page found for trigger PARENT")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    dump_page()
