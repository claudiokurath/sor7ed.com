import os
import json
import urllib.request

TOKEN = os.environ.get('NOTION_TOOLS_TOKEN')
DB_ID = os.environ.get('NOTION_TOOLS_DATABASE_ID')

master_ctas = [
    {
        "name": "Role-Fit Memo",
        "desc": "Strategy for manager communication, role adjustments, and workplace accommodations.",
        "cta": "ROLEFIT",
        "branch": "Growth",
        "template": "📝 ROLE-FIT MEMO PROTOCOL\n\nObjective: Formalize your support needs.\n\nDeliverable: Your custom Role-Fit Memo template is ready.\nLink: [sor7ed.com/templates/role-fit]\n\nNext Step: Fill the 'Current Friction' section first."
    },
    {
        "name": "Meltdown First Aid",
        "desc": "Emergency de-escalation protocol for overwhelm at work or shutdown states.",
        "cta": "WORKPARK",
        "branch": "Mind",
        "template": "🚨 MELTDOWN FIRST AID (WORK)\n\nProtocol Active. \n\n1. Pause all non-essential communication.\n2. Move to 'Sensory Safe' location (even a bathroom stall).\n3. Use the Meltdown De-escalation recovery sheet.\nLink: [sor7ed.com/templates/meltdown-work]\n\nStatus: You are safe. This is physiological, not personal."
    },
    {
        "name": "Timerails Kit",
        "desc": "Visual time stacking system to combat time blindness and finish tasks cleanly.",
        "cta": "TIMERAILS",
        "branch": "Mind",
        "template": "⏳ TIMERAILS KIT\n\nYour visual time-stacking framework.\n\nContents:\n- Decompression buffer map\n- Hyperfocus alarm triggers\n- The 'Clean Finish' checklist\n\nLink: [sor7ed.com/templates/timerails]"
    },
    {
        "name": "ADHD Systems Sprint",
        "desc": "2-week intensive framework for building low-friction operational systems.",
        "cta": "ADHDSPRINT",
        "branch": "Mind",
        "template": "⚡ ADHD SYSTEMS SPRINT\n\n2-Week High-Friction Audit Protocol.\n\nWeek 1: Identify Leakage Points\nWeek 2: Build Automated Guardrails\n\nSprint Framework: [sor7ed.com/templates/adhd-sprint]"
    },
    {
        "name": "Money Reset (4 Accounts)",
        "desc": "Banking rails and impulse spending guardrails. Financial executive function support.",
        "cta": "AGENCYPLAN",
        "branch": "Wealth",
        "template": "💰 MONEY RESET PROTOCOL\n\nBanking Rails initialized: 4-Account System.\n\n1. Income Vault\n2. Fixed Bills (Automatic)\n3. Weekly Allowance (Manual move)\n4. Deep Savings\n\nDownload the worksheet: [sor7ed.com/templates/money-reset]"
    },
    {
        "name": "Sensory Green Zone",
        "desc": "Environment audit and design for sensory safe processing spaces.",
        "cta": "SENSORYMAP",
        "branch": "Mind",
        "template": "🌿 SENSORY GREEN ZONE MAP\n\nEnvironment Calibration Protocol.\n\nStep 1: Check your 'Sensory Debt' levels.\nStep 2: Map your existing 'Green Zones'.\nStep 3: Design your 'Safety Anchor'.\n\nWorksheet: [sor7ed.com/templates/sensory-map]"
    },
    {
        "name": "Consent Kit",
        "desc": "Printable communication cards for intimacy, boundaries, and clear consent.",
        "cta": "CONSENTKIT",
        "branch": "Connection",
        "template": "⚖️ CONSENT KIT\n\nCommunication Shortcuts for high-stakes interactions.\n\nIncluded: Printable Consent Cards & Intimacy Scripts.\nLink: [sor7ed.com/templates/consent-kit]"
    },
    {
        "name": "Boundaries Pack (Holidays)",
        "desc": "Response scripts for family repairs, holiday stress, and boundary setting.",
        "cta": "BOUNDARIESPACK",
        "branch": "Connection",
        "template": "🛡️ BOUNDARIES PACK: HOLIDAYS\n\nOperational scripts for complex family dynamics.\n\n- How to say NO without guilt.\n- The 'Graceful Exit' scripts.\n- Post-event recovery protocol.\n\nPack: [sor7ed.com/templates/boundaries-holidays]"
    }
]

def sync_master_ctas():
    for tool in master_ctas:
        url = "https://api.notion.com/v1/pages"
        data = {
            "parent": {"database_id": DB_ID},
            "properties": {
                "Name": {"title": [{"text": {"content": tool["name"]}}]},
                "Description": {"rich_text": [{"text": {"content": tool["desc"]}}]},
                "WhatsApp CTA": {"rich_text": [{"text": {"content": tool["cta"]}}]},
                "Branch": {"select": {"name": tool["branch"]}},
                "Status": {"status": {"name": "Public"}},
                "Template": {"rich_text": [{"text": {"content": tool["template"]}}]}
            }
        }
        
        req = urllib.request.Request(url, method='POST')
        req.add_header("Authorization", f"Bearer {TOKEN}")
        req.add_header("Notion-Version", "2022-06-28")
        req.add_header("Content-Type", "application/json")
        
        try:
            with urllib.request.urlopen(req, data=json.dumps(data).encode()) as f:
                print(f"Synced Master CTA: {tool['name']}")
        except Exception as e:
            print(f"Failed {tool['name']}: {e}")

if __name__ == "__main__":
    sync_master_ctas()
