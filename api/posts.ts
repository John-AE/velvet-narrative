/**
 * Notion Blog Posts API Endpoint
 * 
 * Serverless function that fetches published blog posts from Notion database.
 * Deployed to Vercel and called by the frontend via /api/posts.
 * 
 * Environment Variables Required:
 * - NOTION_API_KEY: Notion integration secret key
 * - NOTION_DATABASE_ID: ID of the Notion database containing blog posts
 * 
   * Notion Database Schema:
   * - Title (title): Post title
   * - Excerpt (rich_text): Short description
   * - Content (rich_text): Full article content
   * - Featured Image (files): Hero image for post
   * - Category (rich_text): Post category
   * - Author (rich_text): Author name
   * - Date (date): Publication date
   * - External URL (url): Link to full article (optional)
   * - Likes (number): Like count
   * - Views (number): View count
   * - Status (status): Product availability status
 * 
 * @param req - Vercel request object
 * @param res - Vercel response object
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '@notionhq/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get credentials from environment variables
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;
  
  // Verify environment variables are set
  if (!apiKey || !databaseId) {
    return res.status(500).json({ 
      error: 'Missing environment variables',
      hasKey: !!apiKey,
      hasDb: !!databaseId
    });
  }

  try {
    // Initialize Notion client with API key
    const notion = new Client({ auth: apiKey });
    
    // Query the database for all items
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [{ property: 'Date', direction: 'descending' }], // Newest first
    });

    // Transform Notion response into Product objects
    const posts = response.results.map((page: any) => {
      const props = page.properties;
      
      // Helper function to extract plain text from Notion rich text
      const getPlainText = (richText: any[]) => 
        richText?.map((t: any) => t.plain_text).join('') || '';

      // Extract price from Notion. It can be a number, rich_text, or formula.
      let priceVal: string | number = '';
      if (props.Price) {
        if (props.Price.type === 'number') {
          priceVal = props.Price.number ?? '';
        } else if (props.Price.type === 'rich_text') {
          priceVal = getPlainText(props.Price.rich_text);
        } else if (props.Price.type === 'formula') {
          priceVal = props.Price.formula?.number ?? props.Price.formula?.string ?? '';
        }
      }

      // Extract brand from Notion. Fallback to Author if Brand doesn't exist.
      let brandVal = '';
      if (props.Brand) {
        brandVal = getPlainText(props.Brand.rich_text || []);
      }
      if (!brandVal && props.Author) {
        brandVal = getPlainText(props.Author.rich_text || []);
      }
      if (!brandVal) {
        brandVal = 'EuroLite'; // Default fallback brand
      }
      
      let categoryVal = '';
      if (props.Category) {
        if (props.Category.type === 'rich_text') {
          categoryVal = getPlainText(props.Category.rich_text || []);
        } else if (props.Category.type === 'select') {
          categoryVal = props.Category.select?.name || '';
        }
      }

      return {
        id: page.id,
        title: getPlainText(props.Title?.title || []),
        excerpt: getPlainText(props.Excerpt?.rich_text || []),
        content: getPlainText(props.Content?.rich_text || []),
        image: props['Featured Image']?.files?.[0]?.file?.url || 
               props['Featured Image']?.files?.[0]?.external?.url || '',
        category: categoryVal,
        brand: brandVal,
        author: brandVal, // Keep compatibility for potential frontend references
        date: props.Date?.date?.start || '',
        externalUrl: props['External URL']?.url || '',
        likes: props.Likes?.number || 0,
        views: props.Views?.number || 0,
        price: priceVal,
        status: props.Status?.status?.name || '',
      };
    });

    return res.status(200).json(posts);
  } catch (error: any) {
    // Log full error for debugging but send sanitized error to client
    console.error('Full error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch posts', 
      message: error?.message,
      code: error?.code
    });
  }
}