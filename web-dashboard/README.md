# 🏙️ Madinti - Admin Dashboard

Government-facing web portal for managing citizen reports.

## 🎯 Features Implemented (MVP)

Based on project specifications, this admin portal includes:

### ✅ Critical Features (Phase 1 MVP)
- **Admin Login** - Secure JWT authentication
- **Dashboard** - Analytics with charts (reports by category, status)
- **Reports List** - Filterable table view with status/category filters
- **Report Details** - Full report view with photos, location, description
- **Status Management** - Update report status with comments
- **Map View** - Geographic visualization (placeholder ready for Leaflet/Mapbox)

### 📊 Dashboard Analytics
- Total reports count
- New, In Progress, and Resolved reports
- Average resolution time
- Bar chart: Reports by category
- Pie chart: Category distribution

### 🎨 Design
- Modern, clean UI with emerald green theme
- Bilingual support (French/Arabic labels)
- Responsive card-based layout
- Professional table design
- Material Design principles

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
cd web-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your backend API URL
```

### Development

```bash
# Start dev server
npm run dev

# Open http://localhost:5173
```

### Build for Production

```bash
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📁 Project Structure

```
src/
├── components/           # Reusable components
│   └── Layout.tsx       # Sidebar navigation
├── pages/               # Main views
│   ├── Login.tsx        # Admin authentication
│   ├── Dashboard.tsx    # Analytics dashboard
│   ├── ReportsList.tsx  # Reports table with filters
│   ├── ReportDetail.tsx # Single report view
│   └── MapView.tsx      # Geographic visualization
├── services/
│   └── api.ts          # Backend API service
├── types.ts            # TypeScript interfaces
├── App.tsx             # Main app with routing
└── main.tsx            # Entry point
```

## 🔐 Authentication

Default credentials (for development):
- Email: `admin@madinti.ma`
- Password: Set in your backend

JWT tokens are stored in localStorage and sent with all API requests.

## 🗺️ Map Integration

The MapView is currently a placeholder. To add interactive maps:

### Option 1: Leaflet.js (Recommended)
```bash
npm install leaflet react-leaflet
```

### Option 2: Mapbox GL JS
```bash
npm install mapbox-gl
```

See project specification for full implementation details.

## 📝 API Endpoints Expected

The dashboard expects these backend endpoints:

```
POST /api/auth/login
GET  /api/reports?status=NEW&category=INFRASTRUCTURE
GET  /api/reports/:id
PATCH /api/reports/:id/status
GET  /api/stats
```

## 🎯 Next Steps (Phase 2)

Features to implement post-MVP:
- Advanced analytics & trend analysis
- Heat maps for problem density
- Bulk status updates
- Department & staff management
- Export to CSV/PDF
- Real-time notifications
- Performance metrics & SLA tracking

## 🤝 Contributing

Follow project specifications in `/project_specification.md`

## 📄 License

© 2026 Madinti Platform - Hack ton Futur 2026
