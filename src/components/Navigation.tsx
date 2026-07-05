/**
 * Navigation Component
 * 
 * Sticky header navigation that appears on all pages.
 * 
 * Features:
 * - Transparent on hero, solid background when scrolled
 * - Smooth color transitions based on scroll position
 * - Dark mode toggle functionality
 * - Responsive design (mobile menu can be added)
 * - Admin login access button
 * 
 * Styling:
 * - Uses Jost font for nav links (see index.css)
 * - Playfair Display for logo
 * - Bold white text for visibility on hero section
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, Moon, Sun, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";

export const Navigation = () => {
  // Track scroll position to change nav appearance
  const [scrolled, setScrolled] = useState(false);
  // Dark mode toggle state
  const [darkMode, setDarkMode] = useState(false);
  // Cart state
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Listen for scroll events to change navigation appearance
  useEffect(() => {
    const handleScroll = () => {
      // Add background and shadow when scrolled past 20px
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Toggles dark mode by adding/removing 'dark' class on html element
   * Tailwind CSS handles the theme switching via dark: variants
   */
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-elegant border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className={`text-2xl font-bold font-playfair tracking-wide ${scrolled ? "text-foreground" : "text-white"}`}>
          London Labels
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <a href="#home" className={`font-bold transition-smooth ${scrolled ? "text-foreground hover:text-accent" : "text-white hover:text-white/80"}`}>
              Home
            </a>
            <a href="#collection" className={`font-bold transition-smooth ${scrolled ? "text-foreground hover:text-accent" : "text-white hover:text-white/80"}`}>
              Collection
            </a>
            <a href="#about" className={`font-bold transition-smooth ${scrolled ? "text-foreground hover:text-accent" : "text-white hover:text-white/80"}`}>
              About
            </a>
            <a href="#contact" className={`font-bold transition-smooth ${scrolled ? "text-foreground hover:text-accent" : "text-white hover:text-white/80"}`}>
              Contact
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`p-2 rounded-lg hover:bg-accent/10 transition-smooth relative ${scrolled ? "text-foreground" : "text-white"}`}
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg hover:bg-accent/10 transition-smooth ${scrolled ? "text-foreground" : "text-white"}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link to="/admin">
              <Button variant="default" className="gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};