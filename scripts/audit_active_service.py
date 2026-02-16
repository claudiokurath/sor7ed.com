import os
import base64
import json
import urllib.request

account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
service_sid = "MG3ddd0839413227ff696e1a4bcc5dc771" # The ACTIVE service found in logs

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

def audit_active_service():
    print(f"🕵️  Auditing Active Service: {service_sid}...")
    s = twilio_api(f"https://messaging.twilio.com/v1/Services/{service_sid}")
    print(json.dumps(s, indent=2))

if __name__ == "__main__":
    audit_active_service()
