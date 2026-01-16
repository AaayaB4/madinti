# Backend API Documentation

## Getting Started

### Prerequisites
- Docker & Docker Compose running
- Node.js 20+ installed
- PostgreSQL database (via Docker)

### Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Setup environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

4. **Run database migrations**:
   ```bash
   npm run prisma:migrate
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /api/health
```

Returns API status and version.

### Authentication (TODO)
```
POST /api/auth/register - Register new user
POST /api/auth/login - Login user  
POST /api/auth/otp - Send OTP
POST /api/auth/verify-otp - Verify OTP
```

### Reports
```
GET /api/reports - List all reports
POST /api/reports - Create new report (TODO)
GET /api/reports/:id - Get single report
PATCH /api/reports/:id - Update report (TODO)
DELETE /api/reports/:id - Delete report (TODO)
```

## Database Schema

### User Model
- `id`: UUID
- `phoneNumber`: Unique phone number
- `role`: CITIZEN | FIELD_WORKER | ADMIN | SUPER_ADMIN
- `points`: Gamification points

### Report Model
- `id`: UUID
- `userId`: Reference to User
- `category`: ROAD | LIGHTING | WASTE | WATER | etc.
- `status`: NEW | ACKNOWLEDGED | IN_PROGRESS | RESOLVED | etc.
- `locationLat`, `locationLng`: GPS coordinates
- `photoUrls`: Array of photo URLs
- `upvoteCount`: Number of upvotes

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Tech Stack

- **Runtime**: Node.js 20
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL + PostGIS
- **Auth**: JWT
- **File Upload**: Multer + MinIO
- **Real-time**: Socket.io (coming soon)
- **AI**: OpenAI API (coming soon)

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── config/
│   │   └── database.ts    # Prisma client
│   ├── controllers/       # Business logic (TODO)
│   ├── middleware/        # Auth, validation (TODO)
│   ├── routes/
│   │   ├── health.ts      # Health check
│   │   ├── auth.ts        # Authentication
│   │   └── reports.ts     # Reports CRUD
│   ├── services/          # External services (TODO)
│   ├── utils/             # Utilities (TODO)
│   └── index.ts           # Main server file
├── .env                   # Environment variables
├── package.json
└── tsconfig.json
```

## Next Steps

1. ✅ Basic Express server setup
2. ✅ Prisma schema defined
3. ✅ Basic routes created
4. 🔄 Implement JWT authentication
5. 🔄 Implement report creation with file upload
6. 🔄 Add AI categorization service
7. 🔄 Add geographic routing logic
8. 🔄 Implement WebSocket for real-time updates

