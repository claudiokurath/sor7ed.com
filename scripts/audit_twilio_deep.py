import os
import base64
import json
import urllib.request

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
    print(f"🕵️  Deep Audit for Service: {service_sid}...")
    
    # 1. Service Config
    service = twilio_api(f"https://messaging.twilio.com/v1/Services/{service_sid}")
    print("\n--- 1. Messaging Service ---")
    print(f"✅ Friendly Name: {service.get('friendly_name')}")
    print(f"🔗 Webhook: {service.get('inbound_request_url')}")

    # 2. Phone Number Senders
    numbers = twilio_api(f"https://messaging.twilio.com/v1/Services/{service_sid}/PhoneNumbers")
    # 3. Channel Senders (WhatsApp)
    channels = twilio_api(f"https://messaging.twilio.com/v1/Services/{service_sid}/ChannelSenders")

    any_sender = False
    print("\n--- 2. Sender Pool ---")
    
    if numbers.get('phone_numbers'):
        for n in numbers['phone_numbers']:
            print(f"📱 Phone Number: {n['phone_number']}")
            any_sender = True
            
    if channels.get('channel_senders'):
        for c in channels['channel_senders']:
            print(f"💬 WhatsApp/Channel: {c['proxy_address']} ({c['sid']})")
            any_sender = True

    if not any_sender:
        print("⚠️  NO SENDERS DETECTED. The service has no workers.")
    else:
        print("🚀 Senders are detection. Ready to route.")

if __name__ == "__main__":
    audit_setup()
