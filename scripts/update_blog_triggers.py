import os
import requests
import json

NOTION_API_KEY = 'ntn_X35904089085dj81e9AJCIrVsEbWQ8gPoL5e4iKqGXv69W'
BLOG_DB_ID = 'db668e4687ed455498357b8d11d2c714'

headers = {
    'Authorization': f'Bearer {NOTION_API_KEY}',
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
}

TRIGGER_MAP = {
    'rsd': 'RSD',
    'dopamine': 'DOPAMINE',
    'meltdown': 'WORKMELT',
    'sensory': 'SENSORY',
    'adhd tax': 'ADHDTAX',
    'housing': 'HOUSING',
    'eviction': 'EVICTION',
    'gaming': 'GAME',
    'alcohol': 'ALCOHOL',
    'substance': 'SUBSTANCES',
    'self-harm': 'HARMFUL',
    'suicidal': 'CRISIS',
    'consent': 'CONSENT',
    'intimacy': 'INTIMACY',
    'fired': 'FIRED',
    'job loss': 'JOBLOSS',
    'debt': 'DEBT',
    'medicine': 'MEDS',
    'medication': 'MEDS',
    'trauma': 'MEDTRAUMA',
    'friendship': 'FRIENDS',
    'parenting': 'ADHDPARENT',
    'needs': 'NEEDSCHECK',
    'addiction': 'SUBSTANCES',
    'hyperfocus': 'HYPERFOCUS'
}

def main():
    print("Updating Blog Triggers...")
    res = requests.post(f'https://api.notion.com/v1/databases/{BLOG_DB_ID}/query', headers=headers)
    pages = res.json().get('results', [])
    
    for page in pages:
        title = page['properties']['Title']['title'][0]['plain_text'].lower()
        trigger_found = None
        for key, val in TRIGGER_MAP.items():
            if key in title:
                trigger_found = val
                break
        
        if trigger_found:
            print(f"Setting {trigger_found} for: {title}")
            requests.patch(f'https://api.notion.com/v1/pages/{page["id"]}', headers=headers, json={
                "properties": {
                    "Trigger": { "rich_text": [{ "text": { "content": trigger_found } }] }
                }
            })

if __name__ == "__main__":
    main()
