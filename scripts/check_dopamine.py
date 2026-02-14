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

def check_trigger(trigger_name):
    query_data = {
        "filter": {
            "property": "Trigger",
            "rich_text": {"equals": trigger_name}
        }
    }
    res = notion_api(f"databases/{DB_ID}/query", "POST", query_data)
    if res and res.get('results'):
        print(f"✅ Found mapping for [{trigger_name}]")
        return True
    else:
        print(f"❌ No mapping found for [{trigger_name}]")
        return False

if __name__ == "__main__":
    check_trigger("DOPAMINE")
