import json
import requests
import time

API_KEY = "ntn_X35904089085dj81e9AJCIrVsEbWQ8gPoL5e4iKqGXv69W"
NOTION_VERSION = "2022-06-28"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json"
}

index_content = """📚 SOR7ED Protocol Index

Text any keyword below for intervention:

🆘 EMERGENCY:
• CRISIS
• SELFHARMCRISIS
• REGULATE

🏠 STABILITY:
• EVICTION / HOUSING
• DEBT
• FIRED

🧠 MIND:
• HYPERFOCUS
• WORKMELT
• AGENCYPLAN

❤️ SELF/RELATIONS:
• CONSENT
• ADHDPARENT
• HARMFUL

⚙️ LIFESTYLE:
• ALCOHOL
• EATINGDISORDER
• CAREER

— SOR7ED"""

ids = ["30e0d601-4acc-80b6-8b8f-da19be633813", "653ae06d-91c3-444d-817f-d3bd71b0c2b4"]

for page_id in ids:
    print(f"Updating Index ({page_id})...")
    url = f"https://api.notion.com/v1/pages/{page_id}"
    data = {
        "properties": {
            "Template": {
                "rich_text": [{"text": {"content": index_content}}]
            }
        }
    }
    res = requests.patch(url, headers=headers, json=data)
    if res.status_code == 200:
        print(f"✅ {page_id} updated.")
    else:
        print(f"❌ Error updating {page_id}: {res.text}")
    time.sleep(0.5)
