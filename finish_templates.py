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

with open("template_mapping.json") as f:
    mapping = json.load(f)

templates = {
    "NEEDSCHECK": """🔍 NEEDSCHECK: Dopamine vs. Need fulfillment
    
Stuck in a dopamine-chasing loop but still feeling "empty"? 
Your brain is chasing a signal, but your body is missing a requirement.

---

**THE TRIAGE (H.A.L.T.S):**
Before you buy, scroll, or snack, check these 5 systems:

1. 🍔 HUNGRY: When did you last eat protein?
2. 😤 ANGRY/ANXIOUS: Is there a task you're avoiding?
3. 🥱 LONELY/LACKING: Do you need human contact or a "body double"?
4. 😴 TIRED: Are you actually just exhausted?
5. 💦 SENSORY: Is the environment too loud/bright/tight?

---

**THE DOPAMINE SHIFT:**
□ Clean Dopamine: Stretching, cold water, loud music, tidy 1 surface.
□ Dirty Dopamine: Doomscrolling, impulsive shopping, sugar.

**THE 10-MINUTE RULE:**
If the urge is high, say: "I can have it in 10 minutes if I still want it after I drink 1 glass of water and do 10 jumping jacks."

— SOR7ED""",

    "CAREER": """💼 CAREER: The "Almost Thriving" Penalty
    
Doing great in meetings but failing at your inbox? The cost of "Masking for Excellence" is burnout.

---

**THE GAP AUDIT:**
□ Performance: High (You're smart, capable, and valued)
□ Administration: Low (Emails, expenses, and scheduling are killing you)

**THE INFRASTRUCTURE FIX:**
1. THE 15-MIN BLITZ: Set a timer for the first 15 mins of work. ONLY admin.
2. TEMPLATES: Stop writing the same email twice. Create a "Scripts" doc.
3. DELEGATE/AUTOMATE: Use tools like Zapier or a "Body Double" for filing.

**COMMUNICATION SCRIPT:**
"I'm high-performance on [Project X], but I struggle with the administrative lag. Can we focus our check-ins on unblocking the admin so I can stay in the flow?"

— SOR7ED""",

    "RELAPSE": """🔄 RELAPSE: The Recovery Spiral
    
Relapse isn't "Day 0." It's part of the process. You haven't lost the 100 days; you've just added 1 day of data.

---

**IMMEDIATE ACTIONS (0-2 hours):**
1. SHAME BLOCK: Say out loud: "I have a ND brain. I hit a limit. I'm learning, not failing."
2. STABILIZE: Sleep, water, and food. No big decisions.
3. THE "WHY" NOT "WHAT": Don't ask what you did. Ask what trigged the overwhelm (Sensory? Social? Task?).

**THE RECOVERY PATH:**
□ Clear the calendar for 24 hours.
□ Text 1 safe person: "I had a slip. I'm safe but recovering. No advice needed, just want you to know."
□ Return to baseline meds/routine immediately.

— SOR7ED""",

    "GAMBLING": """🎰 GAMBLING: Dopamine & The Chasing Loop
    
It's not about the money. It's about the "Near Miss" dopamine spike. Your brain is wired for high-stakes variability.

---

**EMERGENCY BRAKES:**
1. GAMSTOP (UK): Register today to ban yourself from all betting sites.
2. BANK BLOCK: Open your banking app and toggle "Gambling Block" to ON.
3. ACCOUNTABILITY: Give your login passwords to a trusted person.

**THE ND MECHANISM:**
You aren't "greedy." You are seeking the ONLY thing that's loud enough to cut through the ADHD noise.

**REPLACEMENT DOPAMINE:**
Try high-intensity video games, cold plunges, or competitive sports. You need the ADRENALINE, not the wager.

— SOR7ED""",

    "EATINGDISORDER": """🍟 EATINGDISORDER: Sensory & Executive Function
    
Eating is an 11-step executive function nightmare. It's not just "willpower."

---

**THE SENSORY AUDIT:**
□ Textures: Are you avoiding "slimy" or "crunchy" foods?
□ Prep Overwhelm: Is the thought of the dishes stopping the meal?
□ Interoception: Do you actually feel "hungry" or just "lightheaded"?

**HARM REDUCTION:**
1. SAFE FOODS: Keep a stock of foods you ALWAYS can eat (even if it's just cereal).
2. NO-COOK DAYS: Use meal replacements or pre-made food.
3. SENSORY EATING: Wear headphones while eating if the sound of chewing is a trigger.

— SOR7ED""",

    "REGULATE": """🩹 REGULATE: First Aid for Intense Urges
    
Urges to harm or "explode"? Your nervous system is in RED ZONE. We need a physical interrupt.

---

**THE SHOCK SCALE:**
1. ICE: Hold an ice cube in your hand until it melts. Or an ice pack on your chest.
2. TIPP: (Temperature, Intense exercise, Paced breathing, Progressive muscle relaxation).
3. LOUD: Put on heavy music and move your body violently/dance it out.

**THE DELAY SCRIPTS:**
"I can act on this in 15 minutes, but for these 15 minutes, I will [Wash my face / Walk for 5 mins / Text SOR7ED]."

**GROUNDING:**
Identify: 3 things that are BLUE, 3 things made of WOOD, 3 things that SMELL like nothing.

— SOR7ED""",

    "MEDTRAUMA": """🏥 MEDTRAUMA: Healthcare Avoidance
    
Avoiding the doctor because the waiting room is noise-hell and the paperwork is a trap?

---

**THE ADVOCACY KIT:**
□ The Note: Write down your symptoms BEFORE you go. Hand it to the doctor.
□ The sensory kit: Wear earplugs/sunglasses in the waiting room.
□ The "Ally": Ask a friend to come with you just to sit in the room (Body doubling).

**COMMUNICATION SCRIPT:**
"I have executive function struggles and find medical environments overstimulating. Can we communicate via text/email where possible? I need clear, written instructions for my medication."

— SOR7ED""",

    "SELFHARMCRISIS": """🆘 SELFHARMCRISIS: Immediate Harm-Reduction
    
The urge is a wave. It WILL peak and it WILL subside. You just need to survive the peak.

---

**IMMEDIATE PHYSICAL INTERRUPTIONS:**
□ Ice cubes to the wrist or face.
□ Snap a rubber band against your skin.
□ Eat something intense (Lemon, Chili, Ginger).
□ Intense workout (Pushups until failure).

**UK EMERGENCY NUMBERS:**
☎️ Samaritans: 116 123
💬 Shout: Text 85258
🚨 999: If you have already harmed yourself and need medical attention.

**THE RULE:** 
Do not be alone for the next hour. Go to a public space or call a friend.

— SOR7ED"""
}

for name, content in templates.items():
    page_id = mapping.get(name)
    if page_id:
        print(f"Updating {name} ({page_id})...")
        url = f"https://api.notion.com/v1/pages/{page_id}"
        data = {
            "properties": {
                "Template": {
                    "rich_text": [{"text": {"content": content}}]
                }
            }
        }
        res = requests.patch(url, headers=headers, json=data)
        if res.status_code == 200:
            print(f"✅ {name} updated.")
        else:
            print(f"❌ Error updating {name}: {res.text}")
        time.sleep(0.5)
    else:
        print(f"⚠️ Page ID for {name} not found in mapping.")

