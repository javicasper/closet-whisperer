# Closet Whisperer - Frontend

AI-powered virtual closet management system built with **Next.js 14**, **TypeScript**, and **IBM Carbon Design System**.

## 🎨 Design System

This application uses **IBM Carbon Design System** for a consistent, accessible, and professional user interface.

### Key Features

- ✨ **Modern Carbon UI** - Clean, professional interface using Carbon components
- 🌓 **Dark/Light Theme** - Toggle between themes with preference persistence
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- ♿ **Accessible** - WCAG 2.1 AA compliant (Carbon built-in accessibility)
- 🎭 **Smooth Animations** - Polished transitions and interactions
- 🧩 **Component-Based** - Reusable, maintainable component architecture

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Design System:** IBM Carbon Design System
  - `@carbon/react` - React components
  - `@carbon/styles` - Styles and tokens
  - `@carbon/icons-react` - Icon library
- **State Management:** Zustand
- **Data Fetching:** Axios + TanStack Query
- **Styling:** Carbon Styles + Custom CSS

## 📦 Installation

```bash
npm install
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t closet-whisperer-frontend .
docker run -p 3000:3000 closet-whisperer-frontend
```

## 🗂️ Project Structure

```
frontend/
├── app/                      # Next.js app router pages
│   ├── page.tsx             # Home page
│   ├── closet/              # Closet management
│   ├── outfits/             # Saved outfits
│   ├── builder/             # Outfit builder
│   ├── laundry/             # Laundry queue
│   ├── layout.tsx           # Root layout with Carbon
│   └── globals.css          # Global styles (Carbon imports)
├── components/
│   ├── layout/              # Layout components
│   │   ├── AppHeader.tsx    # Carbon Header
│   │   └── AppSideNav.tsx   # Carbon SideNav
│   ├── garments/            # Garment components
│   │   ├── GarmentTile.tsx  # Garment card (Carbon Tile)
│   │   ├── GarmentGrid.tsx  # Garment grid layout
│   │   └── UploadModal.tsx  # Upload modal (Carbon Modal)
│   ├── theme/               # Theme management
│   │   └── ThemeProvider.tsx
│   └── ui/                  # Shared UI components
├── lib/                     # Utilities and API
│   └── api.ts              # Backend API client
├── store/                   # Zustand stores
│   └── garments.store.ts
├── types/                   # TypeScript types
│   └── index.ts
└── public/                  # Static assets
```

## 🎯 Pages Overview

### Home (`/`)
- Welcome hero section
- Feature tiles (Upload, AI Suggestions, Tracking)
- Quick start guide
- CTA buttons

### Closet (`/closet`)
- Garment grid with Carbon Tiles
- Advanced filters (type, season, status, color)
- Upload garment modal
- Actions: delete, add to laundry
- Real-time search and filtering

### Builder (`/builder`)
- AI-powered outfit generator
- Interactive garment selection
- Visual feedback for selected items
- Save custom outfits
- AI reasoning display

### Outfits (`/outfits`)
- Saved outfits gallery
- View outfit details modal
- AI-suggested vs manual outfits
- Delete functionality

### Laundry (`/laundry`)
- Carbon DataTable for laundry queue
- Return to closet action
- Status tracking

## 🎨 Carbon Components Used

### Layout
- `Header` - Top navigation
- `SideNav` - Side navigation (responsive)
- `Content` - Main content area
- `Grid` / `Column` - Responsive grid system

### UI Components
- `Button` - All button variants
- `Tile` - Cards and containers
- `Modal` - Dialogs and popups
- `DataTable` - Tabular data
- `Select` / `SelectItem` - Dropdowns
- `TextInput` - Input fields
- `TextArea` - Text areas
- `Tag` - Labels and badges
- `InlineNotification` - Alerts and toasts
- `Loading` - Loading spinners
- `FileUploader` - File upload
- `OverflowMenu` - Action menus

## 🎭 Theme Support

The app includes a theme toggle that supports:
- **White** (default light theme)
- **G100** (dark theme)

Theme preference is persisted in `localStorage`.

## 🔧 Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 📝 API Integration

The frontend connects to a Fastify backend at `/api`:

- `POST /garments` - Upload garment
- `GET /garments` - List garments (with filters)
- `GET /garments/:id` - Get garment details
- `PUT /garments/:id` - Update garment
- `DELETE /garments/:id` - Delete garment
- `POST /garments/:id/laundry` - Add to laundry
- `DELETE /garments/:id/laundry` - Remove from laundry
- `GET /laundry` - Get laundry queue
- `POST /outfits/generate` - Generate AI outfit
- `POST /outfits` - Create outfit
- `GET /outfits` - List outfits
- `GET /outfits/:id` - Get outfit details
- `DELETE /outfits/:id` - Delete outfit

## 🧪 Testing

```bash
# E2E tests with Playwright
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

## 🚢 Deployment

The app is configured for containerized deployment:

1. Build: `npm run build`
2. Output: Standalone mode (optimized for Docker)
3. Images: Remote patterns configured for MinIO/S3

## 📚 Carbon Design Resources

- [Carbon Design System](https://carbondesignsystem.com/)
- [Carbon React Components](https://react.carbondesignsystem.com/)
- [Carbon Icons](https://www.carbondesignsystem.com/guidelines/icons/library/)
- [Carbon Themes](https://carbondesignsystem.com/guidelines/themes/overview/)

## 🤝 Contributing

1. Follow Carbon design patterns
2. Maintain TypeScript strict mode
3. Ensure accessibility (a11y)
4. Test on mobile and desktop
5. Document new components

## 📄 License

MIT

---

**Redesigned with ❤️ using IBM Carbon Design System**
