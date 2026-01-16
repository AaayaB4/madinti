# 🏙️ مدينتي (Madinti) - Civic Reporting Platform
## Comprehensive Project Specification

**Competition**: Hack ton Futur 2026 - "Your City / Your Village: Think Big to Face Major Challenges"  
**Target Location**: Sidi Slimane, Morocco  
**Version**: 1.0  
**Date**: January 8, 2026

---

## 📋 Executive Summary

**Madinti** (My City) is a secure, AI-powered civic engagement platform that empowers citizens to report infrastructure problems and enables local authorities to efficiently manage and resolve community issues. The system consists of two applications:

1. **Mobile App** (Citizen-facing): iOS & Android native apps for reporting issues
2. **Web Dashboard** (Government-facing): Administrative portal for managing reports

The platform leverages AI for automated categorization, implements robust security measures, and provides alternative access methods (SMS) for citizens without smartphones.

---

## 🎯 Core Objectives

- **Empower Citizens**: Enable easy, secure reporting of infrastructure problems
- **Improve Governance**: Provide authorities with actionable data and efficient workflows
- **Ensure Accessibility**: Support multiple channels (mobile, SMS, web)
- **Leverage AI**: Automated categorization and intelligent routing
- **Build Trust**: Transparent tracking and accountability through status updates
- **Scale**: Cloud-native, containerized architecture ready for expansion

---

## 🏛️ Morocco Administrative Structure & Routing Logic

### Understanding Moroccan Territorial Organization

Morocco has a 3-tier administrative structure:

1. **Regions** (12 total) - Highest administrative level
2. **Provinces/Prefectures** (75 total) - Second level
   - **Prefectures**: Urban/metropolitan areas
   - **Provinces**: Rural areas
3. **Communes** (1,538 total) - Local level
   - **Urban Communes** (256): City/town municipalities
   - **Rural Communes** (1,282): Village/rural municipalities

### Infrastructure Responsibilities by Level

| Infrastructure Type | Responsible Authority | Routing Level |
|-------------------|---------------------|--------------|
| **Local Roads** (unclassified) | Commune → Province | Commune |
| **Provincial Roads** | Province/Prefecture | Province |
| **Regional Roads** | Region | Region |
| **National Roads** | Ministry of Equipment | National |
| **Street Lighting** | Commune | Commune |
| **Waste Management** | Commune | Commune |
| **Local Water Distribution** | Commune + ONEE | Commune/National |
| **Sanitation** | Commune + ONEE | Commune/National |
| **Public Spaces** (parks, squares) | Commune | Commune |

### Routing Algorithm for Sidi Slimane

```
Report Created → GPS Coordinates Captured
    ↓
1. Identify Commune (based on GPS boundaries)
   - Database contains geometric boundaries of all communes
   - PostGIS spatial queries determine which commune contains the coordinates
    ↓
2. Categorize Issue Type (AI-assisted)
   - Pothole → "Road Maintenance"
   - Broken streetlight → "Public Lighting"
   - Garbage → "Waste Management"
    ↓
3. Route to Appropriate Authority
   - LOCAL ISSUES (lighting, waste, local roads) → Commune of Sidi Slimane
   - PROVINCIAL ROADS → Sidi Slimane Province
   - REGIONAL ISSUES → Rabat-Salé-Kénitra Region
   - WATER/SANITATION → Commune + escalate to ONEE if unresolved
    ↓
4. Assign to Specific Department
   - Within commune: Technical Services, Public Works, Environment, etc.
```

### Authority Hierarchy for Sidi Slimane

```
National Level
├── Ministry of Equipment (national roads)
└── ONEE (water/electricity)

Regional Level
└── Rabat-Salé-Kénitra Region
    └── Regional equipment and infrastructure

Provincial Level
└── Sidi Slimane Province
    ├── Provincial roads
    └── Rural development

Communal Level (Primary Target)
└── Commune of Sidi Slimane
    ├── Technical Services Department
    ├── Public Works Department
    ├── Environmental Services
    ├── Urban Planning
    └── Municipal Police
```

---

## 📱 System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CITIZEN INTERFACES                     │
├─────────────────────────────────────────────────────────┤
│  Mobile App (iOS/Android)  │  SMS Gateway  │  Web Form  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                  API GATEWAY (Nginx)                      │
│              SSL/TLS Termination & Rate Limiting          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND API (Node.js/Django)             │
├─────────────────────────────────────────────────────────┤
│  Authentication │ Authorization │ Business Logic │ AI    │
└────────┬────────┬────────────┬──────────────────────────┘
         │        │            │
         ▼        ▼            ▼
    ┌────────┐ ┌──────────┐ ┌─────────────┐
    │Database│ │ Object   │ │ AI Service  │
    │(Postgres)│ │ Storage  │ │ (Image AI)  │
    │ +PostGIS│ │ (S3/Minio)│ │ (OpenAI API)│
    └────────┘ └──────────┘ └─────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│            GOVERNMENT WEB DASHBOARD (React)               │
│         Report Management │ Analytics │ Mapping          │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Mobile App
- **Framework**: React Native (cross-platform iOS/Android)
- **Alternative**: Flutter
- **Key Libraries**:
  - React Native Maps (mapping)
  - React Native Camera (photo capture)
  - React Native Geolocation (GPS)
  - React Native Push Notifications
  - i18n (Arabic/French localization)

#### Government Web Dashboard
- **Frontend**: React.js + TypeScript
- **UI Framework**: Material-UI or Ant Design
- **Mapping**: Leaflet.js or Mapbox GL JS
- **Charts**: Recharts or Chart.js
- **State Management**: Redux Toolkit

#### Backend API
- **Framework**: Django REST Framework (Python) or Express.js (Node.js)
- **Recommendation**: Django for better security and ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Authorization**: Role-Based Access Control (RBAC)
- **API Documentation**: OpenAPI/Swagger

#### Database
- **Primary DB**: PostgreSQL 15+
- **Spatial Extension**: PostGIS (for geographic queries)
- **Caching**: Redis
- **Search**: Elasticsearch (optional, for advanced searching)

#### File Storage
- **Development**: MinIO (S3-compatible, self-hosted)
- **Production**: AWS S3 or DigitalOcean Spaces

#### AI Services
- **Image Recognition**: 
  - OpenAI Vision API (GPT-4 Vision)
  - Alternative: Google Cloud Vision API
  - Self-hosted option: CLIP model via Hugging Face
- **Text Processing**: Natural language understanding for descriptions

#### SMS Gateway
- **Provider Options**:
  - Twilio (international)
  - IAM (Moroccan provider) - **Recommended for local deployment**
  - Nexmo/Vonage
- **Protocol**: SMS API integration

#### DevOps & Deployment
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (for production scale)
- **CI/CD**: GitHub Actions or GitLab CI
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Cloud Platform**: AWS, Google Cloud, or DigitalOcean

---

## 🎯 Features Breakdown

### Phase 1: MVP (Minimum Viable Product) - For Competition Demo

**Timeline**: 4-6 weeks  
**Goal**: Working prototype demonstrating core functionality

#### Mobile App Features (MVP)

| Feature | Priority | Description |
|---------|----------|-------------|
| **User Registration** | 🔴 Critical | Phone number + OTP verification |
| **Report Creation** | 🔴 Critical | Camera, GPS, category selection, description |
| **AI Categorization** | 🔴 Critical | Auto-suggest category from photo |
| **Report Submission** | 🔴 Critical | Upload to server with photo |
| **View Map** | 🔴 Critical | See all reports on interactive map |
| **Report Status Tracking** | 🔴 Critical | Track: New → Acknowledged → In Progress → Resolved |
| **Push Notifications** | 🟡 Important | Updates on your reports |
| **Language Toggle** | 🟡 Important | Arabic ⟷ French |
| **Upvote Reports** | 🟢 Nice-to-have | Prevent duplicates, show priority |
| **Photo Gallery** | 🟢 Nice-to-have | Before/After of resolved issues |

#### Government Dashboard Features (MVP)

| Feature | Priority | Description |
|---------|----------|-------------|
| **Admin Login** | 🔴 Critical | Secure authentication for officials |
| **Report List View** | 🔴 Critical | Table of all reports with filters |
| **Report Details** | 🔴 Critical | View full report with photos, location, description |
| **Status Management** | 🔴 Critical | Update report status |
| **Map View** | 🔴 Critical | Geographic visualization of all reports |
| **Assignment System** | 🟡 Important | Assign reports to departments/staff |
| **Analytics Dashboard** | 🟡 Important | Charts: reports by category, status, time |
| **Export Data** | 🟡 Important | CSV/PDF export for reporting |
| **Department Management** | 🟢 Nice-to-have | Manage departments and users |
| **SLA Tracking** | 🟢 Nice-to-have | Track response time metrics |

#### Backend Features (MVP)

| Feature | Priority | Description |
|---------|----------|-------------|
| **RESTful API** | 🔴 Critical | CRUD operations for reports |
| **JWT Authentication** | 🔴 Critical | Secure token-based auth |
| **Geographic Routing** | 🔴 Critical | PostGIS queries to route reports |
| **AI Integration** | 🔴 Critical | OpenAI API for image classification |
| **File Upload** | 🔴 Critical | S3-compatible storage |
| **SMS Receiver** | 🟡 Important | Accept reports via SMS |
| **Rate Limiting** | 🟡 Important | Prevent spam/abuse |
| **Audit Logging** | 🟡 Important | Track all actions |
| **Notification Service** | 🟡 Important | Send push notifications |

### Phase 2: Enhanced Features - Post-Competition

**Timeline**: 2-3 months after MVP  
**Goal**: Production-ready system with advanced features

#### Citizen App Enhancements

- **Offline Mode**: Queue reports when offline, auto-sync when online
- **Gamification**: Points, badges, leaderboards for active citizens
- **Social Features**: Share reports on social media
- **Report Comments**: Citizens can add updates/comments
- **Nearby Issues**: Alert when approaching reported problems
- **Community Voting**: Vote on priority issues
- **Report History**: View all your past reports
- **Account Profile**: Manage personal information
- **Multi-photo Upload**: Upload multiple photos per report
- **Video Support**: Submit video evidence
- **Voice Notes**: Audio descriptions in Darija

#### Government Dashboard Enhancements

- **Advanced Analytics**: Predictive analytics, trend analysis
- **Heat Maps**: Visualize problem density
- **Performance Metrics**: Department/staff performance tracking
- **Bulk Actions**: Update multiple reports simultaneously
- **Automated Workflows**: Auto-assign based on rules
- **Integration with GIS**: Import existing city infrastructure data
- **Mobile Dashboard**: Responsive web app for field workers
- **Report Templates**: Save response templates
- **Escalation Rules**: Auto-escalate if not resolved in X days
- **Citizen Feedback**: Rate resolution quality

#### SMS Features

- **Send Report via SMS**: Text-based reporting
  - Format: `REPORT [CATEGORY] [DESCRIPTION] [LOCATION]`
  - Example: `REPORT POTHOLE Large hole Rue Mohammed V`
- **SMS Status Updates**: Receive updates via text
- **USSD Menu**: \*123# for feature phones (Phase 3)

#### AI Enhancements

- **Advanced Image Recognition**:
  - Detect pothole depth/severity
  - Count garbage bags in photos
  - Identify streetlight types
  - Blur faces/license plates for privacy
- **Duplicate Detection**: Identify similar reports automatically
- **Priority Scoring**: AI suggests priority based on severity
- **Sentiment Analysis**: Analyze description urgency
- **Automatic Translation**: Arabic ⟷ French ⟷ Darija

### Phase 3: Advanced Features - 6+ months

- **Citizen Portal**: Web version of mobile app
- **Public API**: Allow third-party integrations
- **IoT Integration**: Connect with smart city sensors
- **Blockchain**: Immutable audit trail (transparency)
- **Predictive Maintenance**: AI predicts infrastructure failures
- **Budget Tracking**: Link reports to municipal budgets
- **Contractor Management**: Assign work to external contractors
- **Multi-city Support**: Expand beyond Sidi Slimane

---

## 🔒 Security Architecture

### Security Principles

1. **Defense in Depth**: Multiple layers of security
2. **Least Privilege**: Users only access what they need
3. **Zero Trust**: Verify every request
4. **Data Privacy**: GDPR-compliant (Morocco DPA regulations)
5. **Secure by Default**: Security built-in, not bolted on

### Security Features

#### Authentication & Authorization

| Layer | Implementation |
|-------|---------------|
| **User Auth** | JWT tokens with refresh mechanism |
| **Token Expiry** | Access token: 15 min, Refresh: 7 days |
| **Password Policy** | Min 8 chars, complexity requirements |
| **2FA (Phase 2)** | SMS OTP for government users |
| **Role-Based Access** | Citizen, Field Worker, Admin, Super Admin |
| **IP Whitelisting** | Government dashboard (optional) |

#### Data Security

| Aspect | Implementation |
|--------|---------------|
| **Encryption at Rest** | Database encryption (PostgreSQL TDE) |
| **Encryption in Transit** | TLS 1.3 (HTTPS everywhere) |
| **PII Protection** | Hash phone numbers, encrypt names |
| **Photo Privacy** | AI face blurring, EXIF stripping |
| **Anonymization** | Option for anonymous reporting |
| **Data Retention** | Auto-delete resolved reports after 2 years |

#### Application Security

- **Input Validation**: Sanitize all user inputs (prevent SQL injection)
- **Rate Limiting**: 
  - API: 100 requests/hour per user
  - Report submission: 10 reports/day per user
- **CSRF Protection**: CSRF tokens for state-changing requests
- **XSS Prevention**: Content Security Policy headers
- **SQL Injection**: Use ORM (parameterized queries only)
- **File Upload Security**:
  - Max 10MB per photo
  - Only allow: .jpg, .png, .heic
  - Virus scanning (ClamAV)
  - Store in isolated bucket

#### Infrastructure Security

- **Docker Security**:
  - Non-root containers
  - Read-only file systems
  - Resource limits (CPU, memory)
  - Regular image scanning (Trivy)
- **Network Security**:
  - Private VPC/network
  - Firewall rules (only expose necessary ports)
  - DDoS protection (Cloudflare)
- **Secrets Management**:
  - Docker secrets (not environment variables)
  - Vault for production (HashiCorp Vault)
- **Monitoring**:
  - Intrusion detection (Fail2Ban)
  - Audit logging (all actions logged)
  - Anomaly detection (unusual patterns)

#### Compliance

- **Morocco Data Protection Laws**: Comply with Law 09-08
- **GDPR Alignment**: Right to access, rectify, delete data
- **Audit Trail**: Immutable logs of all actions
- **Data Localization**: Option to host data in Morocco

---

## 📊 Database Schema (Core Tables)

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    phone_hash VARCHAR(64) UNIQUE NOT NULL, -- Hashed for privacy
    full_name_encrypted TEXT,
    role VARCHAR(20) DEFAULT 'citizen', -- citizen, field_worker, admin
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    points INTEGER DEFAULT 0 -- Gamification
);
```

### Reports Table
```sql
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    category VARCHAR(50) NOT NULL, -- pothole, lighting, waste, water, other
    subcategory VARCHAR(50),
    description TEXT,
    location GEOGRAPHY(POINT, 4326) NOT NULL, -- PostGIS geographic point
    address TEXT,
    commune_id UUID REFERENCES communes(id),
    province_id UUID REFERENCES provinces(id),
    region_id UUID REFERENCES regions(id),
    status VARCHAR(20) DEFAULT 'new', -- new, acknowledged, in_progress, resolved, closed
    priority INTEGER DEFAULT 2, -- 1=low, 2=medium, 3=high, 4=urgent
    ai_confidence FLOAT, -- AI categorization confidence
    ai_suggested_category VARCHAR(50),
    photo_urls TEXT[], -- Array of S3 URLs
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    assigned_to UUID REFERENCES users(id),
    department VARCHAR(100),
    upvote_count INTEGER DEFAULT 0,
    is_duplicate BOOLEAN DEFAULT false,
    duplicate_of UUID REFERENCES reports(id)
);

CREATE INDEX idx_reports_location ON reports USING GIST(location);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
```

### Geographic Boundaries Tables
```sql
CREATE TABLE regions (
    id UUID PRIMARY KEY,
    name_ar VARCHAR(100),
    name_fr VARCHAR(100),
    code VARCHAR(10) UNIQUE,
    boundary GEOGRAPHY(POLYGON, 4326)
);

CREATE TABLE provinces (
    id UUID PRIMARY KEY,
    region_id UUID REFERENCES regions(id),
    name_ar VARCHAR(100),
    name_fr VARCHAR(100),
    code VARCHAR(10) UNIQUE,
    type VARCHAR(20), -- 'province' or 'prefecture'
    boundary GEOGRAPHY(POLYGON, 4326)
);

CREATE TABLE communes (
    id UUID PRIMARY KEY,
    province_id UUID REFERENCES provinces(id),
    name_ar VARCHAR(100),
    name_fr VARCHAR(100),
    code VARCHAR(10) UNIQUE,
    type VARCHAR(20), -- 'urban' or 'rural'
    boundary GEOGRAPHY(POLYGON, 4326),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20)
);
```

### Categories Table
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name_ar VARCHAR(100),
    name_fr VARCHAR(100),
    icon_url VARCHAR(255),
    responsible_level VARCHAR(20), -- 'commune', 'province', 'region', 'national'
    department VARCHAR(100),
    sla_hours INTEGER, -- Expected resolution time
    is_active BOOLEAN DEFAULT true
);
```

### Report Updates/Audit Log
```sql
CREATE TABLE report_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id),
    updated_by UUID REFERENCES users(id),
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    comment TEXT,
    photo_urls TEXT[], -- Before/after photos
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Upvotes Table
```sql
CREATE TABLE report_upvotes (
    report_id UUID REFERENCES reports(id),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (report_id, user_id)
);
```

### SMS Reports Table
```sql
CREATE TABLE sms_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) NOT NULL,
    sms_body TEXT NOT NULL,
    parsed_category VARCHAR(50),
    parsed_description TEXT,
    parsed_location TEXT,
    report_id UUID REFERENCES reports(id), -- Linked report if successfully created
    status VARCHAR(20) DEFAULT 'pending', -- pending, processed, failed
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🤖 AI Integration Details

### Use Cases

1. **Image Classification**
   - Input: Photo of infrastructure problem
   - Output: Category + Subcategory + Confidence score
   - Model: GPT-4 Vision or Google Vision AI

2. **Severity Detection**
   - Input: Photo
   - Output: Severity level (1-4) + Reasoning
   - Example: "Large pothole, ~30cm diameter, vehicle damage risk → Severity 4"

3. **Duplicate Detection**
   - Input: New report (photo + location)
   - Output: Similar existing reports within 50m radius
   - Method: Image similarity (CLIP embeddings) + Geographic proximity

4. **Smart Routing**
   - Input: Report details
   - Output: Recommended department + Authority level
   - Logic: Category mapping + Geographic boundaries

5. **Priority Scoring**
   - Inputs: Category, severity, upvotes, location (near schools/hospitals?)
   - Output: Priority score (1-4)
   - Method: Weighted algorithm with AI assistance

### AI Architecture

```
┌─────────────────────────────────────────┐
│         Client Upload Photo             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Backend API (Django/Express)       │
├─────────────────────────────────────────┤
│  1. Save photo to temp storage          │
│  2. Call AI Service                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          AI Service (Python)            │
├─────────────────────────────────────────┤
│  Option A: OpenAI API                   │
│  - Send image to GPT-4 Vision           │
│  - Prompt: "Categorize this             │
│    infrastructure problem..."           │
│                                         │
│  Option B: Self-hosted (Hugging Face)   │
│  - CLIP model for image embedding       │
│  - Custom classifier (fine-tuned)       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Response Processing             │
├─────────────────────────────────────────┤
│  {                                      │
│    "category": "road",                  │
│    "subcategory": "pothole",            │
│    "confidence": 0.92,                  │
│    "severity": 3,                       │
│    "description": "Large pothole..."    │
│  }                                      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Save to Database + Notify User     │
└─────────────────────────────────────────┘
```

### Sample AI Prompt (GPT-4 Vision)

```
You are an AI assistant helping categorize infrastructure problems in Moroccan cities.

Analyze this photo and provide:
1. Category: road, lighting, waste, water, public_space, other
2. Subcategory: (e.g., pothole, broken_light, garbage_pile, water_leak, etc.)
3. Severity: 1 (minor) to 4 (urgent)
4. Brief description in Arabic and French
5. Confidence: 0.0 to 1.0

Respond in JSON format:
{
  "category": "road",
  "subcategory": "pothole",
  "severity": 3,
  "description_ar": "حفرة كبيرة في الطريق",
  "description_fr": "Grand nid-de-poule sur la route",
  "confidence": 0.89
}
```

### AI Cost Estimation (MVP)

**Using OpenAI GPT-4 Vision:**
- Cost per image: ~$0.01 USD
- Expected reports: 100/month (demo phase)
- Monthly AI cost: ~$1 USD

**Self-hosted alternative:**
- One-time setup using Hugging Face
- Free (but requires more development time)

---

## 📲 Alternative Access: SMS Reporting

### Why SMS?

- **Accessibility**: 15-20% of Moroccan population still without smartphones
- **Simplicity**: No app installation required
- **Universal**: Works on any mobile phone
- **Backup**: Alternative if mobile app unavailable

### SMS Workflow

```
Citizen                    SMS Gateway              Backend               Database
   |                            |                      |                      |
   | 1. Send SMS                |                      |                      |
   |--------------------------->|                      |                      |
   |                            |                      |                      |
   |                            | 2. Webhook/API       |                      |
   |                            |--------------------->|                      |
   |                            |                      |                      |
   |                            |                      | 3. Parse SMS         |
   |                            |                      |    (NLP/Regex)       |
   |                            |                      |                      |
   |                            |                      | 4. Geocode address   |
   |                            |                      |    (if text location)|
   |                            |                      |                      |
   |                            |                      | 5. Create report     |
   |                            |                      |--------------------->|
   |                            |                      |                      |
   |                            | 6. Confirmation SMS  |                      |
   | <------------------------- |<---------------------|                      |
   | "شكراً! بلاغك رقم #123"    |                      |                      |
```

### SMS Format Options

**Option 1: Structured Format**
```
REPORT [CATEGORY] [DESCRIPTION]
Address: [STREET/LANDMARK]

Example:
REPORT POTHOLE Large hole near school
Address: Rue Mohammed V, Sidi Slimane
```

**Option 2: Natural Language (with AI parsing)**
```
Just describe the problem naturally in Arabic or French

Example (Arabic):
حفرة كبيرة في شارع محمد الخامس قرب المدرسة

Example (French):
Grand nid-de-poule dans Rue Mohammed V près de l'école
```

**Option 3: USSD Menu (Phase 3)**
```
User dials *123#

Menu appears:
1. بلّغ عن مشكلة (Report problem)
2. تابع بلاغ (Track report)
3. معلومات (Info)

User selects 1 → Sub-menu:
1. طريق (Road)
2. إنارة (Lighting)
3. نفايات (Waste)
...
```

### SMS Provider Recommendations

| Provider | Pros | Cons | Cost |
|----------|------|------|------|
| **IAM Morocco** | Local, reliable, good coverage | Requires Moroccan entity | ~0.10 MAD/SMS |
| **Twilio** | Easy integration, global | More expensive | ~$0.0075/SMS |
| **Nexmo/Vonage** | Good APIs, reliable | International rates | ~$0.008/SMS |

**Recommendation**: Start with Twilio for prototype, switch to IAM for production.

---

## 🐳 Docker Architecture

### Container Structure

```
madinti-platform/
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt (Python) or package.json (Node)
│   └── src/
├── frontend-dashboard/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── ai-service/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app.py
├── database/
│   └── init.sql (initial schema)
└── docs/
    └── deployment.md
```

### docker-compose.yml (Development)

```yaml
version: '3.8'

services:
  # Database
  postgres:
    image: postgis/postgis:15-3.3
    container_name: madinti-db
    environment:
      POSTGRES_DB: madinti
      POSTGRES_USER: madinti_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - madinti-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U madinti_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: madinti-redis
    ports:
      - "6379:6379"
    networks:
      - madinti-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # Object Storage (MinIO - S3 compatible)
  minio:
    image: minio/minio:latest
    container_name: madinti-storage
    environment:
      MINIO_ROOT_USER: ${MINIO_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD}
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    networks:
      - madinti-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: madinti-backend
    environment:
      DATABASE_URL: postgresql://madinti_user:${DB_PASSWORD}@postgres:5432/madinti
      REDIS_URL: redis://redis:6379/0
      MINIO_ENDPOINT: minio:9000
      MINIO_ACCESS_KEY: ${MINIO_USER}
      MINIO_SECRET_KEY: ${MINIO_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      ENVIRONMENT: development
    volumes:
      - ./backend/src:/app/src
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      minio:
        condition: service_healthy
    networks:
      - madinti-network
    command: python manage.py runserver 0.0.0.0:8000

  # AI Service (separate microservice)
  ai-service:
    build:
      context: ./ai-service
      dockerfile: Dockerfile
    container_name: madinti-ai
    environment:
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      MODEL_PATH: /models  # For self-hosted models
    volumes:
      - ./ai-service:/app
      - ai_models:/models
    ports:
      - "8001:8001"
    networks:
      - madinti-network
    command: uvicorn app:app --host 0.0.0.0 --port 8001

  # Government Dashboard (React)
  dashboard:
    build:
      context: ./frontend-dashboard
      dockerfile: Dockerfile
    container_name: madinti-dashboard
    environment:
      REACT_APP_API_URL: http://localhost:8000/api
    volumes:
      - ./frontend-dashboard/src:/app/src
      - /app/node_modules
    ports:
      - "3000:3000"
    networks:
      - madinti-network
    command: npm start

  # Nginx (Reverse Proxy & Load Balancer)
  nginx:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    container_name: madinti-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - dashboard
    networks:
      - madinti-network

volumes:
  postgres_data:
  minio_data:
  ai_models:

networks:
  madinti-network:
    driver: bridge
```

### Production Considerations

**docker-compose.prod.yml differences:**
- Use production-grade images (no hot-reload)
- Resource limits (CPU, memory)
- Restart policies: `always`
- Health checks more aggressive
- Secrets management (Docker secrets, not env vars)
- Multi-stage builds for smaller images
- Read-only file systems where possible

### Deployment Commands

```bash
# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.prod.yml up -d

# Scale backend (multiple instances)
docker-compose -f docker-compose.prod.yml up -d --scale backend=3

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Stop and remove volumes (CAUTION: deletes data)
docker-compose down -v
```

---

## 📱 Mobile App Technical Details

### React Native Project Structure

```
madinti-mobile/
├── android/               # Android native code
├── ios/                   # iOS native code
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── ReportScreen.js
│   │   ├── MapScreen.js
│   │   ├── ProfileScreen.js
│   │   └── LoginScreen.js
│   ├── components/
│   │   ├── ReportCard.js
│   │   ├── CategoryPicker.js
│   │   ├── CustomButton.js
│   │   └── MapMarker.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── services/
│   │   ├── api.js         # API calls
│   │   ├── auth.js        # Authentication
│   │   ├── geolocation.js
│   │   └── camera.js
│   ├── store/             # Redux
│   │   ├── slices/
│   │   └── store.js
│   ├── utils/
│   │   ├── i18n.js        # Translations
│   │   └── constants.js
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/
├── App.js
└── package.json
```

### Key React Native Libraries

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.0",
    "react-navigation": "^6.0.0",
    "react-native-maps": "^1.10.0",
    "react-native-camera": "^4.2.1",
    "react-native-geolocation-service": "^5.3.1",
    "react-native-image-picker": "^7.0.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "axios": "^1.6.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "react-native-push-notification": "^8.1.1",
    "i18next": "^23.7.0",
    "react-i18next": "^14.0.0",
    "react-native-vector-icons": "^10.0.0"
  }
}
```

### Mobile App Screens

1. **Splash Screen**: Logo animation
2. **Onboarding** (first-time): 3 slides explaining features
3. **Login/Register**: Phone + OTP
4. **Home Screen**: 
   - Big "Report Problem" button
   - Recent reports list
   - Quick stats
5. **Report Screen**:
   - Camera/gallery picker
   - GPS location (editable)
   - Category selection (icons)
   - Description field
   - Submit button
6. **Map Screen**: Interactive map with markers
7. **Report Details**: Full report view
8. **My Reports**: User's report history
9. **Profile/Settings**: 
   - Language toggle
   - Notifications settings
   - About

---

## 🌐 Government Web Dashboard

### Tech Stack
- **Framework**: React + TypeScript
- **Routing**: React Router v6
- **State**: Redux Toolkit
- **UI**: Material-UI (MUI)
- **Maps**: Leaflet.js
- **Charts**: Recharts
- **Forms**: React Hook Form + Yup validation
- **Tables**: Material React Table
- **Export**: jsPDF, xlsx

### Dashboard Pages

1. **Login**: Secure government login
2. **Dashboard Home**:
   - Key metrics cards (total reports, pending, resolved, avg response time)
   - Charts (reports over time, by category, by status)
   - Recent reports table
   - Map overview
3. **Reports List**:
   - Advanced filters (date, status, category, location, priority)
   - Sortable columns
   - Bulk actions
   - Export to CSV/PDF
4. **Report Detail View**:
   - Full report information
   - Photo gallery
   - Map location
   - Timeline of status changes
   - Update status form
   - Add comments/photos
   - Assign to department/user
5. **Map View**:
   - All reports as markers (color-coded by status)
   - Cluster markers when zoomed out
   - Click marker → Report details
   - Filter by category/status
   - Heat map toggle
6. **Analytics**:
   - Performance metrics
   - Department comparison
   - SLA compliance
   - Trend analysis
   - Custom date ranges
7. **User Management** (Admin only):
   - Add/edit government users
   - Role assignment
   - Department management
8. **Settings**:
   - Category management
   - SLA configuration
   - Notification preferences

### Dashboard Features

| Feature | Description |
|---------|-------------|
| **Real-time Updates** | WebSocket for live report updates |
| **Responsive Design** | Works on desktop, tablet, mobile |
| **Dark Mode** | Toggle dark/light theme |
| **Multi-language** | Arabic/French interface |
| **Role-Based Views** | Different dashboards for different roles |
| **Print Reports** | Printable report summaries |
| **Email Notifications** | Alert on high-priority reports |

---

## 🚀 Deployment Strategy

### MVP Deployment (For Competition Demo)

**Platform**: **DigitalOcean Droplet** or **Google Cloud VM**

**Specifications**:
- 4 vCPUs
- 8 GB RAM
- 160 GB SSD
- Cost: ~$40/month

**Steps**:
1. Provision VM
2. Install Docker & Docker Compose
3. Clone repository
4. Configure environment variables
5. Run `docker-compose up -d`
6. Setup SSL certificate (Let's Encrypt)
7. Configure domain (e.g., madinti.ma)

**URLs**:
- Mobile API: `https://api.madinti.ma`
- Dashboard: `https://dashboard.madinti.ma`
- Admin: `https://admin.madinti.ma`

### Production Deployment (Phase 2)

**Platform**: **Kubernetes on Google Cloud** or **AWS EKS**

**Architecture**:
- Auto-scaling (2-10 backend pods)
- Load balancer
- Managed PostgreSQL (Cloud SQL)
- Cloud Storage (S3/GCS)
- CDN for static assets (Cloudflare)
- Multi-region (for disaster recovery)

**CI/CD Pipeline**:
```
GitHub Push → GitHub Actions → Docker Build → Push to Registry →
Deploy to Kubernetes → Health Check → Gradual Rollout
```

---

## 📋 Glossary

### Technical Terms

| Term | Arabic | French | Description |
|------|--------|--------|-------------|
| **API** | واجهة برمجية | Interface de programmation | Application Programming Interface |
| **Backend** | الخلفية | Backend | Server-side application logic |
| **Frontend** | الواجهة الأمامية | Frontend | User-facing interface |
| **Database** | قاعدة البيانات | Base de données | Structured data storage |
| **Docker** | دوكر | Docker | Containerization platform |
| **GPS** | نظام تحديد المواقع | GPS | Geographic positioning system |
| **JWT** | رمز JSON | Jeton JWT | JSON Web Token (authentication) |
| **OTP** | كلمة مرور لمرة واحدة | Mot de passe à usage unique | One-Time Password |
| **PostGIS** | بوست جي آي إس | PostGIS | Geographic database extension |
| **REST API** | واجهة ريست | API REST | RESTful web service |
| **SLA** | اتفاقية مستوى الخدمة | Accord de niveau de service | Service Level Agreement |
| **SMS** | رسالة قصيرة | SMS | Short Message Service |
| **SSL/TLS** | طبقة المنافذ الآمنة | SSL/TLS | Secure communication protocol |
| **USSD** | خدمة بيانات تكميلية | USSD | Unstructured Supplementary Service Data |

### Domain Terms

| Term | Arabic | French | Description |
|------|--------|--------|-------------|
| **Commune** | جماعة | Commune | Municipality (local government) |
| **Prefecture** | عمالة | Préfecture | Urban administrative division |
| **Province** | إقليم | Province | Rural administrative division |
| **Region** | جهة | Région | Regional administrative division |
| **Pothole** | حفرة | Nid-de-poule | Road depression/hole |
| **Street Lighting** | إنارة عمومية | Éclairage public | Public lighting infrastructure |
| **Waste Management** | تدبير النفايات | Gestion des déchets | Garbage/trash management |
| **Infrastructure** | بنية تحتية | Infrastructure | Physical public facilities |
| **Civic Engagement** | المشاركة المدنية | Engagement civique | Citizen participation |

### Report Lifecycle

| Status | Arabic | French | Description |
|--------|--------|--------|-------------|
| **New** | جديد | Nouveau | Report just submitted |
| **Acknowledged** | تم الاطلاع | Pris en compte | Authority has seen the report |
| **In Progress** | قيد المعالجة | En cours | Work has started |
| **Resolved** | تم الحل | Résolu | Problem fixed |
| **Closed** | مغلق | Fermé | Report archived |
| **Rejected** | مرفوض | Rejeté | Not a valid report |
| **Duplicate** | مكرر | Doublon | Already reported |

### Categories

| Category | Arabic | French | Examples |
|----------|--------|--------|----------|
| **Road** | طريق | Route | Potholes, cracks, road damage |
| **Lighting** | إنارة | Éclairage | Broken streetlights, dark areas |
| **Waste** | نفايات | Déchets | Garbage piles, overflowing bins |
| **Water** | ماء | Eau | Leaks, water shortages, quality |
| **Sanitation** | صرف صحي | Assainissement | Sewage, drainage issues |
| **Public Space** | فضاء عمومي | Espace public | Parks, benches, playgrounds |
| **Signage** | لافتات | Signalisation | Road signs, traffic lights |
| **Other** | أخرى | Autre | Uncategorized issues |

---

## 📅 Development Timeline

### Phase 1: MVP (4-6 weeks) - For Competition

| Week | Tasks | Deliverables |
|------|-------|--------------|
| **Week 1** | Setup & Planning | - Docker environment<br>- Database schema<br>- API design<br>- UI mockups |
| **Week 2** | Backend Development | - User authentication<br>- Report CRUD API<br>- Geographic routing<br>- File upload |
| **Week 3** | Mobile App | - UI screens<br>- Camera integration<br>- GPS integration<br>- API integration |
| **Week 4** | Dashboard Web App | - Login page<br>- Report list<br>- Map view<br>- Status updates |
| **Week 5** | AI Integration | - OpenAI Vision API<br>- Category prediction<br>- Testing |
| **Week 6** | Testing & Polish | - Bug fixes<br>- Performance optimization<br>- Demo data<br>- Presentation materials |

### Competition Deliverables (March 13, 2026)

- ✅ Working mobile app (iOS/Android)
- ✅ Functional government dashboard
- ✅ AI-powered categorization demo
- ✅ Live demo with sample data
- ✅ Presentation deck (Arabic/French)
- ✅ Video demo (2-3 minutes)
- ✅ Technical documentation
- ✅ Security features demonstrated

### Phase 2: Post-Competition (2-3 months)

- Enhanced features
- SMS integration
- Production deployment
- Real government pilot program
- User testing with citizens

### Phase 3: Scaling (6+ months)

- Multi-city support
- Advanced analytics
- Integration with existing government systems
- Full production launch

---

## 💰 Budget Estimation

### MVP Development (For Competition)

| Item | Cost (USD) | Notes |
|------|------------|-------|
| **Development** | $0 | Team effort |
| **Cloud Hosting** | $40/month | DigitalOcean droplet |
| **Domain Name** | $15/year | .ma domain |
| **SSL Certificate** | $0 | Let's Encrypt (free) |
| **OpenAI API** | $5 | ~500 classifications |
| **SMS Testing** | $10 | Twilio credits |
| **Total (3 months)** | **$150** | Minimal investment |

### Production Budget (Year 1)

| Item | Cost (USD/year) | Notes |
|------|----------------|-------|
| **Cloud Infrastructure** | $2,400 | $200/month |
| **Domain + SSL** | $100 | |
| **SMS Gateway** | $600 | ~5000 SMS/year at $0.10 |
| **AI API (OpenAI)** | $500 | ~50,000 classifications |
| **Monitoring Tools** | $300 | Sentry, monitoring |
| **Backup Storage** | $200 | |
| **Contingency** | $500 | |
| **Total Year 1** | **$4,600** | |

### Potential Funding Sources

1. **Competition Prize**: Hack ton Futur prizes
2. **Government Grant**: Ministry of Interior/Digital Morocco
3. **International Donors**: World Bank, USAID civic tech programs
4. **Corporate Sponsors**: Local telecom companies (IAM, Orange)
5. **Freemium Model**: Free for citizens, charge cities for dashboard

---

## 🎯 Success Metrics (KPIs)

### User Engagement

- Number of registered users
- Reports submitted per week
- Active users (monthly)
- Report completion rate
- App retention rate (30-day)

### Government Efficiency

- Average response time (acknowledgment)
- Average resolution time
- % of reports resolved
- SLA compliance rate
- Citizen satisfaction rating

### Technical Performance

- API uptime (target: 99.9%)
- Average API response time
- Mobile app crash rate
- Report submission success rate

### Social Impact

- Infrastructure problems resolved
- Citizen awareness increase
- Media mentions
- Government adoption rate

---

## 🚨 Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Low government adoption** | Medium | High | Early engagement with municipal officials, pilot program |
| **Poor internet in rural areas** | High | Medium | SMS alternative, offline mode |
| **Spam/abuse reports** | Medium | Medium | Rate limiting, moderation, verification |
| **Privacy concerns** | Low | High | Strong encryption, anonymization options |
| **Funding shortage** | Medium | Medium | Open-source, seek grants, minimal infrastructure |
| **Technical complexity** | Low | Medium | Use proven tech stack, good documentation |
| **User adoption** | Medium | High | User education, simple UX, marketing campaign |

---

## 📚 Resources & References

### Open Data Sources

- [Morocco OpenData Portal](https://data.gov.ma)
- [OpenStreetMap Morocco](https://www.openstreetmap.org/relation/3630439)
- Administrative boundaries: [GADM](https://gadm.org/download_country_v3.html)

### Similar Platforms (Inspiration)

- **SeeClickFix** (USA): Civic reporting platform
- **FixMyStreet** (UK): Infrastructure reporting
- **Baladiyati** (Tunisia): Municipal services app
- **Cityzens** (Morocco): Citizen engagement (if exists)

### Technical Documentation

- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Native Docs](https://reactnative.dev/)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [Docker Documentation](https://docs.docker.com/)
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision)

###Legal Framework

- Morocco Data Protection Law 09-08
- Municipal Charter (Law 113-14)
- Territorial Organization Law

---

## 🎤 Competition Presentation Strategy

### Pitch Structure (7-8 minutes)

1. **The Problem** (1.5 min)
   - Show photos of infrastructure issues in Sidi Slimane
   - Statistics: How many cities face this?
   - Personal story: "Ahmed's bike broke from a pothole..."

2. **Our Solution: مدينتي** (1 min)
   - One sentence: "A bridge between citizens and government"
   - Show app mockup

3. **Live Demo** (3 min)
   - **Mobile App**: Submit a report (pre-recorded video or live)
     - Take photo → GPS → AI categorizes → Submit
   - **Dashboard**: Show government view
     - See report appear on map
     - Update status to "In Progress"
   - **Citizen App**: Show notification received

4. **Innovation & Impact** (1.5 min)
   - **AI**: Automatic categorization
   - **Security**: Encrypted, GDPR-compliant
   - **Accessibility**: SMS for non-smartphone users
   - **Scalability**: Docker, cloud-ready
   - **Impact**: Better cities, empowered youth

5. **Future Vision** (1 min)
   - Expand to all Moroccan cities
   - Partner with Ministry of Interior
   - Open API for other civic tech
   - Youth civic engagement metric

6. **Q&A** (Time permitting)

### Demo Video Script (2 minutes)

```
[Scene 1: Problem - 15 sec]
- Show photos of potholes, broken lights, garbage
- Voiceover (Arabic): "كل يوم نرى مشاكل في مدينتنا..." 
  (Every day we see problems in our city...)

[Scene 2: Solution - 15 sec]
- Introduce Madinti app
- "الحل في جيبك" (The solution in your pocket)

[Scene 3: Citizen Demo - 45 sec]
- Open app
- Click "Report"
- Take photo of pothole
- AI automatically suggests "Road - Pothole"
- GPS shows location
- Submit
- Success message

[Scene 4: Government Dashboard - 30 sec]
- Dashboard shows new report on map
- Official reviews photo
- Updates status to "In Progress"
- Assigns to Public Works Department

[Scene 5: Impact - 15 sec]
- Show before/after photos
- Statistics: "47 issues resolved this month"
- Citizens celebrating

[End: Call to action]
- "Join us in building better cities"
- Team photo + contact info
```

---

## 👥 Team Recommendations

For the competition (3-5 students, gender parity):

**Ideal Team (5 members)**:
1. **Project Lead** (M/F): Coordination, presentation
2. **Backend Developer** (M/F): API, database, security
3. **Frontend Developer** (M/F): Mobile app (React Native)
4. **UI/UX Designer** (M/F): Design, user experience
5. **Data/AI Specialist** (M/F): AI integration, analytics

**Roles can overlap** - The key is having:
- At least 1 person comfortable with coding
- At least 1 person good at design/presentation
- At least 1 person who understands local government (for research)

---

## ✅ Next Steps - Action Plan

### Immediate (This Week)

1. **Team Formation**:
   - [ ] Recruit 2-4 teammates (ensure gender parity)
   - [ ] Assign roles based on skills

2. **Registration**:
   - [ ] Register on www.hacktonfutur.com
   - [ ] Submit project via http://bit.ly/4od5yWY
   - [ ] Notify provincial coordinator

3. **Initial Planning**:
   - [ ] Review this specification document as a team
   - [ ] Decide on MVP features (use Phase 1 list)
   - [ ] Choose tech stack (recommendation: stick to suggested)

### Setup Phase (Week 1-2)

4. **Development Environment**:
   - [ ] Setup Docker on development machines
   - [ ] Create GitHub repository
   - [ ] Initialize projects (backend, mobile, dashboard)
   - [ ] Setup database schema

5. **Design Phase**:
   - [ ] Create UI mockups (Figma)
   - [ ] Define color scheme (Moroccan flag colors? Modern?)
   - [ ] Design app icon and logo

### Development (Week 3-5)

6. **Build MVP**:
   - [ ] Follow week-by-week timeline in this document
   - [ ] Weekly team meetings for progress
   - [ ] Test frequently

### Final Preparation (Week 6)

7. **Polish & Present**:
   - [ ] Create presentation deck
   - [ ] Record demo video
   - [ ] Prepare for Q&A
   - [ ] Submit by March 13, 2026

---

## 📞 Support & Questions

If you have questions while building Madinti:

1. **Technical Issues**: Check Docker docs, Stack Overflow
2. **Competition Rules**: Contact Hack ton Futur organizers
3. **Local Government**: Reach out to Sidi Slimane commune
4. **This Document**: Review relevant sections

---

## 🏆 Conclusion

**Madinti** is more than just an app - it's a movement to empower Moroccan citizens to actively participate in improving their communities. By combining cutting-edge AI technology, robust security, and accessible design, we're creating a platform that bridges the gap between citizens and government.

This comprehensive specification provides everything you need to build a competition-winning prototype and eventually scale to a production system serving all of Morocco.

**Good luck with Hack ton Futur 2026! 🇲🇦🚀**

---

*Document Version: 1.0*  
*Last Updated: January 8, 2026*  
*Prepared for: Hack ton Futur 2026 - Sidi Slimane Team*
