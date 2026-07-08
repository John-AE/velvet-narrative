# London Labels - Premium EuroLite Switches & Sockets Display

A luxury e-shop for premium **EuroLite Electrical Switches and Sockets**, powered by Notion as a live product database. Built with modern web technologies for exceptional performance and user experience.

## 🌟 Features

### For Shoppers
- **Product Collection**: Browse a curated grid of EuroLite sockets, switches, dimmers, and accessories
- **Premium Product Cards**: View brand, price (₦), and category clearly on every card
- **Product Details Modal**: Full specifications, images, and "Add to Cart" in an overlay view
- **Shopping Cart**: Add multiple items with quantity management, persisted in localStorage
- **Checkout Inquiry**: Submit your order via WhatsApp, Email, or downloadable Print Quote invoice
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Layout**: Optimized for mobile, tablet, and desktop

### For the Owner (Admin)
- **Notion CMS**: Manage all product listings, images, prices, and descriptions directly in Notion
- **Live Sync**: Products marked as "Published" appear instantly on the site
- **Admin Dashboard**: View inventory with live pricing, brand tags, and engagement stats
- **Notion Quick Guide**: Embedded instructions in the dashboard for adding/editing products
- **Analytics**: Track product views using Firebase Analytics

## 🏗️ Architecture

### Frontend Stack
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Premium component library
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching

### Backend Stack
- **Notion API** - Product content management system (CMS)
- **Vercel Functions** - Serverless API endpoints (`/api/posts`, `/api/update-likes`, `/api/update-views`)
- **Firebase Analytics** - User behavior tracking (optional)

## 📂 Project Structure

```
├── api/
│   ├── posts.ts              # Fetch products from Notion
│   ├── update-likes.ts       # Update likes count in Notion
│   └── update-views.ts       # Update view count in Notion
│
├── src/
│   ├── context/
│   │   └── CartContext.tsx   # Shopping cart state management
│   │
│   ├── components/
│   │   ├── CartDrawer.tsx    # Cart panel + checkout form (WhatsApp / Email / Print)
│   │   ├── Navigation.tsx    # Header with cart count badge, dark mode
│   │   ├── StoryCard.tsx     # Product card (price, brand, Add to Cart)
│   │   └── StoryModal.tsx    # Product detail view
│   │
│   ├── lib/
│   │   ├── notionService.ts  # Notion API client + Product interface
│   │   └── firebase.ts       # Firebase Analytics (optional)
│   │
│   └── pages/
│       ├── Index.tsx         # Home page (hero + collection grid + about + contact)
│       ├── Admin.tsx         # Admin login
│       └── AdminDashboard.tsx # Product inventory dashboard
│
└── index.html                # SEO-ready entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Notion account with integration
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
    git clone https://github.com/John-AE/london-labels.git
    cd london-labels
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (create `.env` file):
   ```env
   # Notion Configuration
   NOTION_API_KEY=your_notion_integration_key
   NOTION_DATABASE_ID=your_notion_database_id

   # Admin Authentication
   VITE_ADMIN_EMAIL=admin@example.com
   VITE_ADMIN_PASSWORD=your_secure_password
   ```

4. **Set up Notion Database**

   Create a Notion database with these columns:
   | Property | Type | Description |
   |---|---|---|
   | `Title` | Title | Product name |
   | `Excerpt` | Rich Text | Short product description |
   | `Content` | Rich Text | Full specifications |
   | `Featured Image` | Files | Product image |
   | `Category` | Rich Text | e.g. "Sockets", "Switches" |
   | `Brand` | Rich Text | e.g. "EuroLite" (optional, defaults to EuroLite) |
   | `Price` | Number | e.g. `12500` (in Naira) |
   | `Likes` | Number | Like count (auto-tracked) |
   | `Views` | Number | View count (auto-tracked) |
   | `Date` | Date | Date added |
   | `Status` | Status | Set to **"Published"** to show product |

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🛒 E-Shop Checkout Flow

1. Visitor browses the collection grid
2. Clicks "Add to Cart" on a product card (or from the detail modal)
3. Opens the cart bag icon in the navigation
4. Reviews items, quantity, and Naira total
5. Fills in name, email, phone, and delivery address
6. Submits via one of three methods:
   - **WhatsApp**: Pre-filled order summary sent via WhatsApp link
   - **Email**: Pre-filled mailto: link opens email client with order details
   - **Print Quote**: Generates a professional branded invoice PDF ready to print

## 🚢 Deployment (Vercel)

1. Push code to GitHub
2. Import project to [vercel.com](https://vercel.com)
3. Add environment variables:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
   - `VITE_ADMIN_EMAIL`
   - `VITE_ADMIN_PASSWORD`
4. Deploy — Vercel handles `api/` functions automatically

## 🔒 Security Notes

- Admin credentials stored in environment variables
- Session-based authentication (sessionStorage)
- Notion API keys kept server-side only (Vercel functions)
- Cart data stored client-side in localStorage

## 📄 License

This project is open source and available under the MIT License.

---

**London Labels** — Exquisite finishes, luxury switches, refined brass hardware.
