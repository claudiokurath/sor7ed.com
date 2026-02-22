import json
import requests
import time

API_KEY = "ntn_X35904089085dj81e9AJCIrVsEbWQ8gPoL5e4iKqGXv69W"
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json"
}

with open("missing_templates.json") as f:
    missing = json.load(f)

mapping = {m['name']: m['id'] for m in missing}

templates = {
    "GAME": """🎮 GAME: The Reset Ritual

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Overwhelm isn't just \"stress\"; it's a nervous system lockout where every task feels like a threat.
⚡ **The Neuro-Shift:** You aren't \"failing\"; you are currently dysregulated. Recovery is the priority, not the chore.

🛠️ **THE PROTOCOL:**
1. THE 5-MIN RESET: Lie on the floor (gravity grounding) and breathe for 2 minutes.
2. THE UNBLOCK: Pick ONE tiny task (e.g., wash one plate) to break the freeze.
3. THE CELEBRATION: Acknowledge the tiny win to spark dopamine.

Read Full Analysis: https://sor7ed.com/blog/The-Reset-Ritual
— SOR7ED""",

    "BURNOUT": """🔋 BURNOUT: Full-System Recovery

Hey! Ready to resolve this.

📌 **The Hidden Friction:** ND burnout isn't just \"tired\"; it's a loss of previously mastered skills due to prolonged masking.
⚡ **The Neuro-Shift:** Rest isn't a reward; it is the infrastructure for existence.

🛠️ **THE PROTOCOL:**
1. RADICAL REDUCTION: Cancel everything non-essential for 48 hours.
2. SENSORY DIET: Dim the lights and use noise-canceling headphones.
3. IDENTITY ANCHOR: Focus on one hobby that doesn't involve \"performance.\"

Read Full Analysis: https://sor7ed.com/blog/Neurodivergent-Burnout
— SOR7ED""",

    "SAFE": """🛡️ SAFE: The Social Safety Net

Hey! Ready to resolve this.

📌 **The Hidden Friction:** RSD makes neutral feedback feel like an agonizing physical blow to the chest.
⚡ **The Neuro-Shift:** Your brain is misinterpreting social cues as survival threats. It's a chemical lie.

🛠️ **THE PROTOCOL:**
1. COOLOFF: Wait 24 hours before responding to any \"rejection.\"
2. REALITY CHECK: Write down the facts vs. your feelings.
3. SELF-VALIDATION: \"I am safe, and this feeling is temporary.\"

Read Full Analysis: https://sor7ed.com/blog/Rejection-Sensitivity
— SOR7ED""",

    "PARK": """🅿️ PARK: The Executive Pause

Hey! Ready to resolve this.

📌 **The Hidden Friction:** We often try to 'power through' overwhelm, which just accelerates the crash.
⚡ **The Neuro-Shift:** Parking the brain is as important as driving it.

🛠️ **THE PROTOCOL:**
1. PAUSE: Stop whatever you are doing immediately.
2. ACKNOWLEDGE: Say \"I am overstimulated\" out loud.
3. RETREAT: Change your physical environment (leave the room).

Read Full Analysis: https://sor7ed.com/blog/PARK-Protocol
— SOR7ED""",

    "LEADERSHIP": """👑 LEADERSHIP: Managing with Impact

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Leading while ND means \"performing\" excellence while drowning in the admin of your own life.
⚡ **The Neuro-Shift:** You don't need to \"fix\" yourself; you need to delegate the friction.

🛠️ **THE PROTOCOL:**
1. ADMIN AUDIT: Identify the top 3 tasks that drain your battery.
2. ASSISTANT PROTOCOL: Use AI or a human body-double for your inbox.
3. STRATEGIC UNMASKING: Be honest with your team about your work style.

Read Full Analysis: https://sor7ed.com/blog/Leadership-Penalty
— SOR7ED""",

    "PARENTING": """👪 PARENTING: The ND Connection

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Parenting requires constant task-switching, which is the exact weakness of the ADHD brain.
⚡ **The Neuro-Shift:** You aren't a bad parent; you are an over-taxed CPU.

🛠️ **THE PROTOCOL:**
1. THE 3-MINUTE RULE: Leave the room for 3 mins before you \"snap.\"
2. SENSORY ACCOMMODATION: Use earplugs for loud play sessions.
3. AUTOMATE EVERYTHING: Set alarms for lunchboxes, school runs, and meds.

Read Full Analysis: https://sor7ed.com/blog/Parenting-ADHD
— SOR7ED""",

    "DYSLEXIA": """📖 DYSLEXIA: The Visual Reframe

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Reading walls of text in a workspace designed for linear processors creates deep cognitive fatigue.
⚡ **The Neuro-Shift:** You aren't \"slow\"; you are a visual/spatial processor in a text-heavy world.

🛠️ **THE PROTOCOL:**
1. TEXT-TO-SPEECH: Use Screen Readers for everything longer than a tweet.
2. VISUAL ORGANIZATION: Use Mind Maps or boards instead of lists.
3. COLOR CODING: Assign colors to different categories of information.

Read Full Analysis: https://sor7ed.com/blog/Dyslexia-Visual
— SOR7ED""",

    "PARENTS": """👵 PARENTS: Intergenerational Masking

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Visiting your parents often triggers a regression back to age 16 and forced masking.
⚡ **The Neuro-Shift:** You are an adult with a different operating system. You don't need their approval to function.

🛠️ **THE PROTOCOL:**
1. BOUNDARY SCRIPT: \"I can visit for 3 hours, then I need to go home to decompress.\"
2. SENSORY RETREAT: Have a \"quiet room\" or exit strategy for every visit.
3. DE-SHAME: Remind yourself that their disapproval is based on their own masking journey.

Read Full Analysis: https://sor7ed.com/blog/Grief-and-Parents
— SOR7ED""",

    "FOOD": """🍱 FOOD: Sensory & Prep

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Eating requires 11 steps of executive function (Planning, Shopping, Prepping, Cleaning).
⚡ **The Neuro-Shift:** Fed is best. The method doesn't matter; the intake does.

��️ **THE PROTOCOL:**
1. STOCK THE \"SAFE FOODS\": Keep foods you always enjoy in bulk.
2. THE NO-COOK RULE: Use meal replacements or pre-made food on low-energy days.
3. SENSORY AUDIT: Avoid textures/smells that trigger your gag reflex.

Read Full Analysis: https://sor7ed.com/blog/Food-Texture-Aversion
— SOR7ED""",

    "MINIMAL": """✨ MINIMAL: The Focus Filter

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Every object in your field of vision is a \"silent request\" for your attention.
⚡ **The Neuro-Shift:** Minimalism isn't an aesthetic; it's an executive function aid.

🛠️ **THE PROTOCOL:**
1. THE CLEAR SURFACE: Keep your main workspace 100% empty except for the current task.
2. BOX THE MESS: If you can't tidy it, put it in a box so you can't see it today.
3. DIGITAL HYGIENE: Close all tabs that aren't related to your ONE current goal.

Read Full Analysis: https://sor7ed.com/blog/Neuro-Minimalism
— SOR7ED""",

    "EVICTION": """🏠 EVICTION: Housing Emergency

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Housing instability triggers the deepest part of the survival brain, making admin tasks impossible.
⚡ **The Neuro-Shift:** You are in crisis mode. Radical automation is your only safety net.

🛠️ **THE PROTOCOL:**
1. THE STANDING ORDER: Set your rent to leave the day you get paid.
2. THE EVICTION SCRIPT: \"I want to pay. Can we agree on a repayment plan in writing?\"
3. LEGAL AID: Contact Shelter or Citizens Advice today. Do not wait.

Read Full Analysis: https://sor7ed.com/blog/Housing-Emergency
— SOR7ED""",

    "REBOUND": """🔄 REBOUND: The Pivot Protocol

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Failure is a physical weight. We often freeze and mourn the \"lost\" person we could have been.
⚡ **The Neuro-Shift:** You aren't starting over; you are starting with experience.

🛠️ **THE PROTOCOL:**
1. DATA AUDIT: What exactly didn't work? (e.g., \"the schedule was too rigid\").
2. SYSTEMic FIX: Add the missing scaffolding (e.g., \"hire a VA\").
3. THE LAUNCH: Set a date and do not look back.

Read Full Analysis: https://sor7ed.com/blog/The-Pivot
— SOR7ED""",

    "MASKING": """🎭 MASKING: Strategic Unmasking

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Masking burns 80% of your energy just to \"appear\" normal, leaving nothing for actual work.
⚡ **The Neuro-Shift:** Authentic performance is better than fake compliance.

🛠️ **THE PROTOCOL:**
1. MASKING AUDIT: Identify where you are forcing the mask most (Interviews? Meetings?).
2. SAFE SPACES: Create \"No-Mask\" zones in your day where you can stim freely.
3. INCREMENTAL UNMASKING: Start with people you trust. Tell them your needs.

Read Full Analysis: https://sor7ed.com/blog/Strategic-Unmasking
— SOR7ED""",

    "RSD": """❄️ RSD: Rejection Sensitivity

Hey! Ready to resolve this.

📌 **The Hidden Friction:** RSD is a neurological misfire where social pain is processed as physical torture.
⚡ **The Neuro-Shift:** Your brain is lying to you about the danger.

🛠️ **THE PROTOCOL:**
1. ICE CHOCK: Use a cold compress to lower your heart rate instantly.
2. SCRIPT THE PAUSE: \"I need 10 mins to think about that feedback.\"
3. FACTS ONLY: Write down the words said, without your interpretation.

Read Full Analysis: https://sor7ed.com/blog/Rejection-Sensitivity
— SOR7ED""",

    "THERAPY": """🛋️ THERAPY: The Clinical Reframe

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Standard CBT often feels like gaslighting for ND brains because it treats neurological limits as \"wrong thoughts.\"
⚡ **The Neuro-Shift:** You don't need to change your brain; you need a therapist who understands it.

🛠️ **THE PROTOCOL:**
1. ADVOCACY SCRIPT: \"I need a sensory-safe environment and homework that respects my executive function.\"
2. THE MASK OFF: Stop trying to be the \"perfect patient.\" Show the mess.
3. MODALITY CHECK: Explore DBT or ERP for neurodivergent-specific needs.

Read Full Analysis: https://sor7ed.com/blog/Therapy-Mismatch
— SOR7ED""",

    "GRIEF": """🌑 GRIEF: Loss and Capacity

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Grief doesn't just add sadness; it subtracts 50% of your executive function capacity.
⚡ **The Neuro-Shift:** You are operating on a low battery. Lower the demand.

🛠️ **THE PROTOCOL:**
1. BEREAVEMENT LEAVE: Take the time. Do not try to \"hustle\" through it.
2. TASK DELEGATION: Ask friends for groceries/admin help.
3. NO BIG DECISIONS: Wait 3 months before making any major life changes.

Read Full Analysis: https://sor7ed.com/blog/Grief-and-Parents
— SOR7ED""",

    "RELATIONSHIPS": """❤️ RELATIONSHIPS: The Intimacy Map

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Relationships require constant non-verbal reading and emotional regulation, which are high-demand tasks.
⚡ **The Neuro-Shift:** Communication is more important than intuition. Be explicit.

🛠️ **THE PROTOCOL:**
1. THE SIGNAL SYSTEM: Use Traffic Lights (Green/Yellow/Red) for social energy.
2. EXPECTATION AUDIT: Tell your partner: \"I'm not ignoring you, I'm just shut down.\"
3. SENSORY INTIMACY: Respect boundaries around touch/smell when overstimulated.

Read Full Analysis: https://sor7ed.com/blog/Masking-in-Intimacy
— SOR7ED""",

    "PATTERNS": """🌀 PATTERNS: Breaking the Loop

Hey! Ready to resolve this.

�� **The Hidden Friction:** We often get stuck in the same \"Failure -> Shame -> Hustle\" cycle because we haven't fixed the root system.
⚡ **The Neuro-Shift:** Patterns are data, not character flaws.

🛠️ **THE PROTOCOL:**
1. CYCLE MAPPING: Identify when the crash happens (usually after a big win).
2. STABILITY ANCHOR: Add a mandatory \"rest day\" after any high-intensity task.
3. THE BRAKE: When you feel the \"hustle\" starting, force a 24-hour pause.

Read Full Analysis: https://sor7ed.com/blog/Relapse-Cycles
— SOR7ED""",

    "RECOVERY": """🩹 RECOVERY: Rebuilding Capacity

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Recovery isn't just \"sleeping\"; it's the slow return of executive function systems.
⚡ **The Neuro-Shift:** You are healing, not failing.

🛠️ **THE PROTOCOL:**
1. THE 1% WIN: Pick one tiny thing to control today (e.g., drink water).
2. PATIENCE WINDOW: Accept that skill return takes months, not weeks.
3. ACCEPTANCE GRID: Map what you *can* do now vs what you used to do.

Read Full Analysis: https://sor7ed.com/blog/Delayed-Skill-Return
— SOR7ED""",

    "SEXHARM": """⚠️ SEXHARM: Harm Reduction & Kink

Hey! Ready to resolve this.

📌 **The Hidden Friction:** ND people often use intense sensory experiences (like kink) to regulate an under-stimulated or distressed brain.
⚡ **The Neuro-Shift:** It's okay to use intensity for healing, as long as the safety system is robust.

🛠️ **THE PROTOCOL:**
1. THE SAFETY CONTRACT: Hard limits must be agreed upon in writing when calm.
2. AFTERCARE: Plan for the post-intensity drop in dopamine.
3. CONSENT SIGNAL: Use a physical safe-word if you go non-verbal during play.

Read Full Analysis: https://sor7ed.com/blog/Suicidal-Ideation-and-Kink
— SOR7ED""",

    "JUSTDOIT": """👟 JUSTDOIT: Breaking Task Paralysis

Hey! Ready to resolve this.

📌 **The Hidden Friction:** \"Just do it\" is impossible when the task doesn't have a clear \"Start\" button.
⚡ **The Neuro-Shift:** The problem isn't the task; it's the size of the first step.

��️ **THE PROTOCOL:**
1. THE ATOMIZER: Break the task into steps so small they feel stupid. (e.g., \"Open the laptop\").
2. THE 5-SECOND RULE: Count down 5-4-3-2-1 and move your body.
3. THE BODY DOUBLE: Have someone else sit in the room while you do it.

Read Full Analysis: https://sor7ed.com/blog/Capacity-Loss
— SOR7ED""",

    "SUBSTANCES": """💊 SUBSTANCES: Harm Reduction

Hey! Ready to resolve this.

📌 **The Hidden Friction:** We often use "street meds" because the official system is too slow or too judgmental.
⚡ **The Neuro-Shift:** Use is a coping mechanism. Safety is the priority.

🛠️ **THE PROTOCOL:**
1. TRACK THE FUNCTION: What is the substance doing for you? (Focus? Quiet? Joy?).
2. SAFER SOURCING: If you are going to use, prioritize purity and low dosage.
3. THE EXIT PLAN: Work with a non-judgmental professional on alternatives.

Read Full Analysis: https://sor7ed.com/blog/Street-Uppers-for-Paperwork
— SOR7ED""",

    "MEDICAL": """🏥 MEDICAL: Advocacy & Access

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Medical environments are a sensory and administrative minefield designed for neurotypicals.
⚡ **The Neuro-Shift:** You are the expert on your body. The doctor is the expert on the medicine.

🛠️ **THE PROTOCOL:**
1. THE LIST: Write down your symptoms and questions before the appointment.
2. THE ADVOCATE: Bring a trusted person to take notes and advocate for you.
3. SENSORY KIT: Wear earplugs/sunglasses in the clinical waiting room.

Read Full Analysis: https://sor7ed.com/blog/Med-Trauma
— SOR7ED""",

    "WILLPOWER": """🔥 WILLPOWER: The Limited Battery

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Willpower isn't a personality trait; it's a glucose-burning chemical resource that runs out fast.
⚡ **The Neuro-Shift:** Stop relying on willpower; start relying on infrastructure.

🛠️ **THE PROTOCOL:**
1. DECISION FATIGUE: Make your most important decisions in the first 2 hours of the day.
2. AUTOMATE HABITS: Use apps to lock your phone so you don't have to \"choose\" to stop.
3. FEED THE BRAIN: Keep your blood sugar stable. Low glucose = zero willpower.

Read Full Analysis: https://sor7ed.com/blog/The-Reset-Ritual
— SOR7ED""",

    "DECLUTTER": """🧹 DECLUTTER: Sensory Processing

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Every object you haven't put away is a \"stalled decision\" that eats your mental bandwidth.
⚡ **The Neuro-Shift:** Tidying is an executive function exercise, not a chore.

🛠️ **THE PROTOCOL:**
1. THE 10-ITEM SWEEP: Put away exactly 10 things. Then stop.
2. EXTERNAL STORAGE: If you can't decide, put it in a \"Limbo Box\" for 30 days.
3. ONE-IN, ONE-OUT: Never add a new object without removing an old one.

Read Full Analysis: https://sor7ed.com/blog/Neuro-Minimalism
— SOR7ED""",

    "JOBLOSS": """💼 JOBLOSS: Crisis Management

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Losing a job feels like a rejection of your entire existence to the ND brain.
⚡ **The Neuro-Shift:** The structure failed you. You didn't fail the structure.

🛠️ **THE PROTOCOL:**
1. APPLY TODAY: Start your Universal Credit claim immediately (5-week wait).
2. SECURE THE BASICS: Priorities are Rent, Utilities, and Food. Everything else waits.
3. SHAME INTERRUPTION: Remind yourself: \"I am employable; the environment was the mismatch.\"

Read Full Analysis: https://sor7ed.com/blog/Job-Loss-Firing
— SOR7ED""",

    "GAMING": """🎮 GAMING: The Flow State

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Games provide the clear rules and instant feedback that the real world lacks, making them highly addictive.
⚡ **The Neuro-Shift:** Use gaming as a tool for regulation, not just escape.

🛠️ **THE PROTOCOL:**
1. TIME BOXING: Set an external alarm outside of your gaming chair.
2. TRANSITION RITUAL: Wash your face or walk for 5 mins after a session.
3. FEED THE FLOW: Use the focus you gain in games to tackle one small real-world task.

Read Full Analysis: https://sor7ed.com/blog/Dopamine-Menu
— SOR7ED""",

    "DIAGNOSIS": """📝 DIAGNOSIS: Post-Validation Grief

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Receiving a diagnosis brings relief, but also massive grief for the \"unsupported\" version of you.
⚡ **The Neuro-Shift:** You aren't getting a label; you are getting a manual.

🛠️ **THE PROTOCOL:**
1. THE GRIEF WINDOW: Allow yourself to be angry/sad about the years you spent masking.
2. DATA GATHERING: Focus on learning your specific \"Spiky Profile.\"
3. UNMASKING: Start dropping the traits that were purely for other people's comfort.

Read Full Analysis: https://sor7ed.com/blog/Unmasking-Depression
— SOR7ED""",

    "MONEY": """💰 MONEY: Impulse & Arrears

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Spending gives a quick dopamine hit, especially when the \"real\" consequences feel distant.
⚡ **The Neuro-Shift:** Finance is executive function, not morality.

🛠️ **THE PROTOCOL:**
1. THE BILLS ACCOUNT: Automatically move rent/bills to a separate account on payday.
2. THE 24-HOUR CART: Leave any online purchase in the cart for 24 hours.
3. DEBT CHARITY: If you are in arrears, contact StepChange today.

Read Full Analysis: https://sor7ed.com/blog/The-Debt-Spiral
— SOR7ED""",

    "ADHD": """🧠 ADHD: The Interest System

Hey! Ready to resolve this.

📌 **The Hidden Friction:** The ADHD brain is an \"Interest-Based\" nervous system, not an \"Importance-Based\" one.
⚡ **The Neuro-Shift:** You can't \"try harder\"; you have to make the task interesting.

🛠️ **THE PROTOCOL:**
1. GAMIFICATION: Add a challenge or timer to boring tasks.
2. NOVELTY: Change your environment (work from a café or the library).
3. URGENCY: Use a timer to create a mini-deadline.

Read Full Analysis: https://sor7ed.com/blog/Fast-Brain-Slow-System
— SOR7ED""",

    "PORN": """🔞 PORN: The Dopamine Trap

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Porn is a \"Super-Stimulus\" that flood-loads dopamine, making the real world feel dull and gray.
⚡ **The Neuro-Shift:** You are dissociated and seeking safety in a dopamine flood.

🛠️ **THE PROTOCOL:**
1. THE WAKE-UP: Use ice-cold water on your face to break the trance.
2. TECHNICAL BARRIERS: Install app blockers for 10 PM.
3. DEVICE BOUNDARY: Charge your phone outside the bedroom.

Read Full Analysis: https://sor7ed.com/blog/Dopamine-and-Dissociation
— SOR7ED""",

    "THOUGHTS": """💭 THOUGHTS: Intrusive & Dark

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Intrusive thoughts are your brain's \"spam filter\" malfunctioning. They aren't your desires.
⚡ **The Neuro-Shift:** Thoughts are just electricity. You don't have to keep them.

🛠️ **THE PROTOCOL:**
1. NAME IT: \"That's an intrusive thought. It's not me.\"
2. DON'T ENGAGE: Do not try to argue with the thought; let it drift by.
3. GROUNDING: Move your body to focus on sensory input.

Read Full Analysis: https://sor7ed.com/blog/Intrusive-Thoughts
— SOR7ED""",

    "EXECUTIVE": """⚙️ EXECUTIVE: The Gears of Tasking

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Executive dysfunction feels like your brain's transmission is slipping. The engine is revving, but the gears aren't catching.
⚡ **The Neuro-Shift:** You aren't lazy; you have a starting motor issue.

🛠️ **THE PROTOCOL:**
1. THE 1-MINUTE RULE: If it takes less than 60 seconds, do it now.
2. BODY DOUBLING: Open a video call with a friend while you do chores.
3. AUTOMATION: Use recurring reminders for everything (even showering/eating).

Read Full Analysis: https://sor7ed.com/blog/Capacity-Loss
— SOR7ED""",

    "INTIMACY": """🕯️ INTIMACY: Sensory Safety

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Intimacy is a high-sensory environment. Smells, textures, and sounds can suddenly go from \"good\" to \"painful.\"
⚡ **The Neuro-Shift:** You are allowed to be \"touched out.\" It's not rejection.

🛠️ **THE PROTOCOL:**
1. SENSORY CHECK-IN: Use non-verbal signals (Green/Yellow/Red) for touch.
2. ENVIRONMENT DESIGN: Dim the lights and remove scratchy blankets/clothes.
3. RECOVERY: Plan for solitude after a high-intimacy session to decompress.

Read Full Analysis: https://sor7ed.com/blog/Masking-in-Intimacy
— SOR7ED""",

    "ESCAPE": """🚪 ESCAPE: Dissociation Defense

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Dissociation is your brain's way of \"unplugging\" when the world feels too dangerous to process.
⚡ **The Neuro-Shift:** You aren't disappearing; you are protecting your system.

🛠️ **THE PROTOCOL:**
1. THE COLD RESET: Put an ice pack on your chest to bring you back to the body.
2. THE 5-4-3-2-1 TECHNIQUE: List things you see, touch, hear, smell, and taste.
3. THE SAFETY ANCHOR: Carry a fidget or textured object in your pocket.

Read Full Analysis: https://sor7ed.com/blog/Dopamine-and-Dissociation
— SOR7ED""",

    "MEDS": """💊 MEDS: Timing & Interaction

Hey! Ready to resolve this.

📌 **The Hidden Friction:** Medications significantly change your dopamine baseline, making the \"crash\" period high-risk.
⚡ **The Neuro-Shift:** Your meds are a tool, not a cure. They require maintenance.

🛠️ **THE PROTOCOL:**
1. PROTEIN BREAKFAST: Eat protein before taking stimulants to stabilize the release.
2. THE CRASH WINDOW: Schedule low-demand tasks for when your meds wear off.
3. HYDRATION: Drink 2L of water a day. Meds dehydrate the system.

Read Full Analysis: https://sor7ed.com/blog/Alcohol-and-Meds
— SOR7ED""",

    "FRIENDS": """👯 FRIENDS: Social Energy Burnout

Hey! Ready to resolve this.

📌 **The Hidden Friction:** \"Socializing\" often feels like hosting a performance for 4 hours while your battery is at 5%.
⚡ **The Neuro-Shift:** Low-energy friendship is still friendship.

🛠️ **THE PROTOCOL:**
1. THE PARALLEL PLAY: Ask to hang out in silence (Body doubling).
2. THE GUILT-FREE CANCEL: \"I love you, but my social battery is zero today. Can we reschedule?\"
3. TEXT OVER CALLS: Use asynchronous communication to avoid the pressure of a live call.

Read Full Analysis: https://sor7ed.com/blog/Collective-Friend-Burnout
— SOR7ED""",

    "MELTDOWN": """🌋 MELTDOWN: Emergency Exit

Hey! Ready to resolve this.

📌 **The Hidden Friction:** A meltdown is a complete system overload. Logic is offline. Only safety matters.
⚡ **The Neuro-Shift:** You are in a neurological emergency. Leave the area.

🛠️ **THE PROTOCOL:**
1. THE EXIT: Go to the bathroom, your car, or outside. Now.
2. SENSORY ISOLATION: Noise-canceling headphones + dim lights/darkness.
3. COLD WATER: Splash ice water on your face and wrists.

Read Full Analysis: https://sor7ed.com/blog/Meltdowns-at-Work
— SOR7ED""",

    "RAGE": """🔥 RAGE: Emotional Regulation

Hey! Ready to resolve this.

📌 **The Hidden Friction:** ND rage is often a response to overstimulation or a boundary violation that felt like an attack.
⚡ **The Neuro-Shift:** You aren't \"angry\"; your nervous system is on fire.

🛠️ **THE PROTOCOL:**
1. THE 20-MINUTE PAUSE: Do not speak to anyone until you have cooled down for 20 mins.
2. PHYSICAL RELEASE: Do pushups, sprint, or tear up a phone book (safely).
3. REPAIR SCRIPT: \"I was overwhelmed and I reacted badly. I'm sorry. I need space before we talk.\"

Read Full Analysis: https://sor7ed.com/blog/Rage-Cleaning-and-Repair
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
