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

def list_services():
    print("🕵️  Listing all Messaging Services...")
    services = twilio_api("https://messaging.twilio.com/v1/Services")
    if "services" in services:
        for s in services['services']:
            print(f"- {s['friendly_name']} ({s['sid']}) -> {s['inbound_request_url']}")
    else:
        print(f"Error: {services}")

if __name__ == "__main__":
    list_services()
