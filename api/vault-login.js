import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

const CRM_DATABASE_ID = '2e90d6014acc80c0b603ffa9e74f7f7d';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    const users = await notion.databases.query({
      database_id: CRM_DATABASE_ID,
      filter: {
        property: 'Email',
        email: { equals: email }
      }
    });

    if (users.results.length === 0) {
      return res.status(404).json({
        error: 'No account found',
        suggestion: 'Try signing up first'
      });
    }

    const user = users.results[0];

    await notion.pages.update({
      page_id: user.id,
      properties: {
        'Last Active': {
          date: { start: new Date().toISOString().split('T')[0] }
        }
      }
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: email,
        name: user.properties['Customer Name']?.title?.[0]?.text?.content || 'User',
        status: user.properties['Status']?.select?.name || 'Trial',
        creditsBalance: user.properties['Credits Balance']?.number || 0
      }
    });

  } catch (error) {
    console.error('Notion Error:', error);
    return res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
}
