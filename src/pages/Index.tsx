/**
 * Main Landing Page Component
 * 
 * This is the home page of the blog that displays:
 * - Hero section with elegant typography and call-to-action
 * - Grid of blog post cards fetched from Notion database
 * - Modal for reading full articles with likes/views tracking
 * 
 * Features:
 * - Fetches blog posts from Notion API on mount
 * - Tracks article views with Firebase Analytics
 * - Increments view count when posts are opened
 * - Responsive design for mobile, tablet, and desktop
 */

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { StoryCard } from "@/components/StoryCard";
import { StoryModal } from "@/components/StoryModal";
import { Button } from "@/components/ui/button";
import { ChevronDown, MapPin, Mail, Phone, ShieldCheck, Cpu } from "lucide-react";
import { fetchPosts, updateViews, Product } from "@/lib/notionService";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

const Index = () => {
  // State for storing fetched products
  const [products, setProducts] = useState<Product[]>([]);
  // Currently selected product for modal display
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // Modal open/close state
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Loading state while fetching products
  const [loading, setLoading] = useState(true);

  // Fetch products when component mounts
  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * Loads all published products from Notion database
   * Shows error toast if fetch fails
   */
  const loadProducts = async () => {
    try {
      const data = await fetchPosts();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load product collection");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Opens a product in modal view
   * - Tracks the view event with Firebase Analytics
   * - Increments view count in Notion database
   * - Updates local state to reflect new view count
   * 
   * @param product - The product to open
   */
  const openProduct = async (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    
    // Track with Firebase Analytics for user behavior insights
    if (analytics) {
      logEvent(analytics, 'view_item', {
        item_id: product.id,
        item_name: product.title,
        item_category: product.category
      });
    }
    
    // Increment views in Notion database
    const newViews = product.views + 1;
    await updateViews(product.id, newViews);
    
    // Update local state to show new view count immediately
    setProducts(prev => 
      prev.map(p => p.id === product.id ? { ...p, views: newViews } : p)
    );
  };

  /**
   * Closes the product modal
   * Delays clearing selected product to allow exit animation
   */
  const closeProduct = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section - Shortened to show product grid above the fold */}
      <section
        id="home"
        className="relative min-h-[70vh] lg:min-h-[75vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-hero-bg/90 via-hero-bg/85 to-background" />
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
          <span className="text-accent text-sm font-bold uppercase tracking-widest mb-4 inline-block">
            Premium EuroLite Socket & Switches Display
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-playfair">
            London Labels
          </h1>
          
          <p className="text-lg md:text-xl text-hero-text/90 mb-8 max-w-3xl mx-auto leading-relaxed font-['Jost',sans-serif]">
            Exquisite finishes, luxury switches, and refined brass hardware. 
            Tailoring elegant socket plates and premium switches for sophisticated interiors.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold"
              onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Collection
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Request Quote
            </Button>
          </div>
        </div>

        <button
          onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-hero-text/60 hover:text-hero-text transition-smooth animate-bounce"
          aria-label="Scroll to collection"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      {/* Collection Section */}
      <section id="collection" className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">Our Display Collection</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Browse our premium range of switches and sockets, available in antique brass, polished chrome, satin copper, and matt finishes.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1.5 border border-border text-xs rounded-full bg-card font-semibold text-muted-foreground uppercase">
                Direct Sync with Notion
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Loading collection from database...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
              <p className="text-muted-foreground text-lg mb-2">No products found in the collection.</p>
              <p className="text-sm text-muted-foreground/75">Ensure they are marked as "Published" in your Notion database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <StoryCard
                  key={product.id}
                  {...product}
                  onClick={() => openProduct(product)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-secondary/35 border-t border-b border-border/40">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent mb-2 inline-block">Craftsmanship & Display</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair text-foreground">Why EuroLite Sockets & Switches?</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                At London Labels, we showcase premium EuroLite switches and sockets that elevate electrical hardware to design statement pieces. Our selections boast superior mechanical integrity, solid metal plates, and smooth toggle operations.
              </p>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="p-2 rounded bg-accent/10 text-accent mt-1">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Certified Standards</h4>
                    <p className="text-sm text-muted-foreground">Tested and certified to international safety requirements for full peace of mind.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-2 rounded bg-accent/10 text-accent mt-1">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Sophisticated Finishes</h4>
                    <p className="text-sm text-muted-foreground">Available in Antique Brass, Satin Brass, Chrome, Copper, Matt Black, and Primed for custom painting.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-8 rounded-xl border border-border shadow-elegant flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
              <h3 className="text-2xl font-bold mb-4 font-playfair text-foreground">Bespoke Design Consultant</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Need a specific configuration of switches, sockets, dimmers, or grid combinations? We display bespoke plate options to match any residential project scale. Add items to your cart and request an inquiry for customized plate configuration.
              </p>
              <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg text-accent text-sm font-semibold flex items-center justify-between">
                <span>Select from Notion database</span>
                <span className="text-xs uppercase bg-accent text-accent-foreground px-2 py-0.5 rounded font-bold">LIVE SYNC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-accent mb-2 inline-block">Order Inquiries</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair">Get in Touch with London Labels</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            Have questions about EuroLite products, finishes, or custom orders? Contact our sales office or send your inquiry by adding items to the cart and submitting.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-card rounded-lg border border-border flex flex-col items-center text-center">
              <Mail className="w-8 h-8 text-accent mb-4" />
              <h4 className="font-bold mb-2">Email Inquiry</h4>
              <p className="text-sm text-accent font-semibold truncate w-full">sales@londonlabels.com</p>
              <p className="text-xs text-muted-foreground mt-1">Checked daily for quotes</p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border flex flex-col items-center text-center">
              <Phone className="w-8 h-8 text-accent mb-4" />
              <h4 className="font-bold mb-2">WhatsApp / Phone</h4>
              <p className="text-sm text-accent font-semibold">+234 803 000 0000</p>
              <p className="text-xs text-muted-foreground mt-1">Mon-Fri, 9:00 AM - 5:00 PM</p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border flex flex-col items-center text-center">
              <MapPin className="w-8 h-8 text-accent mb-4" />
              <h4 className="font-bold mb-2">Showroom Location</h4>
              <p className="text-sm text-muted-foreground">Lagos / London Displays</p>
              <p className="text-xs text-muted-foreground mt-1">By appointment only</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border/80 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-6">
          <p>© {new Date().getFullYear()} London Labels. All rights reserved. Specializing in EuroLite Sockets and Switches.</p>
        </div>
      </footer>

      {/* Product Modal */}
      <StoryModal
        isOpen={isModalOpen}
        onClose={closeProduct}
        story={selectedProduct}
        onLikeUpdate={(postId, newLikes) => {
          setProducts(prev => 
            prev.map(p => p.id === postId ? { ...p, likes: newLikes } : p)
          );
        }}
      />
    </div>
  );
};

export default Index;
