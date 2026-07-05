/**
 * Update Likes API Endpoint
 * 
 * Serverless function that updates the like count for a blog post in Notion.
 * Called when a user clicks the like button on a post.
 * 
 * Environment Variables Required:
 * - NOTION_API_KEY: Notion integration secret key
 * 
 * Request Body:
 * - postId: Notion page ID of the post to update
 * - likes: New like count to set
 * 
 * @param req - Vercel request object
 * @param res - Vercel response object
 */

import { Client } from '@notionhq/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Notion client with API key from environment
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { postId, likes } = req.body;

    // Update the Likes property in Notion
    await notion.pages.update({
      page_id: postId,
      properties: {
        Likes: { number: likes }, // Set new like count
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update likes' });
  }
}