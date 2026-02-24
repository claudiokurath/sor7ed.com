const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

const CRM_DATABASE_ID = '2e90d6014acc80c0b603ffa9e74f7f7d';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source = 'Vault Signup' } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    const existingUsers = await notion.databases.query({
      database_id: CRM_DATABASE_ID,
      filter: {
        property: 'Email',
        email: { equals: email }
      }
    });

    if (existingUsers.results.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Account found',
        userId: existingUsers.results[0].id
      });
    }

    const newUser = await notion.pages.create({
      parent: { database_id: CRM_DATABASE_ID },
      properties: {
        'Customer Name': {
          title: [{ text: { content: email.split('@')[0] } }]
        },
        'Email': { email: email },
        'Status': { select: { name: 'Trial' } },
        'Lead Source': { select: { name: source } },
        'Signup Date': {
          date: { start: new Date().toISOString().split('T')[0] }
        },
        'Join Date': {
          date: { start: new Date().toISOString().split('T')[0] }
        },
        'Credits Balance': { number: 0 },
        'Free Tools Used': { number: 0 },
        'Tools Delivered': { number: 0 }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Account created',
      userId: newUser.id
    });

  } catch (error) {
    console.error('Notion Error:', error);
    return res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
};
