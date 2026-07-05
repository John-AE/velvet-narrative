/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Notion Service Module
 * 
 * Handles all communication with the Notion API via serverless functions.
 * This module fetches blog posts and updates engagement metrics (likes/views).
 * 
 * API Endpoints (in /api folder):
 * - GET /api/posts - Fetches all published posts
 * - POST /api/update-likes - Updates like count for a post
 * - POST /api/update-views - Updates view count for a post
 * 
 * These serverless functions run on Vercel and connect to Notion using
 * environment variables for authentication.
 */

export interface BlogPost {
  id: string;              // Notion page ID
  title: string;           // Product / Post title
  excerpt: string;         // Short description for card preview
  content: string;         // Full specifications / content
  image: string;           // Image URL
  category: string;        // Category (e.g., "Switches", "Sockets")
  author: string;          // Author (fallback brand name)
  brand: string;           // Product Brand (e.g. EuroLite)
  price: string | number;  // Product price (e.g. 15000 or "₦15,000")
  date: string;            // Date added
  externalUrl?: string;    // Optional external link
  likes: number;           // Number of likes
  views: number;           // Number of views
  readTime: string;        // Display metric (can be reused or empty)
}

// Product alias for cleaner e-shop semantics
export type Product = BlogPost;

/**
 * Calculates estimated read time based on content length
 * Assumes average reading speed of 200 words per minute
 * 
 * @param content - The full article content text
 * @returns Formatted read time string (e.g., "5 min read")
 */
const calculateReadTime = (content: string): string => {
  if (!content) return "1 min read";
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

/**
 * Fetches all published products/posts from Notion database
 * 
 * Makes a GET request to the serverless function that queries Notion.
 * Only returns items with Status = "Published" in Notion.
 * 
 * @returns Array of products or empty array if fetch fails
 */
export const fetchPosts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('/api/posts');
    if (!response.ok) throw new Error('Failed to fetch products');
    
    const posts = await response.json();
    
    return posts.map((post: any) => ({
      ...post,
      readTime: calculateReadTime(post.content),
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

/**
 * Updates the like count for a blog post in Notion
 * 
 * Sends the new like count to serverless function which updates Notion.
 * Errors are logged but don't throw to prevent UI disruption.
 * 
 * @param postId - Notion page ID of the post
 * @param newLikes - Updated like count
 */
export const updateLikes = async (postId: string, newLikes: number): Promise<void> => {
  try {
    await fetch('/api/update-likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, likes: newLikes }),
    });
  } catch (error) {
    console.error('Error updating likes:', error);
  }
};

/**
 * Updates the view count for a blog post in Notion
 * 
 * Sends the new view count to serverless function which updates Notion.
 * Errors are logged but don't throw to prevent UI disruption.
 * 
 * @param postId - Notion page ID of the post
 * @param newViews - Updated view count
 */
export const updateViews = async (postId: string, newViews: number): Promise<void> => {
  try {
    await fetch('/api/update-views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, views: newViews }),
    });
  } catch (error) {
    console.error('Error updating views:', error);
  }
};