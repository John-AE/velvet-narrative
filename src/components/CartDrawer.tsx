import { useState } from "react";
import { X, Trash2, Plus, Minus, Send, Mail, FileText, ShoppingBag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart, parsePrice, formatNaira } from "@/context/CartContext";
import { toast } from "sonner";

// Owner configuration
const ADMIN_EMAIL = "sales@londonlabels.com";
const ADMIN_WHATSAPP_NUMBER = "2348030000000"; // Replace with owner's number in international format

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { cart, removeFromCart, updateQuantity, cartCount, cartTotal, formattedCartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getOrderSummaryText = () => {
    let summary = `*London Labels - Order Inquiry*\n`;
    summary += `-----------------------------\n`;
    summary += `*Customer Details:*\n`;
    summary += `Name: ${formData.name}\n`;
    summary += `Email: ${formData.email}\n`;
    summary += `Phone: ${formData.phone}\n`;
    summary += `Address: ${formData.address}\n`;
    if (formData.notes) {
      summary += `Notes: ${formData.notes}\n`;
    }
    summary += `\n*Products:*\n`;
    cart.forEach((item, index) => {
      const price = parsePrice(item.product.price);
      summary += `${index + 1}. ${item.product.title} (${item.product.brand})\n`;
      summary += `   Qty: ${item.quantity} x ₦${price.toLocaleString()} = ₦${(price * item.quantity).toLocaleString()}\n`;
    });
    summary += `\n*Grand Total: ${formattedCartTotal}*`;
    return summary;
  };

  const handleWhatsAppCheckout = () => {
    const text = encodeURIComponent(getOrderSummaryText());
    const url = `https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP_NUMBER}&text=${text}`;
    window.open(url, "_blank");
    toast.success("Redirecting to WhatsApp to complete your order!");
    clearCart();
    setIsCheckingOut(false);
    onClose();
  };

  const handleEmailCheckout = () => {
    const subject = encodeURIComponent("London Labels - New Order Inquiry");
    const body = encodeURIComponent(getOrderSummaryText().replace(/\*/g, "")); // Strip markdown asterisks for email
    const mailto = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
    toast.success("Opening your email client to send the inquiry!");
    clearCart();
    setIsCheckingOut(false);
    onClose();
  };

  const handlePrintQuote = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Popup blocked! Please allow popups to print quotes.");
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>London Labels Quote - ${formData.name}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1f2937; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
            .brand { font-size: 28px; font-weight: bold; color: #b45309; text-transform: uppercase; letter-spacing: 0.05em; }
            .title { font-size: 14px; color: #6b7280; font-family: 'Jost', sans-serif; }
            .details { margin: 30px 0; background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #f3f4f6; }
            .details h3 { margin-top: 0; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
            .details p { margin: 8px 0; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
            th { background: #f3f4f6; font-weight: 600; color: #374151; }
            .total { text-align: right; font-size: 20px; font-weight: bold; margin-top: 30px; color: #b45309; }
            .footer { margin-top: 60px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">London Labels</div>
              <div class="title">Premium EuroLite Switches & Sockets Display</div>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-size: 14px; font-weight: bold;">QUOTE INVOICE</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #6b7280;">Date: ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div class="details">
            <h3>Customer & Delivery Details</h3>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            <p><strong>Delivery Address:</strong> ${formData.address}</p>
            ${formData.notes ? `<p><strong>Order Notes:</strong> ${formData.notes}</p>` : ''}
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Product Item</th>
                <th>Brand</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map(item => {
                const price = parsePrice(item.product.price);
                return `
                  <tr>
                    <td><strong>${item.product.title}</strong><br/><span style="font-size: 12px; color: #6b7280;">${item.product.category}</span></td>
                    <td>${item.product.brand}</td>
                    <td style="text-align: right;">₦${price.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;"><strong>₦${(price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          <div class="total">
            Estimated Total: ₦${cartTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}
          </div>
          
          <div class="footer">
            Thank you for requesting a quote from London Labels.<br/>
            Please contact us at ${ADMIN_EMAIL} or WhatsApp: +${ADMIN_WHATSAPP_NUMBER} to finalize payment and dispatch.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
    toast.success("Quote generated and print dialog opened!");
    clearCart();
    setIsCheckingOut(false);
    onClose();
  };

  const handleCheckoutSubmit = (e: React.FormEvent, method: "whatsapp" | "email" | "print") => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error("Please fill in all required customer details.");
      return;
    }

    if (method === "whatsapp") {
      handleWhatsAppCheckout();
    } else if (method === "email") {
      handleEmailCheckout();
    } else if (method === "print") {
      handlePrintQuote();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] p-0 flex flex-col overflow-hidden bg-card border border-border rounded-lg shadow-elegant">
        <DialogHeader className="px-6 py-4 border-b border-border flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-foreground font-playfair">
            <ShoppingBag className="w-6 h-6 text-accent" />
            {isCheckingOut ? "Inquiry Checkout" : "Shopping Cart"}
            <span className="text-sm font-normal text-muted-foreground font-sans">({cartCount} items)</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          {!isCheckingOut ? (
            // Cart Inventory List
            cart.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center gap-4">
                <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
                <p className="text-muted-foreground text-lg">Your cart is empty.</p>
                <Button onClick={onClose} variant="outline" className="mt-2">
                  Browse Switches & Sockets
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 pb-4 border-b border-border/60 last:border-b-0 items-center">
                    {item.product.image && (
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-muted">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-accent font-semibold tracking-wider uppercase">{item.product.brand}</span>
                      <h4 className="text-base font-bold text-foreground truncate">{item.product.title}</h4>
                      <p className="text-sm font-bold text-accent mt-0.5">
                        {typeof item.product.price === "number" ? formatNaira(item.product.price) : item.product.price}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-7 h-7 rounded-full"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </Button>
                      <span className="w-6 text-center font-bold text-sm text-foreground">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-7 h-7 rounded-full"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive w-8 h-8 rounded-full"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <div className="pt-6 border-t border-border flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Subtotal</p>
                    <p className="text-2xl font-bold text-foreground">{formattedCartTotal}</p>
                  </div>
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6"
                    onClick={() => setIsCheckingOut(true)}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            )
          ) : (
            // Checkout Form
            <form className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (with country code) <span className="text-destructive">*</span></Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+234 803 123 4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address <span className="text-destructive">*</span></Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="12 Main Street, Lagos, Nigeria"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Special instructions or requests..."
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-sm font-semibold text-muted-foreground mb-2">Select Submission Method:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    type="button"
                    onClick={(e) => handleCheckoutSubmit(e, "whatsapp")}
                    className="bg-green-600 hover:bg-green-700 text-white gap-2 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                    WhatsApp
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={(e) => handleCheckoutSubmit(e, "email")}
                    className="bg-sky-600 hover:bg-sky-700 text-white gap-2 flex items-center justify-center"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>

                  <Button
                    type="button"
                    onClick={(e) => handleCheckoutSubmit(e, "print")}
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent/10 gap-2 flex items-center justify-center"
                  >
                    <FileText className="w-4 h-4" />
                    Print Quote
                  </Button>
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full mt-2"
                  onClick={() => setIsCheckingOut(false)}
                >
                  Back to Cart
                </Button>
              </div>
            </form>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
