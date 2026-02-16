import os
import base64
import json
import urllib.request
import urllib.parse

account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
service_sid = os.environ.get('TWILIO_MESSAGING_SERVICE_SID')
target_number = "+447360277713"

def twilio_api(url, method='GET', data=None):
    auth_str = f"{account_sid}:{auth_token}"
    encoded_auth = base64.b64encode(auth_str.encode()).decode()
    
    body = None
    if data:
        body = urllib.parse.urlencode(data).encode()
        
    req = urllib.request.Request(url, data=body, method=method)
    req.add_header('Authorization', f'Basic {encoded_auth}')
    if data:
        req.add_header('Content-Type', 'application/x-www-form-urlencoded')
        
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        return {"error": str(e)}

def link_number():
    print(f"🔍 Searching for SID of {target_number}...")
    # 1. List Incoming Phone Numbers
    nums = twilio_api(f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/IncomingPhoneNumbers.json")
    
    pn_sid = None
    if "incoming_phone_numbers" in nums:
        for n in nums['incoming_phone_numbers']:
            if n['phone_number'].replace(" ", "") == target_number:
                pn_sid = n['sid']
                print(f"✅ Found Phone Number SID: {pn_sid}")
                break
    
    if not pn_sid:
        print("❌ Could not find that number on your account. Are you using the Sandbox?")
        return

    # 2. Add to Messaging Service
    print(f"⚙️  Linking {pn_sid} to Service {service_sid}...")
    link_res = twilio_api(
        f"https://messaging.twilio.com/v1/Services/{service_sid}/PhoneNumbers",
        method='POST',
        data={'PhoneNumberSid': pn_sid}
    )
    
    if "error" in link_res:
        print(f"❌ Linking Failed: {link_res['error']}")
    else:
        print("🎉 SUCCESS! The number is now linked to the Messaging Service.")
        print("🚀 Your bot is now LIVE on +44 7360 277713.")

if __name__ == "__main__":
    link_number()
