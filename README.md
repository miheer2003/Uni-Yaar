# UniYaar - Smart University Companion Platform

> **Apni Uni. Apna Yaar.** — Your Campus, Simplified.

UniYaar is a production-quality, modern smart university companion platform built with Spring Boot (Java 21), MySQL, React/Vite, TypeScript, Tailwind CSS, and Leaflet maps. It unifies fragmented campus information—buildings, rooms, faculty schedules, mess menus, events, maintenance alerts, issue reporting, and navigation—into a single intuitive interface.

## 🎯 Core Value

Students can instantly discover where campus resources, people, food, and events are, verify their real-time availability/maintenance status, and navigate to them without friction.

## 🛠️ Tech Stack

### Backend
- **Java 21** with **Spring Boot 3.3.x**
- **Spring Web** - RESTful APIs
- **Spring Data JPA** - Data persistence with Hibernate
- **MySQL** - Relational database
- **Bean Validation** - Input validation
- **Lombok** - Boilerplate reduction

### Frontend
- **React 18** with **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Leaflet** - Interactive maps

## 📁 Project Structure

```
Uni-Yarr/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/uniyar/
│   │   │   │   ├── controller/     # REST controllers
│   │   │   │   ├── dto/           # Data Transfer Objects
│   │   │   │   ├── exception/     # Exception handling
│   │   │   │   └── UniYaarApplication.java
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   └── pom.xml
├── frontend/                # React frontend
│   ├── src/
│   │   ├── api/            # API client
│   │   ├── components/     # React components
│   │   │   └── layout/     # Layout components
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Java 21** (OpenJDK recommended)
- **Node.js 18+** and npm
- **MySQL 8.0+**

### Backend Setup

1. Ensure MySQL is running locally
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Build and run:
   ```bash
   export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
   ./mvnw spring-boot:run
   ```
4. The backend will start on `http://localhost:8080`
5. Test the health endpoint: `GET /api/health`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The frontend will start on `http://localhost:3000`

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check endpoint |
| `/api/` | GET | Root welcome endpoint |

### Response Format

All API responses follow a standardized format:

```json
{
  "timestamp": "2026-09-23T02:00:00",
  "success": true,
  "status": 200,
  "message": "Request successful",
  "data": { ... }
}
```

## 🎨 Design System

UniYaar uses a modern, Gen-Z friendly design with:
- **Primary Color**: Saffron/Amber (#f59e0b)
- **Accent Color**: Deep Orange (#ea580c)
- **Background**: Deep Slate (#0f172a)
- **Success**: Emerald (#10b981)

## 📋 Roadmap

- [x] **Phase 1**: Project Architecture & Monorepo Foundation
- [ ] **Phase 2**: Authentication & Role-Based Access Control
- [ ] **Phase 3**: Campus Spatial Hierarchy & Location APIs
- [ ] **Phase 4**: Interactive Campus Map & Navigation Engine
- [ ] **Phase 5**: Faculty Finder & Scheduled Timetables
- [ ] **Phase 6**: Food & Mess Module
- [ ] **Phase 7**: Events & Hackathons Hub
- [ ] **Phase 8**: Facility Maintenance & Issue Reporting Engine
- [ ] **Phase 9**: Announcements & In-App Notification Center
- [ ] **Phase 10**: Global UniYaar Search & Personal Bookmarks
- [ ] **Phase 11**: Enterprise Admin Dashboard & Management Console
- [ ] **Phase 12**: Production Seeding, Verification & Polishing

## 📝 License

This project is built for educational and demonstration purposes.

---

Built with ❤️ for students. **UniYaar - Apni Uni. Apna Yaar.**
