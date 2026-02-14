import json
import urllib.request

TOKEN = "ntn_Y35904089084QfAR73SCzJllwpTRgonCJuCXxdQBWJH07g"
DB_ID = "2d80d6014acc8057bbb9e15e74bf70c6"

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

def map_tool(title_val, trigger_val):
    print(f"Mapping [{title_val}] to Trigger [{trigger_val}]...")
    query_data = {
        "filter": {
            "property": "Title",
            "title": {"equals": title_val}
        }
    }
    res = notion_api(f"databases/{DB_ID}/query", "POST", query_data)
    if res and res.get('results'):
        for page in res['results']:
            page_id = page['id']
            update_data = {
                "properties": {
                    "Trigger": {"rich_text": [{"text": {"content": trigger_val}}]}
                }
            }
            notion_api(f"pages/{page_id}", "PATCH", update_data)
            print(f"✅ Successfully mapped {page_id}")
    else:
        print(f"❌ Could not find post with title: {title_val}")

if __name__ == "__main__":
    map_tool("The dopamine menu", "DOPAMINE")
    map_tool("Focus Lock", "FOCUS") # Just in case
