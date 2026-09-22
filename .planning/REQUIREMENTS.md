# Requirements: UniYaar

**Defined:** 2026-09-23
**Core Value:** Students can instantly discover where campus resources, people, food, and events are, verify their real-time availability/maintenance status, and navigate to them without friction.

## v1 Requirements

### Architecture & Setup
- [ ] **ARCH-01**: Backend Spring Boot 3 / Java 21 project with JPA, Hibernate, MySQL, and layered architecture (Controller → Service → Repository).
- [ ] **ARCH-02**: Frontend Vite + React + TypeScript project with Tailwind CSS, Material UI icons, Framer Motion, and Axios API client.
- [ ] **ARCH-03**: Centralized REST error handling with `@RestControllerAdvice` and standard error payload.
- [ ] **ARCH-04**: Strict DTO request and response models with Bean Validation (`@NotNull`, `@NotBlank`, etc.) separating API contract from JPA entities.

### Authentication & Authorization
- [ ] **AUTH-01**: User registration and login with BCrypt password hashing and JWT token issuance.
- [ ] **AUTH-02**: Role-based access control with `ROLE_STUDENT`, `ROLE_FACULTY`, `ROLE_STAFF`, and `ROLE_ADMIN`.
- [ ] **AUTH-03**: Secure Spring Security filter chain enforcing protected admin/staff routes while allowing public read access where appropriate.
- [ ] **AUTH-04**: User profile retrieval and persistence of user session in frontend auth state.

### Campus Hierarchy & Locations
- [ ] **LOC-01**: Normalized relational model for University → Department, Building, Floor, Room, and Facility.
- [ ] **LOC-02**: Building REST endpoints with geo-coordinates (latitude/longitude), address, code, and nested floor/room listings.
- [ ] **LOC-03**: Room model supporting types (Classroom, Lab, Faculty Office, Hall, Auditorium) and capacity.
- [ ] **LOC-04**: Multi-university support ensuring all campus assets associate with a parent university entity.

### Interactive Campus Map
- [ ] **MAP-01**: Interactive Leaflet + OpenStreetMap component centered on campus with pan, zoom, and location markers.
- [ ] **MAP-02**: Map category filters (Buildings, Canteens/Mess, Faculty Offices, Events, Facilities, Washrooms).
- [ ] **MAP-03**: Marker interactive popup/drawer with building details, floors, rooms, and current facility statuses.
- [ ] **MAP-04**: Route/navigation overlay guiding students between campus origin (or current location if permitted) and destination.

### Faculty Finder & Timetable
- [ ] **FAC-01**: Search faculty by name, department, designation, and subject.
- [ ] **FAC-02**: Faculty profile with office location (building, floor, room) and official contact details.
- [ ] **FAC-03**: Weekly timetable showing scheduled lecture locations (Day, Time, Subject, Room) with clear "Scheduled Location" indicator.
- [ ] **FAC-04**: "View on Map" direct action linking faculty office/scheduled room to campus map.

### Food & Mess Module
- [ ] **FOOD-01**: Food facilities directory (Mess, Canteen, Cafeteria, Food Stall) with location, operating hours, and live open/closed status.
- [ ] **FOOD-02**: Daily menu view categorized into Breakfast, Lunch, Snacks, and Dinner with date picker (Today/Tomorrow).
- [ ] **FOOD-03**: Dietary tags (Veg, Non-Veg, Jain, Special) and dietary filters.
- [ ] **FOOD-04**: Authorized staff menu update REST endpoints.

### Events & Hackathons
- [ ] **EVT-01**: Campus event discovery with categories (Hackathon, Workshop, Cultural, Sports, Technical, Seminar).
- [ ] **EVT-02**: Event card and detail view with date, time, banner image, organizer, capacity, and linked venue room.
- [ ] **EVT-03**: Registration deadline indicator and external/internal registration link handling.
- [ ] **EVT-04**: Event filters by date (Today, Tomorrow, This Week) and category.

### Campus Facilities & Maintenance System
- [ ] **FACIL-01**: Directory of campus facilities (Washrooms, Water Dispensers, ATMs, Libraries, Labs, Sports Grounds, Parking).
- [ ] **FACIL-02**: Real-time status tracking: `OPEN`, `CLOSED`, `UNDER_MAINTENANCE`, `TEMPORARILY_UNAVAILABLE`.
- [ ] **FACIL-03**: Maintenance detail view showing last updated time, reason, and automated recommendation of alternative nearby facility.
- [ ] **FACIL-04**: "Navigate to Alternative" direct map routing action for out-of-order facilities.

### Issue Reporting Workflow
- [ ] **ISSUE-01**: Student issue report submission form with category, location description, room linkage, and optional image upload.
- [ ] **ISSUE-02**: Trust model lifecycle: `PENDING` → `UNDER_REVIEW` → `RESOLVED` / `REJECTED`.
- [ ] **ISSUE-03**: Admin/staff review portal allowing approval/rejection and optional promotion of verified reports to official maintenance status.
- [ ] **ISSUE-04**: Student "My Reports" tracking view showing submission history and status updates.

### Announcements & Notifications
- [ ] **NOTIF-01**: University & department announcements with priority levels (`LOW`, `NORMAL`, `HIGH`, `URGENT`) and expiry dates.
- [ ] **NOTIF-02**: In-app notification center for alerts, event reminders, and status changes.
- [ ] **NOTIF-03**: Mark as read and dismiss notifications functionality.

### Global Search & Bookmarks
- [ ] **SRCH-01**: Unified debounced search API (`GET /api/search?q=...`) returning categorized results (Buildings, Rooms, Faculty, Food, Events, Facilities).
- [ ] **SRCH-02**: Frontend global search bar with keyboard shortcut (`Cmd/Ctrl + K`), category badges, and quick jump navigation.
- [ ] **BKMK-01**: Bookmark toggle for buildings, faculty, food spots, and events.
- [ ] **BKMK-02**: "My UniYaar" personalized dashboard displaying saved bookmarks and quick shortcuts.

### Admin Dashboard & Seed Data
- [ ] **ADMIN-01**: Admin dashboard with campus summary metrics (students, faculty, buildings, active issues, upcoming events).
- [ ] **ADMIN-02**: Management tables with pagination, search, sorting, and CRUD for buildings, rooms, faculty, menus, and events.
- [ ] **ADMIN-03**: Issue moderation queue for reviewing student reports.
- [ ] **SEED-01**: Database seeder populating realistic demo university data (5+ buildings, floors, rooms, 15+ faculty with schedules, 3+ food outlets with menus, 10+ events, and facilities).

## v2 Requirements

### YaarAI & Advanced Positioning
- **AI-01**: YaarAI conversational assistant integrating Spring AI/LLM with verified campus database retrieval (RAG).
- **NAV-01**: Indoor walking path graph with Dijkstra/A* pathfinding for multi-floor building indoor routing.
- **NAV-02**: QR-code scan at building entrances to initiate step-by-step indoor routing.
- **PUSH-01**: Web Push and SMS notifications for urgent campus alerts.
- **LANG-01**: Multi-lingual interface supporting Hindi and Marathi localization.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Live GPS tracking of faculty | Privacy violation; scheduled timetable location is accurate and ethical |
| Unmoderated student status alerts | High risk of false alarms; requires staff approval before official status update |
| Proprietary map API keys (Google Maps paid tier) | Leaflet + OpenStreetMap provides complete freedom and self-hosted control |
| Native iOS/Android app store packages | Mobile-first responsive web app satisfies all immediate student use cases |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ARCH-01 | Phase 1 | Pending |
| ARCH-02 | Phase 1 | Pending |
| ARCH-03 | Phase 1 | Pending |
| ARCH-04 | Phase 1 | Pending |
| AUTH-01 | Phase 2 | Pending |
| AUTH-02 | Phase 2 | Pending |
| AUTH-03 | Phase 2 | Pending |
| AUTH-04 | Phase 2 | Pending |
| LOC-01 | Phase 3 | Pending |
| LOC-02 | Phase 3 | Pending |
| LOC-03 | Phase 3 | Pending |
| LOC-04 | Phase 3 | Pending |
| MAP-01 | Phase 4 | Pending |
| MAP-02 | Phase 4 | Pending |
| MAP-03 | Phase 4 | Pending |
| MAP-04 | Phase 4 | Pending |
| FAC-01 | Phase 5 | Pending |
| FAC-02 | Phase 5 | Pending |
| FAC-03 | Phase 5 | Pending |
| FAC-04 | Phase 5 | Pending |
| FOOD-01 | Phase 6 | Pending |
| FOOD-02 | Phase 6 | Pending |
| FOOD-03 | Phase 6 | Pending |
| FOOD-04 | Phase 6 | Pending |
| EVT-01 | Phase 7 | Pending |
| EVT-02 | Phase 7 | Pending |
| EVT-03 | Phase 7 | Pending |
| EVT-04 | Phase 7 | Pending |
| FACIL-01 | Phase 8 | Pending |
| FACIL-02 | Phase 8 | Pending |
| FACIL-03 | Phase 8 | Pending |
| FACIL-04 | Phase 8 | Pending |
| ISSUE-01 | Phase 8 | Pending |
| ISSUE-02 | Phase 8 | Pending |
| ISSUE-03 | Phase 8 | Pending |
| ISSUE-04 | Phase 8 | Pending |
| NOTIF-01 | Phase 9 | Pending |
| NOTIF-02 | Phase 9 | Pending |
| NOTIF-03 | Phase 9 | Pending |
| SRCH-01 | Phase 10 | Pending |
| SRCH-02 | Phase 10 | Pending |
| BKMK-01 | Phase 10 | Pending |
| BKMK-02 | Phase 10 | Pending |
| ADMIN-01 | Phase 11 | Pending |
| ADMIN-02 | Phase 11 | Pending |
| ADMIN-03 | Phase 11 | Pending |
| SEED-01 | Phase 12 | Pending |

**Coverage:**
- v1 requirements: 43 total
- Mapped to phases: 43
- Unmapped: 0 ✓

---
*Requirements defined: 2026-09-23*
*Last updated: 2026-09-23 after initial definition*
