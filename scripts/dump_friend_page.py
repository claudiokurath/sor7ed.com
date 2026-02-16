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
            "rich_text": { "contains": "FRIEND" }
        }
    }
    
    try:
        with urllib.request.urlopen(req, data=json.dumps(body).encode()) as response:
            res = json.loads(response.read().decode())
            if res['results']:
                page = res['results'][0]
                # Print specifically CTA 1 and Post Body excerpt
                props = page['properties']
                print("CTA 1 Content:")
                print(json.dumps(props.get('CTA 1', {}), indent=2))
                print("\nPost Body Preview:")
                pb = props.get('Post Body', {}).get('rich_text', [])
                if pb:
                    print(pb[0].get('plain_text', '')[:200])
            else:
                print("No page found for trigger FRIEND")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    dump_page()
