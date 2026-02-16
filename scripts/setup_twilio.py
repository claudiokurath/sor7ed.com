import os
import base64
import json
import urllib.request
import urllib.parse

# Hardcoded for the script because of EPERM on .env
account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')

def setup_service():
    print("🚀 Initializing Messaging Service (Python)...")
    
    url = "https://messaging.twilio.com/v1/Services"
    
    auth_str = f"{account_sid}:{auth_token}"
    encoded_auth = base64.b64encode(auth_str.encode()).decode()
    
    data = urllib.parse.urlencode({
        'FriendlyName': 'SOR7ED Bot Service',
        'InboundRequestUrl': 'https://planetsorted.com/api/bot',
        'InboundMethod': 'POST'
    }).encode()
    
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('Authorization', f'Basic {encoded_auth}')
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode())
            print(f"✅ Created Messaging Service: {res_data['friendly_name']}")
            print(f"🆔 Service SID: {res_data['sid']}")
            print(f"🔗 Webhook set to: https://planetsorted.com/api/bot")
            
            print("\n--- NEXT STEPS ---")
            print("1. Go to Twilio Console > Messaging > Services")
            print(f"2. Select '{res_data['friendly_name']}'")
            print("3. Go to 'Sender Pool' and click 'Add Senders'")
            print("4. Add your WhatsApp number (+44 7360 277713) to this pool.")
            
    except Exception as e:
        print(f"❌ Setup Failed: {e}")

if __name__ == "__main__":
    setup_service()
