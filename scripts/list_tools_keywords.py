import os
import json
import urllib.request

TOKEN = os.environ.get('NOTION_TOOLS_TOKEN')
DB_ID = os.environ.get('NOTION_TOOLS_DATABASE_ID')

def list_tools():
    url = f"https://api.notion.com/v1/databases/{DB_ID}/query"
    req = urllib.request.Request(url, method="POST")
    req.add_header('Authorization', f'Bearer {TOKEN}')
    req.add_header('Notion-Version', '2022-06-28')
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req, data=json.dumps({}).encode()) as response:
            res = json.loads(response.read().decode())
            for page in res.get('results', []):
                props = page['properties']
                title = props['Name']['title'][0]['plain_text'] if props['Name']['title'] else "Unnamed"
                keyword = ""
                if 'Keyword' in props and props['Keyword']['rich_text']:
                    keyword = props['Keyword']['rich_text'][0]['plain_text']
                print(f"- {title} | Keyword: {keyword}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_tools()
