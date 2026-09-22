# UniYaar ("Apni Uni. Apna Yaar.")

## What This Is

UniYaar is a production-quality, modern smart university companion platform built with Spring Boot (Java 21), MySQL, React/Vite, TypeScript, Tailwind CSS, and Leaflet maps. Designed with a clean Gen-Z / Indian startup aesthetic ("Your campus friend who knows the campus"), it unifies fragmented campus information—buildings, rooms, faculty schedules, mess menus, events, maintenance alerts, issue reporting, and navigation—into a single intuitive interface.

## Core Value

Students can instantly discover where campus resources, people, food, and events are, verify their real-time availability/maintenance status, and navigate to them without friction.

## Business Context

- **Customer**: University students, faculty, campus administrators, facility managers, and event organizers.
- **Revenue model**: Institutional SaaS subscription / Campus enterprise license.
- **Success metric**: Daily Active Users (DAU), search query volume, issue resolution cycle time, and event engagement rate.
- **Strategy notes**: Multi-tenant foundation designed to scale from a single flagship university to multiple campuses.

## Requirements

### Validated

(None yet — greenfield project initialization)

### Active

- [ ] **FOUNDATION**: Project structure with Spring Boot (Java 21), MySQL, React/Vite/TS, Tailwind CSS, Material UI, Framer Motion, and Leaflet setup.
- [ ] **AUTH**: Secure JWT authentication, password hashing, and role-based access control (ROLE_STUDENT, ROLE_FACULTY, ROLE_STAFF, ROLE_ADMIN).
- [ ] **CAMPUS_HIERARCHY**: Relational data model and REST APIs for University → Building → Floor → Room → Facility hierarchy.
- [ ] **CAMPUS_MAP**: Interactive Leaflet + OpenStreetMap engine with search, category filtering, marker drawers, and walking navigation routes.
- [ ] **FACULTY_FINDER**: Directory search by name, department, or subject with detailed profiles and scheduled timetable locations.
- [ ] **FOOD_MESS**: Daily & weekly mess/canteen menus (Breakfast, Lunch, Snacks, Dinner), dietary tags, operating hours, and live open/closed status.
- [ ] **EVENTS**: Discovery and filtering for hackathons, workshops, cultural/sports events with venue linkage and registration flows.
- [ ] **MAINTENANCE_ISSUES**: Facility live status (OPEN, CLOSED, UNDER_MAINTENANCE), alternative facility recommendations, and student issue reporting with review workflows.
- [ ] **ANNOUNCEMENTS_NOTIFS**: Multi-category priority announcements (LOW to URGENT) and in-app notifications for alerts and events.
- [ ] **BOOKMARKS_SEARCH**: Global debounced UniYaar search across all entities and personal "My UniYaar" bookmarks.
- [ ] **ADMIN_DASHBOARD**: Data management console for managing entities, moderating issue reports, updating menus, and viewing system metrics.
- [ ] **DEMO_SEED**: Comprehensive realistic seed dataset with 5+ buildings, floors, rooms, 15+ faculty with timetables, food menus, 10+ events, and facilities.

### Out of Scope

- **Real-time GPS indoor positioning (UWB/Bluetooth/WiFi triangulation)**: Defer to future phases; initial version relies on clean hierarchical floor/room metadata and building-level coordinates.
- **Direct unmoderated student status publishing**: Student reports require admin/staff review before official facility status updates to maintain data trust.
- **Live faculty physical tracking**: Timetable represents scheduled locations only; no intrusive live GPS tracking of faculty members.
- **Native mobile apps (iOS/Android)**: Responsive mobile-first PWA / web application first.
- **Hallucinating AI Campus Assistant (YaarAI)**: Architecture prepares clean APIs and intent routing for YaarAI; generative model never invents unverified campus facts.

## Context

- Environment: macOS, Node v24.21.0, OpenJDK 21, MySQL running locally via Homebrew.
- Backend Architecture: Layered architecture (Controller → Service → Repository → MySQL) with strict DTO segregation and centralized `@RestControllerAdvice` exception handling.
- Frontend Design System: Modern startup aesthetic ("Maps + student social app + SaaS dashboard"), Gen-Z friendly copy ("Hey 👋, what's the scene?", "Khane ka kya scene hai?"), smooth micro-interactions via Framer Motion, responsive mobile-first layout.

## Constraints

- **Tech Stack**: Spring Boot (Java 21) + MySQL + Vite/React + TypeScript + Tailwind CSS + Leaflet.
- **Data Integrity**: DTOs for all API contracts (no JPA entities exposed). Strict foreign keys and indexing on search fields.
- **Multi-Tenant Readiness**: Reusable location hierarchy not tied permanently to a single hardcoded university.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Monorepo Structure (`backend/` + `frontend/`) | Keeps Spring Boot backend and React frontend coordinated in a single Git repository for easy development and deployment | — Pending |
| Scheduled vs. Live Presence | Avoid privacy concerns and inaccuracies; clearly label faculty timetables as "Scheduled Location" | — Pending |
| Trust Model (Official vs Reported) | Prevent false alarms by requiring staff moderation before converting student issue reports to official maintenance status | — Pending |
| Leaflet + OpenStreetMap | Free, open-source, customizable map styling without costly proprietary map API key dependencies | — Pending |

---
*Last updated: 2026-09-23 after initialization*
