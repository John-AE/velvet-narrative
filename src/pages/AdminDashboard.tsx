/**
 * Admin Dashboard Component
 * 
 * Central hub for blog administrators to:
 * - View all published blog posts with engagement metrics
 * - Access Notion database for content management
 * - Monitor likes and views for each post
 * 
 * Features:
 * - Protected route (requires authentication)
 * - Real-time post statistics display
 * - Direct link to Notion for content editing
 * - Responsive layout for all devices
 * 
 * Authentication:
 * Checks sessionStorage for "admin_authenticated" flag
 * Redirects to login if not authenticated
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, ThumbsUp, Eye } from "lucide-react";
import { fetchPosts, BlogPost } from "@/lib/notionService";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  // All published blog posts with metrics
  const [posts, setPosts] = useState<BlogPost[]>([]);
  // Loading state during data fetch
  const [loading, setLoading] = useState(true);

  // Authentication check and data loading on mount
  useEffect(() => {
    // Verify admin is authenticated before showing dashboard
    const isAuthenticated = sessionStorage.getItem("admin_authenticated");
    if (!isAuthenticated) {
      toast.error("Please login first");
      navigate("/admin");
      return;
    }
    loadPosts();
  }, [navigate]);

  /**
   * Fetches all published blog posts from Notion
   * Shows error toast if fetch fails
   */
  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs out the admin user
   * Clears authentication flag and redirects to login
   */
  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    toast.success("Logged out");
    navigate("/admin");
  };

  /**
   * Opens the Notion database in a new tab
   * This is where admins create and edit blog posts
   */
  const openNotion = () => {
    window.open("https://www.notion.so/johnamaka/Database-Table-27f5658a7386806f8951c9c109a2754c", "_blank");
  };

  /**
   * Formats date string to readable format
   * @param dateString - ISO date string
   * @returns Formatted date (e.g., "Jan 15, 2024")
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Site
            </Button>
            <h1 className="text-2xl font-bold font-playfair">London Labels Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <Card className="p-6 mb-8 border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Product Catalog Inventory</h2>
              <p className="text-muted-foreground">
                Manage your switch & socket prices and details directly in Notion
              </p>
            </div>
            <Button onClick={openNotion} className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Open in Notion
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground mb-4">No published products yet</p>
              <Button onClick={openNotion} variant="outline">
                Create Your First Product
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const formattedPrice = typeof post.price === 'number'
                  ? `₦${post.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                  : (post.price ? (post.price.toString().startsWith('₦') ? post.price : `₦${post.price}`) : 'Price on Request');
                return (
                  <Card key={post.id} className="p-6 hover:shadow-lg transition-smooth border border-border">
                    <div className="flex gap-6">
                      {post.image ? (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground border border-border">
                          No Image
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
                              {post.category || "Uncategorized"}
                            </span>
                            <h3 className="text-xl font-bold mb-1">{post.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Brand: <strong className="text-foreground">{post.brand}</strong> {post.date && `• Added: ${formatDate(post.date)}`}
                            </p>
                          </div>
                          <span className="text-lg font-bold text-accent">
                            {formattedPrice}
                          </span>
                        </div>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ThumbsUp className="w-4 h-4 text-accent" />
                            <span className="font-semibold text-foreground">{post.likes}</span>
                            <span>likes</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Eye className="w-4 h-4" />
                            <span className="font-semibold text-foreground">{post.views}</span>
                            <span>views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-6 border border-border bg-secondary/20">
          <h2 className="text-xl font-bold mb-4 font-playfair">Inventory Management Quick Guide</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>• <strong>Adding Products:</strong> Insert a new row in your linked Notion database table.</li>
            <li>• <strong>Price Column:</strong> Add a column named <strong>Price</strong> in Notion. You can use type <code>Number</code> (e.g. <code>12500</code>) or <code>Text</code> (e.g. <code>₦12,500</code>).</li>
            <li>• <strong>Brand Column:</strong> Add a column named <strong>Brand</strong> (Text) in Notion. If empty, it defaults to <strong>EuroLite</strong>.</li>
            <li>• <strong>Status Sync:</strong> Set the Status of a product to <strong>Published</strong> to display it live on the site.</li>
            <li>• <strong>Featured Image:</strong> Upload or paste image links in Notion's <strong>Featured Image</strong> column to show product photos.</li>
          </ul>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;