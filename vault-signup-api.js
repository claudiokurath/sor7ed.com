// API endpoint: /api/vault-signup.js
// Purpose: Create new user in Notion CRM when they sign up for The Vault

const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

const CRM_DATABASE_ID = '2e90d6014acc80c0b603ffa9e74f7f7d';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source = 'Vault Signup' } = req.body;

  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    // Check if user already exists
    const existingUsers = await notion.databases.query({
      database_id: CRM_DATABASE_ID,
      filter: {
        property: 'Email',
        email: {
          equals: email
        }
      }
    });

    if (existingUsers.results.length > 0) {
      // User exists - just return success
      return res.status(200).json({
        success: true,
        message: 'Account found',
        userId: existingUsers.results[0].id
      });
    }

    // Create new user in CRM
    const newUser = await notion.pages.create({
      parent: {
        database_id: CRM_DATABASE_ID
      },
      properties: {
        'Customer Name': {
          title: [
            {
              text: {
                content: email.split('@')[0] // Use email prefix as name
              }
            }
          ]
        },
        'Email': {
          email: email
        },
        'Status': {
          select: {
            name: 'Trial'
          }
        },
        'Lead Source': {
          select: {
            name: source
          }
        },
        'Signup Date': {
          date: {
            start: new Date().toISOString().split('T')[0]
          }
        },
        'Join Date': {
          date: {
            start: new Date().toISOString().split('T')[0]
          }
        },
        'Credits Balance': {
          number: 0
        },
        'Free Tools Used': {
          number: 0
        },
        'Tools Delivered': {
          number: 0
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      userId: newUser.id
    });

  } catch (error) {
    console.error('Notion API Error:', error);
    return res.status(500).json({
      error: 'Failed to create account',
      details: error.message
    });
  }
}
