import json
import requests
import time

API_KEY = "ntn_X35904089085dj81e9AJCIrVsEbWQ8gPoL5e4iKqGXv69W"
NOTION_VERSION = "2022-06-28"
DB_ID = "30e0d6014acc8032b605c7a99f8ae112"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json"
}

with open("template_mapping.json") as f:
    mapping = json.load(f)

templates = {
    "ADHDPARENT": """👨‍👩‍👧‍👦 ADHD Parenting Survival Kit

Overstimulated and about to snap at your kids again?
You're not a bad parent. You're an overstimulated one.

---

**IF YOU'RE ABOUT TO EXPLODE RIGHT NOW:**
1. LEAVE THE ROOM. Mummy/Daddy needs 3 minutes.
2. COLD WATER. Face + wrists under cold tap.
3. BREATHE. In for 4, hold 4, out for 6.
4. RETURN. "Sorry I needed a break. Let's try again."

---

**SENSORY ACCOMMODATIONS:**
🔊 SOUND: Loop earplugs or noise-cancelling headphones.
🧤 TOUCH: No scratchy uniforms at home; "I love you but can't handle hugs right now."
👁️ VISUAL: Reduce clutter, dim lights.

**THE 3-MINUTE RULE:**
When you feel the snap coming, lock the bathroom door for 3 minutes. It models regulation for your kids.

**REPAIR SCRIPT:**
"I'm sorry I yelled. I got overwhelmed. That wasn't your fault. I'm working on managing my feelings better."

— SOR7ED""",

    "HARMFUL": """⚠️ Relationship Harm-Reduction Kit

Sometimes we're the ones causing harm. ND struggles EXPLAIN behavior, they don't EXCUSE it.

---

**ND PATTERNS THAT HURT:**
1. RSD Rage Spirals: Lashing out because you feel rejected.
2. Shutdown Stonewalling: Emotional abandonment for hours/days.
3. Weaponized Vulnerability: Using "I'm overwhelmed" to dodge accountability.

**HARM-REDUCTION PROTOCOLS:**
🛑 THE RSD PROTOCOL: "I'm flooded, not angry at you. I need 10 mins to reality-check."
💤 THE SHUTDOWN PLAN: Hand partner a card: "I'm shutdown. Need space. Will check in at [time]."

**REPAIR SCRIPT:**
"I [specific action]. That hurt you. I'm sorry." (Stop talking. Let them respond.)

**IF THEY WANT TO LEAVE:**
Don't beg or promise. Say: "I understand. I've hurt you. What do you need from me right now?"

— SOR7ED""",

    "HOUSING": """🏠 SOR7ED Housing Emergency Path

Facing eviction or rent arrears? Don't freeze. Fix the system.

---

**IF IN ARREARS:**
1. Set up a Standing Order for your NEXT rent now. Make it automatic (payday delivery).
2. Script to Landlord: "I'm behind by £___. I can pay £___ immediately and £___/month until cleared. Can we agree to this plan in writing?"

**IF YOU RECEIVED COURT SUMMONS:**
YOU MUST ATTEND. If you don't, it's an automatic eviction. Bring evidence of ADHD/disability. Judges are more lenient when you show you've fixed the system.

**EMERGENCY HELP:**
📞 Shelter: 0808 800 4444 (Free advice)
📞 Citizens Advice: Local support
📞 Local Council: Homelessness prevention team

Never rely on manual payments. Your brain WILL forget. Automation is your only safety.

— SOR7ED""",

    "COOLOFF": """❄️ COOLOFF: RSD Emergency Script

In a rejection spiral? Your brain is lying to you. Use these to pause the nervous system flood.

---

**1. INTERNAL RESET:**
- Cold water on face (TIPP skill)
- 4-7-8 breathing
- Say out loud: "This is a chemical reaction, not a fact."

**2. RESPONSE DELAY SCRIPTS:**
- "I'm feeling a bit sensitive right now. I need 20 mins to process so I can respond properly."
- "I heard you, but my brain is spiraling. Let's talk in an hour."

**3. REALITY CHECK:**
- What is the EVIDENCE? (vs what am I feeling?)
- Is this person normally cruel? (If no, assume neutral intent)

Never send the first draft of a reply while flooding. Wait for the cooloff.

— SOR7ED""",

    "SENSORY": """🎯 SENSORY: Regulation Audit

Is the room too much, or am I just \"difficult\"? (It's the room).

---

**THE AUDIT:**
□ Sound: Hum of fridge? Distant TV? People talking? (Use Loop earplugs)
□ Light: Too bright? Fluorescent flicker? (Dim lights / Sunglasses)
□ Touch: Tight jeans? Scratchy tag? Feet cold? (Change to soft clothes)
□ Smell: Cooking? Perfume? (Open window / Air filter)

**THE 1% FIX:**
- Weighted blanket / Heavy hoodie
- Sunglasses indoors
- No-noise time for 10 mins
- Fidget / Stim freely

If you're overstimulated, don't try to push through. Lower the volume of the world first.

— SOR7ED""",

    "DOPAMINE": """📜 DOPAMINE: Menu Generator

Low dopamine = choice paralysis. This is your pre-built list of \"fuel.\"

---

**1. STARTERS (5-10 mins):**
- Fidgeting / Stim dance
- Intense cold water
- Quick victory (make bed)

**2. MAINS (30-60 mins):**
- Hyperfocus hobby
- Exercise / Body move
- Creative work

**3. SIDES (Passive):**
- Lofi music / Brown noise
- Aromatherapy
- Fidget toy while working

**4. DESSERTS (Limit these):**
- Doomscrolling / Gaming / Shopping

*Task:* Text \"DOPAMINE\" if you want me to help you build your personalized menu step-by-step.

— SOR7ED""",

    "CRISIS": """🆘 Crisis Triage Protocol

In crisis right now? This isn't a hotline—it's a reality-check protocol.

---

**IF IN IMMEDIATE DANGER:**
☎️ Samaritans: 116 123
💬 Shout: Text 85258
🚨 999 or A&E if you have a plan

---

**THE CRITICAL DIFFERENCE:**
INTRUSIVE THOUGHTS: Pop up uninvited. Feel alien. You DON'T want to act on them.
ACTIVE PLANNING: Specific method + timeline. Gathering means. resolution. (MEDICAL EMERGENCY).

**GROUNDING (5-4-3-2-1):**
- 5 things you see
- 4 things you can touch
- 3 things you hear
- 2 things you smell
- 1 thing you taste

**NEXT 24 HOURS:**
- Cancel all non-essentials.
- Sleep as much as possible.
- Tell someone: \"I'm struggling. Not planning anything. Just need you to know.\"

— SOR7ED""",

    "AGENCYPLAN / WAKE": """🧠 The Wake-Up Protocol (AGENCYPLAN)

Stuck in a dissociation loop or scroll spiral? You're not \"bad,\" you're seeking a dopamine escape.

---

**IMMEDIATE 'WAKE' ACTIONS:**
1. SHOCK: Splash ICE COLD water on your face (Mammalian Dive Reflex).
2. BOUNDARY: Put the device in another room.
3. GROUNDING: 5-4-3-2-1 sweep of the room.

**THE PLAN:**
□ Is my body hungry/tired/thirsty? (H.A.L.T)
□ Am I avoiding a task? (Set a 5-min timer for ONE tiny part)
□ Am I overstimulated? (Dim lights, quiet space)

**ENVIRONMENT DESIGN:**
- Charge phone in kitchen, not bedroom.
- Install app blockers for 10 PM.

— SOR7ED""",

    "CONSENT": """🤝 The Consent & Boundary Protocol

Communication isn't natural—it's a skill.

---

**THE SIGNAL SYSTEM (Traffic Lights):**
🟢 GREEN: \"I'm enjoying this. Keep going.\"
🟡 YELLOW: \"Pause. Check-in. I'm unsure/overstimulated.\"
🔴 RED: \"Stop immediately. I need space. Not about you, about my system.\"

*Agreement:* A Red signal requires zero explanation and carries zero shame.

**HARM REDUCTION:**
Establish a physical 'Safe Word' (e.g., double tap on arm) if you go non-verbal during freeze response.

— SOR7ED""",

    "HYPERFOCUS": """🧠 Hyperfocus Survival Kit

Lost in the tunnel and forgot to exist?

---

**IF IN THE TUNNEL RIGHT NOW:**
1. Stand up (breaks physical state)
2. Leave the room
3. Drink water + eat protein
4. Move your body

**EXIT PROTOCOLS:**
- Best method: HUMAN INTERRUPT. Ask someone to call you at [time].
- Set "HARD STOP" alarms at 6 hours.

**RECOVERY:**
Avoid big decisions for 4 hours after emerging. Your brain is temporarily impaired by dopamine depletion.

— SOR7ED""",

    "WORKMELT": """🚨 Workplace Meltdown Protocol

Not a tantrum. Not weakness. A nervous system in crisis.

---

**EMERGENCY EXIT:**
1. LEAVE: Bathroom, car, or outside.
2. GROUND: Cold water on face + wrists.
3. TEXT: \"I need 15 mins to manage sensory overload. I'll be back shortly.\"

**THE P.A.R.K. PROTOCOL:**
P - Pause
A - Acknowledge (overload)
R - Retreat
K - Kindness (\"My brain is protecting me\")

— SOR7ED""",

    "ALCOHOL": """🍺 Alcohol + ADHD Meds Harm-Reduction

Stimulants mask alcohol's effects—you won't \"feel\" drunk until the crash.

---

**THE CRASH:**
Heart strain + sudden dehydration. Mixing stimulants and depressants is high cardiovascular stress.

**HARM REDUCTION:**
1. TIMING: Don't drink until 4-6 hours after last med dose.
2. MEAL: Eat a full protein meal before starting.
3. TRACK: Set a limit (e.g., 2 drinks) and tell someone.

**WARNING:**
If you have morning shakes or blackouts, go to A&E. Alcohol withdrawal can be fatal.

— SOR7ED""",

    "FIRED": """💼 72-Hour Career Crisis Plan

Just lost your job? immediate survival steps.

---

**HOUR 1-24:**
1. BREATHE. You will survive.
2. APPLY: Start Universal Credit claim TODAY (5-week delay).
3. CHECK: Final paycheck holiday pay calculation.

**HOUR 24-48:**
- Pause all non-essential subscriptions.
- Tell landlord early if rent will be late.
- Ask for body-doubling to face the paperwork.

**SHAME REBIASED:**
\"The structure didn't fit my brain. That's data, not failure. I'm building better systems.\"

— SOR7ED""",

    "DEBT": """💳 Debt Triage Protocol (Shame-Free)

Impulse spending isn't moral failure—it's dopamine regulation.

---

**STOP THE BLEEDING:**
1. Freeze cards in ice or give to friend.
2. Delete saved payment info from apps.
3. Unsubscribe from marketing emails.

**TRIAGE ORDER:**
1. Housing (Rent/Mortgage)
2. Utilities
3. Food
4. Debt minimums (Automate these)

**RESOURCES:**
StepChange: 0800 138 1111 (Free debt advice)

— SOR7ED""",
    
    "INDEX": """📚 SOR7ED Protocol Index

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
}

for name, content in templates.items():
    page_id = mapping.get(name)
    if not page_id:
        # Check for EVICTION/HOUSING mapping
        if name == "HOUSING":
            page_id = mapping.get("HOUSING")
        elif name == "EVICTION":
            page_id = mapping.get("EVICTION")
    
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

