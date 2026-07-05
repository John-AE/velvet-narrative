import { useState, useEffect } from "react";
import { X, ThumbsUp, Eye, ExternalLink, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateLikes, Product } from "@/lib/notionService";
import { useCart, formatNaira } from "@/context/CartContext";

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: Product | null;
  onLikeUpdate: (postId: string, newLikes: number) => void;
}

export const StoryModal = ({ isOpen, onClose, story, onLikeUpdate }: StoryModalProps) => {
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Sync state when story changes
  useEffect(() => {
    if (story) {
      setLikeCount(story.likes);
      setLiked(false);
    }
  }, [story]);

  if (!story) return null;

  const handleLike = async () => {
    if (!liked) {
      const newLikes = story.likes + 1;
      setLikeCount(newLikes);
      setLiked(true);
      
      await updateLikes(story.id, newLikes);
      onLikeUpdate(story.id, newLikes);
      
      toast.success("Loved this product!");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formattedPrice = typeof story.price === 'number' 
    ? formatNaira(story.price) 
    : (story.price ? (story.price.toString().startsWith('₦') ? story.price.toString() : `₦${story.price}`) : 'Price on request');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0 bg-card border border-border">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full p-2 bg-card/85 backdrop-blur-sm hover:bg-card border border-border transition-smooth"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        <ScrollArea className="h-full">
          <article className="pb-8">
            {story.image && (
              <div className="relative w-full h-[45vh] overflow-hidden bg-muted">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
                <div className="absolute bottom-6 left-8 right-8">
                  <span className="inline-block px-4 py-1.5 bg-accent text-accent-foreground text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
                    {story.category || "Uncategorized"}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2 font-playfair">
                    {story.title}
                  </h1>
                  <div className="flex items-center gap-4 text-muted-foreground text-sm font-semibold">
                    <span className="text-accent uppercase">{story.brand}</span>
                    {story.date && (
                      <>
                        <span>•</span>
                        <span>Added: {formatDate(story.date)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 md:px-12 py-8 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/80">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-extrabold text-accent">
                    {formattedPrice}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase border border-border px-2.5 py-1 rounded">
                    In Stock
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => addToCart(story)}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 px-6"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>

                  <button
                    onClick={handleLike}
                    className={`flex items-center justify-center p-2.5 rounded-full transition-smooth border border-border ${
                      liked 
                        ? "bg-accent/20 text-accent border-accent/30" 
                        : "bg-card hover:bg-accent/10"
                    }`}
                    aria-label="Like product"
                  >
                    <ThumbsUp className={`w-5 h-5 ${liked ? "fill-current text-accent" : "text-muted-foreground"}`} />
                  </button>
                  
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm pl-2">
                    <Eye className="w-4 h-4" />
                    <span>{story.views} views</span>
                  </div>
                </div>
              </div>

              <div className="prose dark:prose-invert prose-lg max-w-none mb-8 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                <h3 className="text-xl font-bold text-foreground mb-4 font-playfair">Product Specifications & Details</h3>
                {story.content || "No specifications loaded."}
              </div>

              {story.externalUrl && (
                <div className="flex justify-center pt-6 border-t border-border/60">
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={() => window.open(story.externalUrl, "_blank")}
                  >
                    View Original Listing
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </article>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
