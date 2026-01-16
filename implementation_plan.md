# Madinti Implementation Plan

This document breaks down the Madinti project into three distinct technical tracks. We will execute these in order, starting with Infrastructure to promote a stable base for development.

## 🏗️ Section 1: Infrastructure & Docker (The Foundation)

**Goal**: Create a portable, containerized environment that any developer can spin up with one command.

### 1.1 Project Structure Setup
- Create monorepo structure:
  ```
  madinti/
  ├── backend/
  ├── mobile/
  ├── web-dashboard/
  ├── docker/
  └── docker-compose.yml
  ```
- Initialize Git repository.

### 1.2 Database & Services (Docker Compose)
- **PostgreSQL + PostGIS**: Configure for geospatial data.
- **Redis**: For caching and task queues.
- **MinIO**: S3-compatible local object storage for report photos.
- **PgAdmin** (Optional): For easy database management during dev.

### 1.3 Networking
- **Nginx Reverse Proxy**:
  - Route `/api` -> Backend Container
  - Route `/dashboard` -> Web Dashboard Container
  - Handle SSL termination (dev certs).

---

## ⚙️ Section 2: Backend API (The Brain)

**Goal**: A secure, robust API handling reports, auth, and AI processing.

### 2.1 Core Setup
- Initialize project (Recommendation: **Node.js + Express** or **Python + Django**).
- Configure database connection (TypeORM or Prisma if Node, Django ORM if Python).

### 2.2 Authentication Module
- User Tables (Citizens vs Government).
- JWT generation and validation middleware.
- SMS OTP logic placeholder.

### 2.3 Reporting Engine
- **CRUD Operations**: Create, Read, Update, List reports.
- **Geospatial Queries**: "Find reports within 5km of Sidi Slimane center".
- **File Uploads**: API to receive images and store in MinIO.

### 2.4 AI & Logic Layers
- **Routing Logic**: Map GPS coords -> Commune/Authority.
- **AI Service Integration**: Connect to OpenAI/HuggingFace for image categorization.

---

## 💻 Section 3: Frontend Applications (The Face)

**Goal**: User-friendly interfaces for citizens and government officials.

### 3.1 Mobile App (Citizen) - React Native
- **Setup**: Expo or CLI based React Native project.
- **Navigation**: Stack navigation (Auth -> Home -> Report -> Profile).
- **Core Screens**:
  - **Login/Register**: OTP flow.
  - **Map Home**: View nearby reports.
  - **Camera Capture**: Capture evidence.
  - **Report Form**: Auto-filled address, category selection.

### 3.2 Web Dashboard (Government) - React
- **Setup**: Vite + React + TailwindCSS.
- **Layout**: Sidebar navigation, header with user profile.
- **Core Views**:
  - **Stats Overview**: Charts/Graphs.
  - **Incident Map**: Leaflet/Mapbox integration showing all city issues.
  - **Triage Table**: List of reports to Approve/Reject/Resolve.

---

## 🚀 Execution Strategy

We will proceed in this order:
1. **Infra**: Get `docker-compose up` running with DB and empty services.
2. **Backend**: Build the "Create Report" API first.
3. **Mobile**: Connect the mobile app to post a report.
4. **Web**: Visualize that report on the dashboard.
