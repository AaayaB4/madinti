# 🏙️ Madinti - Civic Reporting Platform

[![GitHub](https://img.shields.io/badge/GitHub-AaayaB4%2Fmadinti-blue?logo=github)](https://github.com/AaayaB4/madinti)


A secure, AI-powered civic engagement platform for Sidi Slimane, Morocco.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git
- Node.js (for backend and frontend development)

### Initial Setup

1. **Clone and navigate to the project**:
   ```bash
   cd ~/madinti
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start infrastructure services**:
   ```bash
   docker compose up -d postgres redis
   ```

4. **Verify services are running**:
   ```bash
   docker compose ps
   ```

5. **Access services**:
   - PostgreSQL: `localhost:5432` (credentials in .env)
   - Redis: `localhost:6379`
   - MinIO Console: `http://localhost:9001` (start with `docker compose up -d minio`)

## 📁 Project Structure

```
madinti/
├── backend/              # API server (Node.js/Django)
├── mobile/               # React Native mobile app
├── web-dashboard/        # React admin dashboard
├── docker/
│   ├── nginx/            # Nginx configuration
│   └── postgres/         # Database init scripts
├── docker-compose.yml    # Infrastructure configuration
├── project_specification.md  # Detailed project spec
└── implementation_plan.md   # Development roadmap
```

## 📖 Documentation

- **[Project Specification](./project_specification.md)**: Complete technical specification
- **[Implementation Plan](./implementation_plan.md)**: Development roadmap broken down by section

## 🔧 Development Workflow

### Phase 1: Infrastructure ✅
- [x] Git repository initialized  
- [x] Docker Compose configured
- [ ] Services verified and running

### Phase 2: Backend API (Next)
- [ ] Initialize API project
- [ ] Setup authentication
- [ ] Create database models
- [ ] Implement report CRUD

### Phase 3: Mobile App
- [ ] React Native setup
- [ ] Authentication screens
- [ ] Report submission flow

### Phase 4: Web Dashboard
- [ ] React web app setup
- [ ] Admin dashboard
- [ ] Report management interface

## 🗄️ Database

PostgreSQL with PostGIS extension for geographic queries.

To connect:
```bash
docker exec -it madinti-db psql -U madinti_user -d madinti
```

Check PostGIS:
```sql
SELECT PostGIS_Version();
```

## 🔍 Troubleshooting

### Docker containers not starting
```bash
docker compose down
docker compose up -d
docker compose logs -f
```

### Reset everything
```bash
docker compose down -v
# This will delete all data!
```

## 📞 Competition Info

- **Event**: Hack ton Futur 2026
- **Theme**: "Your City / Your Village: Think Big to Face Major Challenges"
- **Deadline**: March 13, 2026
- **Target**: Sidi Slimane, Morocco

## 🏆 Team

- Team formation: 3-5 students (gender parity required)
- Register at: www.hacktonfutur.com

---

For detailed technical information, see [project_specification.md](./project_specification.md)
