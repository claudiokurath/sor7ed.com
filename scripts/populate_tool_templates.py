import os
import json
import urllib.request

TOKEN = os.environ.get('NOTION_TOOLS_TOKEN')
DB_ID = os.environ.get('NOTION_TOOLS_DATABASE_ID')

tool_templates = {
    "FIDGET": """🫧 SENSORY FIDGET PROTOCOL

You've activated the tactile regulation system.

OBJECTIVE: Heavy sensory input to break an overstimulation loop.

ACTION:
1. Open the website: [sor7ed.com/lab/fidget]
2. Pop 3 sheets of bubbles as slowly as possible.
3. Focus on the spatial sound as it pops.
4. Scale: How do you feel 1-10 after?

TIP: Use this when your brain feels 'noisy' or 'static'.""",

    "FOCUS": """⚙️ FOCUS ENGINE (POMODORO+)

Strategic Deep Work Protocol initialized.

STRUCTURE:
- 25 Minutes: High-Impact Execution
- 5 Minutes: True Recovery (No screens)

RULES:
- Single-point focus only.
- Minimize all external stimuli.
- Respect the recovery bell—it's what prevents the afternoon crash.

RECOVERY OPTIONS:
- 🧊 Ice water on wrists
- 🧘 2 minute floor stretch
- 🫧 Sensory Fidget

Initialize your engine here: [sor7ed.com/lab/focus]""",

    "BREAK": """🛠️ TASK DECONSTRUCTOR

Overwhelm detected. Breaking objective into atomic components.

PHASES:
1. Initial Setup: Gather ALL materials.
2. Logic Mapping: Define the 'First Move'.
3. Execution: Focus ONLY on one sub-task.
4. Reset: Short sensory break.

If you're stuck, use the visual deconstructor: [sor7ed.com/lab/breaker]

Text me your task if you need an AI-driven breakdown.""",

    "MOOD": """📊 BIOMETRIC STATE TRACKER

Internal monitoring active. 

MAPPING:
- Emotion: How are you feeling right now?
- Energy: 1 (Depleted) to 10 (Peak).

VISUALIZATION:
Check your correlation chart on the lab: [sor7ed.com/lab/mood]

Pattern recognized in ADHD brains: Energy and Mood often drift apart. Tracking helps identify the 'Burnout Cliff' before you fall over it.""",

    "ROUTINE": """📋 ROUTINE ARCHITECT

Protocol Sequence mapped.

GOAL: Eliminate decision fatigue at transition points.

CHECKLIST:
- Wake Up 🌅
- Hydrate 💧
- Deep Work 📚
- Movement 🏃
- Nutrition 🍲
- Sleep 🌙

Build your custom protocol: [sor7ed.com/lab/routine]""",

    "SOCIAL": """🤝 SOCIAL SCENARIO SIMULATOR

Interaction script practice initialized.

CURRENT DRILL: Networking / Café interaction.

EXPERT TIPS:
- Maintain 3 seconds of eye contact.
- Ask one reciprocating question.
- Use the 'Graceful Exit' scripts if overwhelmed.

Practice the scripts safely here: [sor7ed.com/lab/social]"""
}

def update_templates():
    # Fetch all tools to match keywords
    url = f"https://api.notion.com/v1/databases/{DB_ID}/query"
    req = urllib.request.Request(url, method='POST')
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Notion-Version", "2022-06-28")
    req.add_header("Content-Type", "application/json")
    
    try:
        with urllib.request.urlopen(req) as f:
            res = json.loads(f.read().decode())
            for page in res['results']:
                if 'properties' not in page:
                    print(f"Skipping non-page item: {page.get('id')}")
                    continue
                props = page['properties']
                cta_list = props.get('WhatsApp CTA', {}).get('rich_text', [])
                if not cta_list: continue
                cta = cta_list[0]['plain_text'].strip().upper()
                
                if cta in tool_templates:
                    page_id = page['id']
                    update_url = f"https://api.notion.com/v1/pages/{page_id}"
                    update_data = {
                        "properties": {
                            "Template": {"rich_text": [{"text": {"content": tool_templates[cta]}}]}
                        }
                    }
                    u_req = urllib.request.Request(update_url, method='PATCH')
                    u_req.add_header("Authorization", f"Bearer {TOKEN}")
                    u_req.add_header("Notion-Version", "2022-06-28")
                    u_req.add_header("Content-Type", "application/json")
                    urllib.request.urlopen(u_req, data=json.dumps(update_data).encode())
                    print(f"Updated Template for: {cta}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_templates()
