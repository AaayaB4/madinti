# Madinti - Backend API Quick Start

## 🚀 Running the Backend

### 1. Start Infrastructure
```bash
cd ~/madinti
docker compose up -d postgres redis
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Setup Database
```bash
# Copy environment file
cp .env.example .env

# Generate Prisma Client
npm run prisma:generate

# Run migrations (create tables)
npm run prisma:migrate
```

### 4. Start Development Server
```bash
npm run dev
```

Backend will run on **http://localhost:3000**

### 5. Test the API
```bash
curl http://localhost:3000/api/health
```

## 📊 Database Management

### Prisma Studio (GUI)
```bash
npm run prisma:studio
```
Opens at **http://localhost:5555**

## 🎯 Next Development Steps

1. **Complete JWT Auth** - Implement OTP and login flow
2. **File Upload** - Connect MinIO for photo storage  
3. **AI Integration** - Add OpenAI for categorization
4. **Geographic Routing** - PostGIS queries
5. **WebSocket** - Real-time dashboard updates

See `backend/README.md` for full documentation.
