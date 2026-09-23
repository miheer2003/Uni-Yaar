package com.uniyar.config;

import com.uniyar.entity.*;
import com.uniyar.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UniversityRepository universityRepository;
    private final DepartmentRepository departmentRepository;
    private final BuildingRepository buildingRepository;
    private final FloorRepository floorRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;
    private final TimetableRepository timetableRepository;
    private final FoodFacilityRepository foodFacilityRepository;
    private final MenuRepository menuRepository;
    private final MenuItemRepository menuItemRepository;
    private final EventRepository eventRepository;
    private final MaintenanceNoticeRepository maintenanceNoticeRepository;
    private final IssueReportRepository issueReportRepository;
    private final AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (universityRepository.count() > 0) {
            log.info("Database already seeded. Skipping DataSeeder initialization.");
            return;
        }

        log.info("Seeding realistic university dataset for UniYaar ('Apni Uni. Apna Yaar.')...");

        // 1. University
        University uni = universityRepository.save(University.builder()
                .name("Apex Institute of Technology")
                .address("Survey No. 42, Hinjawadi Tech Park Road, Pune, Maharashtra 411057")
                .description("Premier multi-disciplinary engineering and technology institute with state-of-the-art labs, modern campus, and vibrant student community.")
                .latitude(18.5204)
                .longitude(73.8567)
                .build());

        // 2. Departments
        Department cse = departmentRepository.save(Department.builder()
                .name("Computer Science & Engineering")
                .code("CSE")
                .description("Focuses on Artificial Intelligence, Distributed Systems, Software Engineering, and Cyber Security.")
                .university(uni)
                .build());

        departmentRepository.save(Department.builder()
                .name("Information Technology")
                .code("IT")
                .description("Web technologies, Cloud Computing, and Mobile Application Architectures.")
                .university(uni)
                .build());

        departmentRepository.save(Department.builder()
                .name("Mechanical Engineering")
                .code("MECH")
                .description("Robotics, Thermal Engineering, Automotive Design, and Manufacturing Labs.")
                .university(uni)
                .build());

        // 3. Buildings
        Building blockA = buildingRepository.save(Building.builder()
                .name("Academic Block A (Engineering)")
                .code("ENG-A")
                .description("Primary hub for CS, IT, and AI lecture halls, advanced software computing labs, and dean offices.")
                .university(uni)
                .latitude(18.5204)
                .longitude(73.8567)
                .totalFloors(4)
                .build());

        Building library = buildingRepository.save(Building.builder()
                .name("Central Library & Tech Hub")
                .code("LIB-01")
                .description("Modern multi-level knowledge repository, 24/7 digital reading spaces, and silent study pods.")
                .university(uni)
                .latitude(18.5215)
                .longitude(73.8575)
                .totalFloors(3)
                .build());

        Building sac = buildingRepository.save(Building.builder()
                .name("Student Activity Center (SAC)")
                .code("SAC-01")
                .description("Indoor sports complex, amphitheatre, music rooms, club workspaces, and food promenade.")
                .university(uni)
                .latitude(18.5195)
                .longitude(73.8555)
                .totalFloors(2)
                .build());

        Building hostel = buildingRepository.save(Building.builder()
                .name("Hostel Complex Block A (Annapurna)")
                .code("HOSTEL-A")
                .description("Student residential building with central subsidized dining mess and recreational lawn.")
                .university(uni)
                .latitude(18.5180)
                .longitude(73.8548)
                .totalFloors(5)
                .build());

        // 4. Floors for Block A
        Floor groundFloor = floorRepository.save(Floor.builder()
                .building(blockA)
                .floorNumber(0)
                .name("Ground Floor")
                .build());

        Floor floor1 = floorRepository.save(Floor.builder()
                .building(blockA)
                .floorNumber(1)
                .name("1st Floor")
                .build());

        Floor floor2 = floorRepository.save(Floor.builder()
                .building(blockA)
                .floorNumber(2)
                .name("2nd Floor")
                .build());

        Floor floor3 = floorRepository.save(Floor.builder()
                .building(blockA)
                .floorNumber(3)
                .name("3rd Floor")
                .build());

        // 5. Rooms
        Room aud1 = roomRepository.save(Room.builder()
                .floor(groundFloor)
                .roomNumber("LH-001")
                .name("Sir C.V. Raman Main Auditorium")
                .roomType(RoomType.AUDITORIUM)
                .capacity(450)
                .build());

        Room lh101 = roomRepository.save(Room.builder()
                .floor(floor1)
                .roomNumber("101")
                .name("Smart Lecture Hall 101")
                .roomType(RoomType.CLASSROOM)
                .capacity(80)
                .build());

        Room cabin301 = roomRepository.save(Room.builder()
                .floor(floor2)
                .roomNumber("201")
                .name("Faculty Cabin 201 (HOD Office)")
                .roomType(RoomType.FACULTY_OFFICE)
                .capacity(6)
                .build());

        Room cabin302 = roomRepository.save(Room.builder()
                .floor(floor2)
                .roomNumber("202")
                .name("Faculty Cabin 202")
                .roomType(RoomType.FACULTY_OFFICE)
                .capacity(4)
                .build());

        Room lab302 = roomRepository.save(Room.builder()
                .floor(floor3)
                .roomNumber("302")
                .name("Advanced Computing & AI Sandbox Lab")
                .roomType(RoomType.LAB)
                .capacity(60)
                .build());

        // 6. Users & Roles
        User adminUser = userRepository.save(User.builder()
                .fullName("System Administrator")
                .email("admin@uniyaar.edu")
                .password(passwordEncoder.encode("Admin@123"))
                .role(UserRole.ROLE_ADMIN)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        userRepository.save(User.builder()
                .fullName("Priya Verma (Operations Desk)")
                .email("facilities@uniyaar.edu")
                .password(passwordEncoder.encode("Staff@123"))
                .role(UserRole.ROLE_STAFF)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        User studentUser = userRepository.save(User.builder()
                .fullName("Aarav Patel")
                .email("student@uniyaar.edu")
                .password(passwordEncoder.encode("Student@123"))
                .role(UserRole.ROLE_STUDENT)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        User facUser1 = userRepository.save(User.builder()
                .fullName("Dr. Ramesh Sharma")
                .email("ramesh.sharma@uniyaar.edu")
                .password(passwordEncoder.encode("Faculty@123"))
                .role(UserRole.ROLE_FACULTY)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        User facUser2 = userRepository.save(User.builder()
                .fullName("Dr. Ananya Gupta")
                .email("ananya.gupta@uniyaar.edu")
                .password(passwordEncoder.encode("Faculty@123"))
                .role(UserRole.ROLE_FACULTY)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        // 7. Faculty Profiles
        Faculty profSharma = facultyRepository.save(Faculty.builder()
                .user(facUser1)
                .department(cse)
                .officeRoom(cabin301)
                .designation("Professor & Head of Department")
                .subjects("Distributed Systems, Cloud Architecture, Operating Systems")
                .bio("Ph.D. from IIT Bombay. 18 years of research in scalable cloud platforms.")
                .build());

        Faculty profGupta = facultyRepository.save(Faculty.builder()
                .user(facUser2)
                .department(cse)
                .officeRoom(cabin302)
                .designation("Associate Professor (AI Research)")
                .subjects("Deep Learning, Autonomous Multi-Agent Systems, Python for DS")
                .bio("Leading the University Sandbox Lab on GenAI agents.")
                .build());

        // 8. Weekly Scheduled Timetables
        timetableRepository.save(Timetable.builder()
                .faculty(profSharma)
                .room(lh101)
                .dayOfWeek("MONDAY")
                .startTime("09:30 AM")
                .endTime("10:30 AM")
                .subject("Distributed Systems & Microservices (CS-401)")
                .build());

        timetableRepository.save(Timetable.builder()
                .faculty(profSharma)
                .room(lab302)
                .dayOfWeek("MONDAY")
                .startTime("02:00 PM")
                .endTime("04:00 PM")
                .subject("Cloud Infrastructure Hands-on Lab (CS-401L)")
                .build());

        timetableRepository.save(Timetable.builder()
                .faculty(profGupta)
                .room(lab302)
                .dayOfWeek("TUESDAY")
                .startTime("10:30 AM")
                .endTime("12:30 PM")
                .subject("Deep Learning & LLM Fine-Tuning Workshop (AI-502)")
                .build());

        // 9. Food Facilities & Daily Menus
        FoodFacility mess = foodFacilityRepository.save(FoodFacility.builder()
                .name("Central Student Mess (Annapurna)")
                .type(FoodType.MESS)
                .building(hostel)
                .floor(null)
                .openingTime("07:30 AM")
                .closingTime("09:30 PM")
                .status("OPEN")
                .description("Subsidized daily breakfast, lunch, tea-snacks, and dinner for students & staff.")
                .build());

        foodFacilityRepository.save(FoodFacility.builder()
                .name("Campus Cafe & Nescafe Hub")
                .type(FoodType.CANTEEN)
                .building(sac)
                .floor(null)
                .openingTime("08:30 AM")
                .closingTime("10:30 PM")
                .status("OPEN")
                .description("Cold coffee, espresso, artisanal wraps, sandwiches, Maggi, and fresh pastries.")
                .build());

        Menu todayMenu = menuRepository.save(Menu.builder()
                .foodFacility(mess)
                .menuDate(LocalDate.now())
                .build());

        menuItemRepository.save(MenuItem.builder()
                .menu(todayMenu)
                .itemName("Paneer Butter Masala & Roti")
                .description("Rich butter tomato gravy with fresh cottage cheese cubes and butter rotis")
                .mealType(MealType.LUNCH)
                .price(80.0)
                .dietaryTag("VEG")
                .build());

        menuItemRepository.save(MenuItem.builder()
                .menu(todayMenu)
                .itemName("Dal Tadka & Steamed Jeera Rice")
                .description("Yellow lentil tempered with cumin, garlic, and dried chili")
                .mealType(MealType.LUNCH)
                .price(60.0)
                .dietaryTag("VEG")
                .build());

        menuItemRepository.save(MenuItem.builder()
                .menu(todayMenu)
                .itemName("Indori Poha & Masala Chai")
                .description("Light flaked rice with roasted peanuts, mustard seeds, and freshly brewed ginger tea")
                .mealType(MealType.BREAKFAST)
                .price(35.0)
                .dietaryTag("VEG")
                .build());

        // 10. Events & Hackathons
        eventRepository.save(Event.builder()
                .title("UniHacks 2026: 36h National University Hackathon")
                .description("Join 450+ student developers building Agentic AI, Web3, and Smart Campus solutions. Over ₹3,00,000 prize pool, food & midnight caffeine stations included.")
                .category(EventCategory.HACKATHON)
                .status(EventStatus.LIVE_NOW)
                .organizer("GDSC & Coding Club")
                .capacity(450)
                .registeredCount(412)
                .startsAt(LocalDateTime.now().minusHours(4))
                .endsAt(LocalDateTime.now().plusHours(32))
                .room(aud1)
                .locationName("Sir C.V. Raman Auditorium & CS Sandbox Lab")
                .contactEmail("unihacks@uniyaar.edu")
                .isFeatured(true)
                .build());

        eventRepository.save(Event.builder()
                .title("Building Autonomous Multi-Agent AI Systems Masterclass")
                .description("Hands-on workshop covering LLM tool calling, LangGraph workflows, and model evaluations with Dr. Ananya Gupta.")
                .category(EventCategory.WORKSHOP)
                .status(EventStatus.UPCOMING)
                .organizer("Department of Computer Engineering")
                .capacity(100)
                .registeredCount(76)
                .startsAt(LocalDateTime.now().plusDays(3).withHour(14).withMinute(0))
                .endsAt(LocalDateTime.now().plusDays(3).withHour(17).withMinute(0))
                .room(lab302)
                .locationName("Room 302, 3rd Floor Advanced Computing Lab")
                .contactEmail("ai-workshop@uniyaar.edu")
                .isFeatured(false)
                .build());

        // 11. Maintenance Notices
        maintenanceNoticeRepository.save(MaintenanceNotice.builder()
                .title("Elevator #2 South Wing Cable Inspection & Servicing")
                .description("Scheduled preventative maintenance by Otis engineers. Lift power is temporarily locked out.")
                .status(FacilityStatus.UNDER_MAINTENANCE)
                .affectedAsset("Passenger Elevator #2 (South Wing)")
                .building(blockA)
                .floor(groundFloor)
                .alternativeSuggestion("Please use Elevator #1 in North Wing or central ramp for accessibility.")
                .estimatedResolutionTime("Today by 5:00 PM")
                .isActive(true)
                .build());

        // 12. Student Community Issue Reports
        issueReportRepository.save(IssueReport.builder()
                .title("Ceiling projector lamp flickering in Lecture Hall 101")
                .description("During CS lectures the HDMI feed blanks out every few minutes, disrupting slide projections.")
                .category(IssueCategory.AV_PROJECTOR)
                .priority(IssuePriority.HIGH)
                .status(IssueStatus.IN_PROGRESS)
                .building(blockA)
                .floor(floor1)
                .room(lh101)
                .specificLocation("Lecture Hall 101 Front Podium")
                .reportedBy(studentUser)
                .upvoteCount(28)
                .staffNotes("Technician dispatched with spare Epson lamp bulb module.")
                .build());

        // 13. Announcements
        announcementRepository.save(Announcement.builder()
                .title("Heavy Monsoon Weather Advisory: Lecture Instruction in Hybrid Mode")
                .content("Following municipal red alert and waterlogging warnings near North Gate, all undergraduate lecture sessions tomorrow will be conducted in hybrid online mode via Google Meet. Hostels, library, and central mess remain operational as normal.")
                .priority(AnnouncementPriority.URGENT)
                .category(AnnouncementCategory.EMERGENCY)
                .targetAudience(AnnouncementAudience.ALL)
                .author(adminUser)
                .isPinned(true)
                .build());

        announcementRepository.save(Announcement.builder()
                .title("Spring 2026 End-Semester Theory & Practical Exam Schedule Released")
                .content("The Controller of Examinations has published the finalized schedule for all B.Tech, M.Tech, and MBA examinations commencing from April 24th, 2026. Hall tickets available for download starting April 10th.")
                .priority(AnnouncementPriority.IMPORTANT)
                .category(AnnouncementCategory.EXAM)
                .targetAudience(AnnouncementAudience.STUDENTS)
                .department(cse)
                .author(adminUser)
                .isPinned(true)
                .build());

        log.info("Realistic dataset seeding successfully completed!");
        log.info("Default Admin: admin@uniyaar.edu / Admin@123");
        log.info("Default Staff: facilities@uniyaar.edu / Staff@123");
        log.info("Default Student: student@uniyaar.edu / Student@123");
    }
}
