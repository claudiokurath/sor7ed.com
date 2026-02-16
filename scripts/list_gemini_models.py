import os
import json
import urllib.request

GEMINI_KEY = os.environ.get('GEMINI_API_KEY')

def list_models():
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={GEMINI_KEY}"
    req = urllib.request.Request(url, method='GET')
    try:
        with urllib.request.urlopen(req) as f:
            res = json.loads(f.read().decode())
            for model in res.get('models', []):
                print(f"- {model['name']}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    list_models()
