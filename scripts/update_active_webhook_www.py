import os
import base64
import json
import urllib.request
import urllib.parse

account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
service_sid = "MG3ddd0839413227ff696e1a4bcc5dc771"

def update_webhook():
    print(f"🚀 Updating Webhook to WWW version for service {service_sid}...")
    
    url = f"https://messaging.twilio.com/v1/Services/{service_sid}"
    
    auth_str = f"{account_sid}:{auth_token}"
    encoded_auth = base64.b64encode(auth_str.encode()).decode()
    
    # Adding the WWW to ensure no redirects
    data = urllib.parse.urlencode({
        'InboundRequestUrl': 'https://www.planetsorted.com/api/bot'
    }).encode()
    
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('Authorization', f'Basic {encoded_auth}')
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode())
            print(f"✅ UPDATED! Service '{res_data['friendly_name']}' now points to:")
            print(f"🔗 {res_data['inbound_request_url']}")
            print("\n🎉 This should eliminate the 307 redirect issue.")
            
    except Exception as e:
        print(f"❌ Update Failed: {e}")

if __name__ == "__main__":
    update_webhook()
