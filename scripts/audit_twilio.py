import os
import base64
import json
import urllib.request

# Credentials from .env (hardcoded for EPERM bypass)
account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
service_sid = os.environ.get('TWILIO_MESSAGING_SERVICE_SID')

def twilio_api(url, method='GET'):
    auth_str = f"{account_sid}:{auth_token}"
    encoded_auth = base64.b64encode(auth_str.encode()).decode()
    req = urllib.request.Request(url, method=method)
    req.add_header('Authorization', f'Basic {encoded_auth}')
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        return {"error": str(e)}

def audit_setup():
    print(f"🕵️  Auditing Twilio Configuration for Service: {service_sid}...")
    
    # 1. Check Service Config
    service = twilio_api(f"https://messaging.twilio.com/v1/Services/{service_sid}")
    print("\n--- 1. Messaging Service Configuration ---")
    if "error" in service:
        print(f"❌ Error fetching service: {service['error']}")
    else:
        print(f"✅ Friendly Name: {service['friendly_name']}")
        print(f"🔗 Webhook URL: {service['inbound_request_url']}")
        if service['inbound_request_url'] == "https://planetsorted.com/api/bot":
            print("🚀 Webhook is CORRECTLY set to planetsorted.com")
        else:
            print(f"⚠️ Webhook mismatch! Found: {service['inbound_request_url']}")

    # 2. Check Senders
    senders = twilio_api(f"https://messaging.twilio.com/v1/Services/{service_sid}/PhoneNumbers")
    print("\n--- 2. Sender Pool (WhatsApp/Mobile Numbers) ---")
    if "error" in senders:
         print(f"❌ Error fetching senders: {senders['error']}")
    elif not senders.get('phone_numbers'):
        print("⚠️  CRITICAL: No numbers found in the Sender Pool. The bot will NOT react yet.")
    else:
        for num in senders['phone_numbers']:
            print(f"✅ Number Found: {num['phone_number']} (SID: {num['sid']})")
            if "+447360277713" in num['phone_number'].replace(" ", ""):
                print("✨ Primary SOR7ED number is correctly linked!")

    # 3. Check Account Balance / Status (Basic check)
    print("\n--- 3. System Health ---")
    account = twilio_api(f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}.json")
    if "error" in account:
        print("❌ Could not verify Account Status")
    else:
        print(f"✅ Account Status: {account['status'].upper()}")

if __name__ == "__main__":
    audit_setup()
