const fs = require('fs');
const path = require('path');

// Manual .env parsing
const envPath = path.join(process.cwd(), '.env');
const envFile = fs.readFileSync(envPath, 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) env[key.trim()] = valueParts.join('=').trim();
});

const accountSid = env.TWILIO_ACCOUNT_SID;
const authToken = env.TWILIO_AUTH_TOKEN;

async function setupMessagingService() {
    try {
        console.log("🚀 Initializing Messaging Service (via Fetch)...");

        const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

        // 1. Create the Service
        const response = await fetch(`https://messaging.twilio.com/v1/Services`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'FriendlyName': 'SOR7ED Bot Service',
                'InboundRequestUrl': 'https://planetsorted.com/api/bot',
                'InboundMethod': 'POST'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || JSON.stringify(data));
        }

        console.log(`✅ Created Messaging Service: ${data.friendly_name}`);
        console.log(`🆔 Service SID: ${data.sid}`);
        console.log(`🔗 Webhook set to: https://planetsorted.com/api/bot`);

        // 2. Add the result to .env
        let newEnv = envFile;
        if (!newEnv.includes('TWILIO_MESSAGING_SERVICE_SID')) {
            newEnv += `\nTWILIO_MESSAGING_SERVICE_SID=${data.sid}\n`;
            fs.writeFileSync(envPath, newEnv);
            console.log("📝 Updated .env with TWILIO_MESSAGING_SERVICE_SID");
        }

        console.log("\n--- NEXT STEPS ---");
        console.log("1. Go to Twilio Console > Messaging > Services");
        console.log(`2. Select '${data.friendly_name}'`);
        console.log("3. Go to 'Sender Pool' and click 'Add Senders'");
        console.log("4. Add your WhatsApp number/Sandbox number to this pool.");

    } catch (error) {
        console.error("❌ Setup Failed:", error.message);
    }
}

setupMessagingService();
