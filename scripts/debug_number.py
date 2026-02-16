import os
import base64
import json
import urllib.request

account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
pn_sid = "PN81096116a1348320d0ad9ba62434add7"

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

def debug_number():
    print(f"🕵️  Debugging Phone Number {pn_sid}...")
    n = twilio_api(f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/IncomingPhoneNumbers/{pn_sid}.json")
    print(json.dumps(n, indent=2))

if __name__ == "__main__":
    debug_number()
