import os
import json
import urllib.request

TOKEN = os.environ.get('NOTION_API_KEY')
DB_ID = os.environ.get('NOTION_BLOG_DB_ID')

def list_posts():
    url = f"https://api.notion.com/v1/databases/{DB_ID}/query"
    req = urllib.request.Request(url, method="POST")
    req.add_header('Authorization', f'Bearer {TOKEN}')
    req.add_header('Notion-Version', '2022-06-28')
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req, data=json.dumps({}).encode()) as response:
            res = json.loads(response.read().decode())
            print(f"Total Results: {len(res.get('results', []))}")
            for page in res.get('results', []):
                props = page['properties']
                # Try Title or Name
                title = ""
                if 'Title' in props and props['Title']['title']:
                    title = props['Title']['title'][0]['plain_text']
                elif 'Name' in props and props['Name']['title']:
                    title = props['Name']['title'][0]['plain_text']
                
                status = "Unknown"
                if 'Status' in props:
                    if props['Status']['type'] == 'status':
                        status = props['Status']['status']['name']
                    elif props['Status']['type'] == 'select':
                        status = props['Status']['select']['name']
                
                trigger = "None"
                if 'Trigger' in props and props['Trigger']['rich_text']:
                    trigger = props['Trigger']['rich_text'][0]['plain_text']
                
                print(f"- {title} | Status: {status} | Trigger: {trigger}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_posts()
