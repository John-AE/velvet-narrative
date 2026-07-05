# SmartDaily - Elegant Blog Platform

An exquisite, luxuriously styled blog platform with seamless content management through Notion. Built with modern web technologies for exceptional performance and user experience.

![Blog Preview](src/assets/hero-bg.jpg)

## 🌟 Features

### For Readers
- **Elegant Design**: Luxury aesthetic with Playfair Display and Inter fonts
- **Responsive Layout**: Optimized for mobile, tablet, and desktop viewing
- **Smooth Interactions**: Beautiful animations and hover effects
- **Dark Mode**: Toggle between light and dark themes
- **Engagement**: Like posts and view engagement metrics
- **Read Time**: Automatic reading time calculation
- **External Links**: Continue reading on external sources

### For Administrators
- **Notion Integration**: Manage all content directly in Notion
- **Real-time Sync**: Content updates appear immediately
- **Simple Authentication**: Secure admin access
- **Analytics Dashboard**: View likes and views for each post
- **Rich Text Editor**: Full formatting capabilities in Notion
- **Image Management**: Easy image uploads via Notion

### Technical Features
- **Single Page Application**: Fast navigation with React Router
- **Modal Reading Experience**: Full-screen reading with infinite scroll
- **Firebase Analytics**: Track user engagement
- **Serverless API**: Vercel Functions for Notion integration
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Performance**: Optimized images and lazy loading

## 🏗️ Architecture

### Frontend Stack
- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Premium component library
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching
- **Sonner** - Toast notifications

### Backend Stack
- **Notion API** - Content management system
- **Vercel Functions** - Serverless API endpoints
- **Firebase Analytics** - User behavior tracking

### Design System
- **Custom CSS Variables**: Consistent theming (see `src/index.css`)
- **Tailwind Config**: Extended theme with luxury colors
- **Font Families**: 
  - Playfair Display (headings) - Elegant serif
  - Inter (body) - Clean sans-serif
  - Jost (navigation) - Modern sans-serif

## 📂 Project Structure

```
├── api/                          # Serverless Functions (Vercel)
│   ├── posts.ts                  # Fetch published posts from Notion
│   ├── update-likes.ts           # Update post likes in Notion
│   └── update-views.ts           # Update post views in Notion
│
├── src/
│   ├── assets/                   # Images and static files
│   │   ├── hero-bg.jpg
│   │   ├── blog-workspace.jpg
│   │   ├── coffee-lifestyle.jpg
│   │   └── architecture-blog.jpg
│   │
│   ├── components/               # React Components
│   │   ├── ui/                   # Shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   │
│   │   ├── Navigation.tsx        # Site header with nav and theme toggle
│   │   ├── StoryCard.tsx         # Blog post preview card
│   │   └── StoryModal.tsx        # Full-screen post reading modal
│   │
│   ├── hooks/                    # Custom React Hooks
│   │   ├── use-mobile.tsx        # Mobile detection
│   │   └── use-toast.ts          # Toast notifications
│   │
│   ├── lib/                      # Utilities and Services
│   │   ├── firebase.ts           # Firebase Analytics config
│   │   ├── notionService.ts      # Notion API client
│   │   └── utils.ts              # Utility functions
│   │
│   ├── pages/                    # Route Pages
│   │   ├── Index.tsx             # Home page (main blog view)
│   │   ├── Admin.tsx             # Admin login page
│   │   ├── AdminDashboard.tsx    # Admin content management
│   │   └── NotFound.tsx          # 404 page
│   │
│   ├── App.tsx                   # Main app component with routes
│   ├── main.tsx                  # App entry point
│   └── index.css                 # Global styles and design system
│
├── public/                       # Static public files
│   └── robots.txt
│
├── index.html                    # HTML entry point
├── tailwind.config.ts            # Tailwind CSS configuration
├── vite.config.ts                # Vite build configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Notion account with integration set up
- Firebase project (optional, for analytics)
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-git-url>
   cd <project-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Notion Configuration
   NOTION_API_KEY=your_notion_integration_key
   NOTION_DATABASE_ID=your_notion_database_id
   
   # Admin Authentication
   VITE_ADMIN_EMAIL=admin@example.com
   VITE_ADMIN_PASSWORD=your_secure_password
   
   # Firebase Analytics (Optional)
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Set up Notion Database**
   
   Create a Notion database with these properties:
   - `Title` (title) - Post title
   - `Excerpt` (rich text) - Short description
   - `Content` (rich text) - Full article content
   - `Featured Image` (files) - Hero image
   - `Category` (rich text) - Post category
   - `Author` (rich text) - Author name
   - `Date` (date) - Publication date
   - `External URL` (url) - Link to full article (optional)
   - `Likes` (number) - Like count
   - `Views` (number) - View count
   - `Status` (status) - Set to "Published" to show post

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎨 Customization

### Colors & Theme

Edit `src/index.css` to customize the color scheme:

```css
:root {
  --accent: 38 80% 50%;           /* Gold accent color */
  --hero-bg: 240 30% 12%;         /* Dark blue hero background */
  --luxury: 38 70% 60%;           /* Luxury gold */
  /* ... more colors */
}
```

### Fonts

Update font imports in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

Update font families in `tailwind.config.ts`:
```typescript
fontFamily: {
  'playfair': ['Playfair Display', 'serif'],
  'inter': ['Inter', 'sans-serif'],
}
```

### Blog Title

Change "SmartDaily" in:
- `src/components/Navigation.tsx` (line 32)
- `src/pages/AdminDashboard.tsx` (line 63)
- `index.html` (title tag)

## 📝 Content Management

### Creating Posts

1. Log in to admin dashboard at `/admin`
2. Click "Open in Notion" button
3. Add a new row to your Notion database
4. Fill in all required fields
5. Set `Status` to "Published"
6. Post appears immediately on the blog

### Post Properties Explained

- **Title**: Main heading (max 60 chars for SEO)
- **Excerpt**: Preview text on cards (2-3 sentences)
- **Content**: Full article text (can be long)
- **Featured Image**: Upload or paste image URL
- **Category**: Group posts (e.g., "Design", "Lifestyle")
- **Author**: Writer's name
- **Date**: Publication date
- **External URL**: Link to continue reading elsewhere
- **Status**: Must be "Published" to show on blog

## 🚢 Deployment

### Deploy to Vercel

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Add environment variables
   - Click "Deploy"

3. **Environment Variables in Vercel**
   
   Add these in Project Settings → Environment Variables:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
   - `VITE_ADMIN_EMAIL`
   - `VITE_ADMIN_PASSWORD`
   - Firebase variables (if using analytics)

4. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:
```bash
git add .
git commit -m "Update content"
git push origin main
```

## 🔒 Security Notes

### Current Implementation
- Admin credentials stored in environment variables
- Session-based authentication (sessionStorage)
- Notion API keys kept server-side

### Production Recommendations
1. **Implement proper authentication**
   - Use OAuth (Google, GitHub)
   - Or implement JWT tokens
   - Consider NextAuth.js

2. **Rate limiting**
   - Add rate limits to API endpoints
   - Protect against abuse

3. **Input validation**
   - Validate all user inputs
   - Sanitize content from Notion

4. **HTTPS**
   - Always use HTTPS in production
   - Vercel provides this automatically

## 🧪 Testing

Run the development server and test:
```bash
npm run dev
```

### Manual Testing Checklist
- [ ] Home page loads with all posts
- [ ] Click post opens modal
- [ ] Like button increments count
- [ ] View count increases when post opened
- [ ] External link button works
- [ ] Admin login with correct credentials
- [ ] Admin dashboard shows all posts
- [ ] Notion link opens correct database
- [ ] Dark mode toggle works
- [ ] Responsive on mobile/tablet
- [ ] Smooth animations and transitions

## 📊 Analytics

### Firebase Analytics Events

The blog tracks these events:
- `view_item`: When a post is opened
  - `item_id`: Post ID
  - `item_name`: Post title
  - `item_category`: Post category

View analytics in Firebase Console → Analytics.

## 🐛 Troubleshooting

### Posts not appearing
1. Check Notion database has posts
2. Verify `Status` is set to "Published"
3. Check environment variables are set correctly
4. Look at browser console for errors

### API errors
1. Verify `NOTION_API_KEY` is valid
2. Check `NOTION_DATABASE_ID` is correct
3. Ensure Notion integration has access to database
4. Check Vercel function logs

### Images not loading
1. Use public URLs (not Notion's temporary URLs)
2. Upload images to cloud storage (Cloudinary, Imgur)
3. Check CORS settings if using external images

### Deployment issues
1. Check all environment variables are set in Vercel
2. Verify `api/` folder is deployed correctly
3. Check Vercel function logs for errors
4. Ensure Node.js version compatibility

## 🤝 Contributing

This is a personal blog platform. If you'd like to use it:
1. Fork the repository
2. Customize for your needs
3. Deploy your own instance

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- **Live Site**: [Your deployment URL]
- **Notion Template**: [Link to your Notion database template]
- **Documentation**: See `DEVELOPER_GUIDE.md` for technical details

## ✨ Credits

Built with:
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Notion API](https://developers.notion.com/)
- [Vercel](https://vercel.com/)
- [Firebase](https://firebase.google.com/)

Fonts:
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display)
- [Inter](https://fonts.google.com/specimen/Inter)
- [Jost](https://fonts.google.com/specimen/Jost)

---

**Made with ❤️ using Lovable**
