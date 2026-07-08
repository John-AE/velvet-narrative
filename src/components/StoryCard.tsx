/**
 * Story Card Component
 * 
 * Displays a preview card for a blog post in the grid layout.
 * 
 * Features:
 * - Hover effects (image zoom, shadow, arrow translation)
 * - Category badge display
 * - Read time indicator
 * - Author and date information
 * - Responsive layout
 * - Clickable to open full post in modal
 * 
 * Design:
 * - Uses luxury shadow effect on hover
 * - Smooth transitions for all interactive elements
 * - 4:3 aspect ratio for featured images
 * - Line-clamp-3 for excerpt (shows max 3 lines)
 */

import { ArrowRight, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart, formatNaira } from "@/context/CartContext";
import { Product } from "@/lib/notionService";

interface StoryCardProps extends Product {
  onClick: () => void;
}

export const StoryCard = (props: StoryCardProps) => {
  const { title, excerpt, image, category, brand, price, status, onClick } = props;
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(props);
  };

  const formattedPrice = typeof price === 'number' 
    ? formatNaira(price) 
    : (price ? (price.toString().startsWith('₦') ? price.toString() : `₦${price}`) : 'Price on request');

  const statusClasses = status === 'Sold Out'
    ? 'bg-destructive text-destructive-foreground'
    : status === 'Almost Sold Out'
      ? 'bg-orange-500 text-white'
      : 'bg-emerald-500 text-white';

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer overflow-hidden border-border hover:shadow-luxury transition-smooth bg-card flex flex-col h-full justify-between"
    >
      <div>
        <div className="relative overflow-hidden aspect-[4/3] bg-muted">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-medium">
              No Image Available
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full uppercase tracking-wider">
              {category || "Uncategorized"}
            </span>
          </div>
          {status && (
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${statusClasses}`}>
                {status}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 pb-2">
          <div className="flex justify-between items-start gap-2 mb-2">
            <span className="text-xs text-accent font-bold uppercase tracking-wider">
              {brand}
            </span>
            <span className="text-sm font-bold text-accent">
              {formattedPrice}
            </span>
          </div>

          <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-smooth line-clamp-1">
            {title}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0 mt-auto">
        <div className="flex items-center gap-3 pt-3 border-t border-border/60">
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 py-5"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
          
          <Button
            size="icon"
            variant="outline"
            className="w-10 h-10 border-border group-hover:border-accent hover:bg-accent/10 transition-smooth"
            onClick={onClick}
          >
            <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-smooth" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
