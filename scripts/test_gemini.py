import os
import json
import urllib.request
import sys

GEMINI_KEY = os.environ.get('GEMINI_API_KEY')

def test_gemini():
    # Try v1 instead of v1beta
    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={GEMINI_KEY}"
    data = {
        "contents": [{
            "parts": [{"text": "Hello, keeping it brief. Say 'OK' if you hear me."}]
        }]
    }
    req = urllib.request.Request(url, method='POST')
    req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req, data=json.dumps(data).encode()) as f:
            res = json.loads(f.read().decode())
            print(f"✅ Gemini Response: {res['candidates'][0]['content']['parts'][0]['text']}")
    except Exception as e:
        if hasattr(e, 'read'):
            print(f"❌ Gemini Error Support: {e.read().decode()}")
        print(f"❌ Gemini Error: {e}")

if __name__ == "__main__":
    test_gemini()
