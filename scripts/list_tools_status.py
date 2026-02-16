import os
import json
import urllib.request

TOKEN = os.environ.get('NOTION_TOOLS_TOKEN')
DB_ID = os.environ.get('NOTION_TOOLS_DATABASE_ID')

def list_status():
    url = f"https://api.notion.com/v1/databases/{DB_ID}/query"
    req = urllib.request.Request(url, method="POST")
    req.add_header('Authorization', f'Bearer {TOKEN}')
    req.add_header('Notion-Version', '2022-06-28')
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req, data=json.dumps({"page_size": 20}).encode()) as response:
            res = json.loads(response.read().decode())
            for page in res.get('results', []):
                props = page['properties']
                # Check for Name property
                name = "Unnamed"
                if 'Name' in props and props['Name']['title']:
                    name = props['Name']['title'][0]['plain_text']
                
                status = "Missing"
                if 'Status' in props:
                    s_prop = props['Status']
                    if s_prop['type'] == 'status':
                        status = s_prop['status']['name']
                    elif s_prop['type'] == 'select':
                        status = s_prop['select']['name']
                print(f"- {name} | Status: {status}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_status()
