import os
import re

REPLACEMENTS = {
    os.environ.get('TWILIO_ACCOUNT_SID'): "os.environ.get('TWILIO_ACCOUNT_SID')",
    os.environ.get('TWILIO_AUTH_TOKEN'): "os.environ.get('TWILIO_AUTH_TOKEN')",
    os.environ.get('TWILIO_MESSAGING_SERVICE_SID'): "os.environ.get('TWILIO_MESSAGING_SERVICE_SID')",
    os.environ.get('NOTION_API_KEY'): "os.environ.get('NOTION_API_KEY')",
    os.environ.get('NOTION_API_KEY'): "os.environ.get('NOTION_API_KEY')",
    os.environ.get('NOTION_API_KEY'): "os.environ.get('NOTION_API_KEY')",
    os.environ.get('NOTION_BLOG_DB_ID'): "os.environ.get('NOTION_BLOG_DB_ID')",
    os.environ.get('NOTION_TOOLS_DB_ID'): "os.environ.get('NOTION_TOOLS_DB_ID')",
    os.environ.get('NOTION_CRM_DB_ID'): "os.environ.get('NOTION_CRM_DB_ID')",
    os.environ.get('GEMINI_API_KEY'): "os.environ.get('GEMINI_API_KEY')",
}

# Also handle cases where they are wrapped in quotes
QUOTED_REPLACEMENTS = {f'"{k}"': v for k, v in REPLACEMENTS.items()}
QUOTED_REPLACEMENTS.update({f"'{k}'": v for k, v in REPLACEMENTS.items()})

def sanitize_file(filepath):
    if not filepath.endswith(('.py', '.js', '.ts', '.cjs')):
        return False
        
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = content
    needs_os_import = False
    
    for secret, env_call in QUOTED_REPLACEMENTS.items():
        if secret in new_content:
            new_content = new_content.replace(secret, env_call)
            needs_os_import = True
            
    if new_content != content:
        if filepath.endswith('.py') and "import os" not in new_content:
            new_content = "import os\n" + new_content
            
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"✅ Sanitized: {filepath}")
        return True
    return False

def main():
    scripts_dir = "/Users/claudiokurath/NEXT LEVEL/scripts"
    for filename in os.listdir(scripts_dir):
        sanitize_file(os.path.join(scripts_dir, filename))
    
    # Also check api/
    api_dir = "/Users/claudiokurath/NEXT LEVEL/api"
    for filename in os.listdir(api_dir):
        sanitize_file(os.path.join(api_dir, filename))

if __name__ == "__main__":
    main()
