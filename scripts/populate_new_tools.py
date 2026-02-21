import os
import json
import urllib.request

TOKEN = os.environ.get('NOTION_API_KEY')
DB_ID = os.environ.get('NOTION_TOOLS_DB_ID')

new_tools = [
    {
        "name": "Sensory Fidget Simulator",
        "desc": "High-fidelity tactile regulation system. Virtual bubble wrap with sensory auditory feedback for immediate grounding.",
        "cta": "FIDGET",
        "branch": "Mind"
    },
    {
        "name": "Focus Engine (Pomodoro)",
        "desc": "Strategic deep-work timer with automated sensory recovery intervals (25/5 protocol).",
        "cta": "FOCUS",
        "branch": "Mind"
    },
    {
        "name": "Task Deconstructor",
        "desc": "Executive function support system that atomically breaks complex objectives into manageable sub-tasks.",
        "cta": "BREAK",
        "branch": "Mind"
    },
    {
        "name": "Biometric State Tracker",
        "desc": "Internal condition monitoring. Maps mood and energy correlations with real-time visualization.",
        "cta": "MOOD",
        "branch": "Mind"
    },
    {
        "name": "Routine Architect",
        "desc": "Sequential daily protocol builder. Map out your structure to eliminate decision fatigue.",
        "cta": "ROUTINE",
        "branch": "Mind"
    },
    {
        "name": "Social Scenario Simulator",
        "desc": "Branching interaction engine for social script practice and situational awareness training.",
        "cta": "SOCIAL",
        "branch": "Connection"
    }
]

def add_tool(tool):
    url = "https://api.notion.com/v1/pages"
    page_data = {
        "parent": {"database_id": DB_ID},
        "properties": {
            "Name": {"title": [{"text": {"content": tool["name"]}}]},
            "Description": {"rich_text": [{"text": {"content": tool["desc"]}}]},
            "WhatsApp CTA": {"rich_text": [{"text": {"content": tool["cta"]}}]},
            "Status": {"status": {"name": "Public"}},
            "Branch": {"select": {"name": tool["branch"]}}
        }
    }
    
    req = urllib.request.Request(url, method='POST')
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Notion-Version", "2022-06-28")
    req.add_header("Content-Type", "application/json")
    
    data = json.dumps(page_data).encode()
    try:
        with urllib.request.urlopen(req, data=data) as f:
            print(f"Added: {tool['name']}")
    except Exception as e:
        print(f"Failed to add {tool['name']}: {e}")

if __name__ == "__main__":
    for tool in new_tools:
        add_tool(tool)
