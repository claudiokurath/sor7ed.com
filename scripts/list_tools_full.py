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
        with urllib.request.urlopen(req, data=json.dumps({"page_size": 100}).encode()) as response:
            res = json.loads(response.read().decode())
            for page in res.get('results', []):
                props = page['properties']
                name = props['Name']['title'][0]['plain_text'] if props['Name']['title'] else "Unnamed"
                
                status_val = "N/A"
                if 'Status' in props and props['Status']:
                    s = props['Status']
                    if s['type'] == 'status' and s['status']:
                        status_val = s['status']['name']
                    elif s['type'] == 'select' and s['select']:
                        status_val = s['select']['name']
                
                # Also check for 'Public' just in case
                is_public = "N/A"
                if 'Public' in props and props['Public']:
                    is_public = str(props['Public'].get('checkbox', False))
                
                print(f"- {name} | Status: {status_val} | Public: {is_public}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_status()
