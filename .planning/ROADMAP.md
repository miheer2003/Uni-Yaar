# Roadmap: UniYaar

## Overview

UniYaar is built in 12 structured phases delivering a full-stack, enterprise-grade university companion platform. The roadmap moves from monorepo foundation and layered Spring Boot / React setup, through core campus spatial modeling, interactive Leaflet mapping, faculty schedule discovery, food/canteen menus, event hubs, real-time maintenance trust engine, alerts/search, up to the comprehensive role-based admin console and rich realistic seed data.

## Phases

- [ ] **Phase 1: Project Architecture & Monorepo Foundation** - Spring Boot 3 (Java 21) backend with MySQL, Vite + React + TS frontend, Tailwind CSS, Material UI, centralized error handling, and health check.
- [ ] **Phase 2: Authentication & Role-Based Access Control** - JWT authentication, BCrypt password encryption, Spring Security filter chain, role-based protection (Student, Faculty, Staff, Admin), and frontend auth session management.
- [ ] **Phase 3: Campus Spatial Hierarchy & Location APIs** - Normalized data model for University → Department, Building, Floor, Room, and Facility with strict DTO validation, pagination, and multi-tenant design.
- [ ] **Phase 4: Interactive Campus Map & Navigation Engine** - Leaflet + OpenStreetMap engine with custom marker layers, category filters, interactive location drawers, and walking route navigation.
- [ ] **Phase 5: Faculty Finder & Scheduled Timetables** - Faculty directory search by name/department/subject, detailed profile cards with office rooms, weekly scheduled timetables, and map navigation links.
- [ ] **Phase 6: Food & Mess Module** - Food facilities directory (Mess/Canteen/Cafeteria), daily meal tabs (Breakfast, Lunch, Snacks, Dinner), dietary filters (Veg/Non-Veg/Jain), and live opening status.
- [ ] **Phase 7: Events & Hackathons Hub** - Campus events directory with categories (Hackathons, Workshops, Cultural, Sports), detail cards with room venue linkage, registration deadline tracking, and date filters.
- [ ] **Phase 8: Facility Maintenance & Issue Reporting Engine** - Facility status tracking (OPEN, CLOSED, UNDER_MAINTENANCE), alternative facility recommendation with map routing, student issue reporting form with photo upload, and moderation workflow.
- [ ] **Phase 9: Announcements & In-App Notification Center** - Multi-category prioritized announcements (LOW to URGENT), in-app notification center for alerts and deadlines, and read/dismiss tracking.
- [ ] **Phase 10: Global UniYaar Search & Personal Bookmarks** - Unified debounced global search API and Cmd+K spotlight modal across all entities, plus "My UniYaar" personalized bookmarks.
- [ ] **Phase 11: Enterprise Admin Dashboard & Management Console** - Role-protected admin command center with KPI metrics, paginated CRUD management tables, and issue review moderation queue.
- [ ] **Phase 12: Production Seeding, Verification & Polishing** - Comprehensive realistic seed dataset (5+ buildings, 15+ faculty, food menus, 10+ events, facilities), landing page hero experience, automated API tests, and documentation.

## Phase Details

### Phase 1: Project Architecture & Monorepo Foundation
**Goal**: Establish clean backend and frontend architectures with Docker/MySQL configuration, Java 21 Spring Boot foundation, and modern React setup.
**Depends on**: Nothing
**Requirements**: ARCH-01, ARCH-02, ARCH-03, ARCH-04
**Success Criteria**:
  1. Backend starts cleanly with Spring Boot 3 on Java 21 connected to MySQL with Hibernate auto-DDL.
  2. Frontend starts on Vite + React + TypeScript with Tailwind CSS and Material UI icons working seamlessly.
  3. Base API ping endpoint returns standardized JSON error and success payloads with timestamp and status.
**Plans**: 2 plans

Plans:
- [ ] 01-01: Initialize Spring Boot 3 backend (Maven, Java 21, Spring Web, Data JPA, Validation, MySQL connector) with layered architecture and `@RestControllerAdvice`.
- [ ] 01-02: Initialize Vite + React + TypeScript frontend with Tailwind CSS, Material UI, Framer Motion, Axios client, and main layout scaffolding.

### Phase 2: Authentication & Role-Based Access Control
**Goal**: Secure identity and permission system across backend and frontend.
**Depends on**: Phase 1
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04
**Success Criteria**:
  1. User can register as student and login to receive signed JWT token.
  2. Spring Security restricts endpoints based on roles (`ROLE_STUDENT`, `ROLE_FACULTY`, `ROLE_STAFF`, `ROLE_ADMIN`).
  3. Frontend maintains session state across page refreshes and exposes protected routes.
**Plans**: 2 plans

Plans:
- [ ] 02-01: Backend Spring Security configuration, User entity, BCrypt hashing, JWT filter, AuthController, and DTOs.
- [ ] 02-02: Frontend authentication context, login/register modal/pages, persistent tokens, and route guards.

### Phase 3: Campus Spatial Hierarchy & Location APIs
**Goal**: Core relational domain model for campus entities from universities down to specific rooms.
**Depends on**: Phase 2
**Requirements**: LOC-01, LOC-02, LOC-03, LOC-04
**Success Criteria**:
  1. Complete University → Building → Floor → Room relational schema enforced with foreign keys.
  2. REST endpoints return paginated buildings, floors, and rooms with DTO responses.
  3. Geolocation coordinates (latitude, longitude) and room types properly validated and queried.
**Plans**: 2 plans

Plans:
- [ ] 03-01: Backend entities, repositories, services, and controllers for University, Department, Building, Floor, and Room.
- [ ] 03-02: Frontend building/room browser views with search, filters, and floor plan navigation cards.

### Phase 4: Interactive Campus Map & Navigation Engine
**Goal**: Interactive campus map visualizer with location markers, categories, and walking routes.
**Depends on**: Phase 3
**Requirements**: MAP-01, MAP-02, MAP-03, MAP-04
**Success Criteria**:
  1. Leaflet map renders campus OpenStreetMap tiles smoothly with custom colored markers.
  2. Category pills (Buildings, Food, Faculty, Events, Facilities, Washrooms) filter map markers dynamically.
  3. Clicking any marker reveals rich details drawer with "Navigate" action that computes and draws walking route.
**Plans**: 2 plans

Plans:
- [ ] 04-01: Leaflet integration, custom marker rendering, category filtering, and location drawer.
- [ ] 04-02: Route calculation engine displaying visual walking path between origin and destination with distance/time estimation.

### Phase 5: Faculty Finder & Scheduled Timetables
**Goal**: Searchable faculty directory with office locations and scheduled lecture timetables.
**Depends on**: Phase 3, Phase 4
**Requirements**: FAC-01, FAC-02, FAC-03, FAC-04
**Success Criteria**:
  1. Faculty directory searchable by name, department, designation, and subject.
  2. Profile view displays office room, official contact, and weekly timetable labeled clearly as "Scheduled Location".
  3. Direct "View on Map" action navigates user to the faculty office or scheduled room.
**Plans**: 2 plans

Plans:
- [ ] 05-01: Backend Faculty and Timetable entities, repositories, DTOs, and REST endpoints.
- [ ] 05-02: Frontend Faculty Finder page with search bar, department filters, faculty profile view, and timetable grid.

### Phase 6: Food & Mess Module
**Goal**: Real-time campus food discovery with daily mess menus and canteen opening hours.
**Depends on**: Phase 3
**Requirements**: FOOD-01, FOOD-02, FOOD-03, FOOD-04
**Success Criteria**:
  1. Displays campus food spots (Mess, Canteen, Cafeteria) with live open/closed status indicator.
  2. Daily menu view segmented by Breakfast, Lunch, Snacks, and Dinner with date selector.
  3. Dietary tags (Veg, Non-Veg, Jain) filter menu items accurately.
**Plans**: 2 plans

Plans:
- [ ] 06-01: Backend FoodFacility, Menu, and MenuItem entities, repositories, and REST endpoints.
- [ ] 06-02: Frontend "Khane Ka Kya Scene Hai?" food page with tabs, meal cards, dietary badges, and map linkage.

### Phase 7: Events & Hackathons Hub
**Goal**: Campus event discovery platform with venue linkage and registration deadlines.
**Depends on**: Phase 3, Phase 4
**Requirements**: EVT-01, EVT-02, EVT-03, EVT-04
**Success Criteria**:
  1. Events directory categorizes hackathons, workshops, cultural, and sports events.
  2. Event detail view shows venue room, organizer, schedule, and registration countdown/link.
  3. User can filter events by Today, This Week, or category with direct venue map navigation.
**Plans**: 2 plans

Plans:
- [ ] 07-01: Backend Event entity, DTOs, repository, and REST endpoints with date/category filters.
- [ ] 07-02: Frontend Events page with banner cards, category pills, registration modal, and venue map view.

### Phase 8: Facility Maintenance & Issue Reporting Engine
**Goal**: Live facility availability tracking, alternative recommendations, and student issue reporting workflow.
**Depends on**: Phase 3, Phase 4
**Requirements**: FACIL-01, FACIL-02, FACIL-03, FACIL-04, ISSUE-01, ISSUE-02, ISSUE-03, ISSUE-04
**Success Criteria**:
  1. Facilities display live statuses (`OPEN`, `CLOSED`, `UNDER_MAINTENANCE`, `TEMPORARILY_UNAVAILABLE`).
  2. Under-maintenance facilities recommend available alternatives with one-click "Navigate to Alternative" button.
  3. Students can submit issue reports with photo, category, and location; reports follow `PENDING` → `UNDER_REVIEW` → `RESOLVED` lifecycle.
**Plans**: 2 plans

Plans:
- [ ] 08-01: Backend Facility, Maintenance, and IssueReport entities, repositories, and status change endpoints.
- [ ] 08-02: Frontend Facility status directory, alternative route suggestion, and student problem reporting form with submission tracking.

### Phase 9: Announcements & In-App Notification Center
**Goal**: Centralized campus announcements and real-time student alert notifications.
**Depends on**: Phase 2
**Requirements**: NOTIF-01, NOTIF-02, NOTIF-03
**Success Criteria**:
  1. Announcements organized by category and priority (`LOW`, `NORMAL`, `HIGH`, `URGENT`) with clear visual styling.
  2. Notifications drawer alerts users to maintenance updates, event reminders, and emergency broadcasts.
  3. Notification read/unread state persists per user.
**Plans**: 2 plans

Plans:
- [ ] 09-01: Backend Announcement and Notification models, services, DTOs, and REST endpoints.
- [ ] 09-02: Frontend announcement banners, priority badges, and interactive notifications dropdown.

### Phase 10: Global UniYaar Search & Personal Bookmarks
**Goal**: Unified debounced search across all university entities and personal bookmarks.
**Depends on**: Phase 3, Phase 5, Phase 6, Phase 7, Phase 8
**Requirements**: SRCH-01, SRCH-02, BKMK-01, BKMK-02
**Success Criteria**:
  1. Single `GET /api/search?q=...` returns aggregated results across buildings, rooms, faculty, food, events, and facilities.
  2. Frontend `Cmd+K` global search modal provides instantaneous search with category jump links.
  3. Users can bookmark any entity to appear in their personalized "My UniYaar" dashboard.
**Plans**: 2 plans

Plans:
- [ ] 10-01: Backend unified SearchService and Bookmark entity/controller with multi-entity lookup.
- [ ] 10-02: Frontend global search spotlight modal (`Cmd+K`), recent search history, and "My UniYaar" bookmark collection.

### Phase 11: Enterprise Admin Dashboard & Management Console
**Goal**: Comprehensive administrative console for campus data management, menu publishing, and report moderation.
**Depends on**: Phase 2, Phase 3, Phase 6, Phase 7, Phase 8
**Requirements**: ADMIN-01, ADMIN-02, ADMIN-03
**Success Criteria**:
  1. Admin dashboard visualizes university summary statistics (students, buildings, active issues, upcoming events).
  2. Data tables support sorting, searching, pagination, and CRUD for buildings, rooms, faculty, menus, and events.
  3. Staff/Admin moderation queue enables reviewing student issue reports and publishing official maintenance alerts.
**Plans**: 2 plans

Plans:
- [ ] 11-01: Admin backend endpoints for campus KPI metrics and bulk administrative operations.
- [ ] 11-02: Frontend Admin Dashboard layout with sidebar, analytics overview, data management tables, and report moderation queue.

### Phase 12: Production Seeding, Verification & Polishing
**Goal**: Populate rich realistic demo data, build the marketing landing page, verify all end-to-end user journeys, and document the project.
**Depends on**: Phase 1 through 11
**Requirements**: SEED-01
**Success Criteria**:
  1. Database seeder loads 5+ buildings (e.g. SOFA Building, Innovation Centre, Ramanujan Block), 15+ faculty with timetables, 3+ food outlets with menus, 10+ events, and facilities.
  2. Polished marketing landing page with "Apni Uni. Apna Yaar." hero, feature highlights, and interactive preview.
  3. Complete user journey passes verification: Search "SOFA" → Navigate → Find Prof schedule → Check lunch menu → Inspect AI Hackathon → Check washroom maintenance alternative.
  4. Comprehensive documentation in `README.md` and `/docs` covering architecture, database schema, and API specs.
**Plans**: 2 plans

Plans:
- [ ] 12-01: Database seeder runner with realistic fictional campus dataset and backend automated test suite.
- [ ] 12-02: Marketing landing page, student dashboard integration, full user journey testing, and complete architecture documentation.

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Architecture & Monorepo Foundation | 0/2 | Not started | - |
| 2. Authentication & Role-Based Access Control | 0/2 | Not started | - |
| 3. Campus Spatial Hierarchy & Location APIs | 0/2 | Not started | - |
| 4. Interactive Campus Map & Navigation Engine | 0/2 | Not started | - |
| 5. Faculty Finder & Scheduled Timetables | 0/2 | Not started | - |
| 6. Food & Mess Module | 0/2 | Not started | - |
| 7. Events & Hackathons Hub | 0/2 | Not started | - |
| 8. Facility Maintenance & Issue Reporting Engine | 0/2 | Not started | - |
| 9. Announcements & In-App Notification Center | 0/2 | Not started | - |
| 10. Global UniYaar Search & Personal Bookmarks | 0/2 | Not started | - |
| 11. Enterprise Admin Dashboard & Management Console | 0/2 | Not started | - |
| 12. Production Seeding, Verification & Polishing | 0/2 | Not started | - |
