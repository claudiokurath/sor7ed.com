import os
import base64
import json
import urllib.request

account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')

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

def list_channels():
    print("🕵️  Listing WhatsApp/Messaging Channels...")
    # This endpoint is specifically for Messaging Services, but let's check general WhatsApp settings
    # For Sandbox, it's often under Messaging > Try it out > WhatsApp
    sandbox = twilio_api(f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json?PageSize=1")
    print(json.dumps(sandbox, indent=2))

if __name__ == "__main__":
    list_channels()
