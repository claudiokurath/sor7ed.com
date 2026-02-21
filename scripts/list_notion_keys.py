import os
import json
import urllib.request

TOKEN = os.environ.get('NOTION_API_KEY')
DB_ID = os.environ.get('NOTION_BLOG_DB_ID')

def list_keys():
    url = f"https://api.notion.com/v1/databases/{DB_ID}/query"
    req = urllib.request.Request(url, method="POST")
    req.add_header('Authorization', f'Bearer {TOKEN}')
    req.add_header('Notion-Version', '2022-06-28')
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req, data=json.dumps({"page_size": 1}).encode()) as response:
            res = json.loads(response.read().decode())
            if res['results']:
                props = res['results'][0]['properties']
                print("Property Keys:")
                for key in props.keys():
                    print(f"- {key}")
            else:
                print("No results found.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_keys()
