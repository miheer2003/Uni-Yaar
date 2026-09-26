import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Mail, 
  ChevronLeft, 
  Calendar, 
  Clock, 
  Compass, 
  Loader2, 
  Info 
} from 'lucide-react';
import { facultyApi } from '../api/client';
import { Faculty, TimetableEntry } from '../types/faculty';

export default function FacultyDetail() {
  const { id } = useParams<{ id: string }>();
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData(parseInt(id, 10));
    }
  }, [id]);

  const loadData = async (facultyId: number) => {
    setLoading(true);
    try {
      const [facRes, timeRes] = await Promise.all([
        facultyApi.getFaculty(facultyId),
        facultyApi.getTimetable(facultyId),
      ]);

      if (facRes.data.success && facRes.data.data) {
        setFaculty(facRes.data.data);
      }
      if (timeRes.data.success && timeRes.data.data) {
        setTimetable(timeRes.data.data);
      }
    } catch {
      // Demo fallback if backend is empty
      const demoFaculty: Faculty = {
        id: facultyId,
        userId: 100,
        fullName: 'Dr. Anand Joshi',
        email: 'anand.joshi@uniyaar.edu',
        departmentName: 'Computer Engineering',
        designation: 'Professor & HOD',
        subjects: 'Distributed Systems, Database Management Systems',
        officeRoomNumber: 'Room 204',
        officeBuildingName: 'SOFA Building',
        officeBuildingCode: 'SOFA',
        officeLatitude: 18.5186,
        officeLongitude: 73.8152,
        bio: 'Ph.D. with over 18 years in academic teaching and student mentoring.',
      };
      const demoSchedule: TimetableEntry[] = [
        {
          id: 1,
          facultyId,
          facultyName: 'Dr. Anand Joshi',
          roomNumber: 'A-204',
          roomName: 'Lecture Hall 204',
          buildingName: 'SOFA Building',
          buildingCode: 'SOFA',
          latitude: 18.5186,
          longitude: 73.8152,
          subject: 'Database Management Systems',
          dayOfWeek: 'MONDAY',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          indicator: 'Scheduled Location',
        },
        {
          id: 2,
          facultyId,
          facultyName: 'Dr. Anand Joshi',
          roomNumber: 'Lab 3',
          roomName: 'High Performance Computing Lab',
          buildingName: 'Innovation Centre',
          buildingCode: 'IC',
          latitude: 18.5192,
          longitude: 73.8160,
          subject: 'Distributed Systems Lab',
          dayOfWeek: 'MONDAY',
          startTime: '02:00 PM',
          endTime: '04:00 PM',
          indicator: 'Scheduled Location',
        },
        {
          id: 3,
          facultyId,
          facultyName: 'Dr. Anand Joshi',
          roomNumber: 'Room 105',
          roomName: 'Seminar Hall',
          buildingName: 'SOFA Building',
          buildingCode: 'SOFA',
          latitude: 18.5186,
          longitude: 73.8152,
          subject: 'Database Architecture & Query Optimization',
          dayOfWeek: 'WEDNESDAY',
          startTime: '11:15 AM',
          endTime: '12:15 PM',
          indicator: 'Scheduled Location',
        },
      ];
      setFaculty(demoFaculty);
      setTimetable(demoSchedule);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .replace(/Dr\.|Prof\./g, '')
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#DFDFE0] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#776BFD] mb-3" />
        <p className="text-[#636363] font-medium">Loading faculty profile & schedule...</p>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="min-h-screen bg-[#DFDFE0] py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-[#18181B] mb-2">Faculty not found</h2>
        <Link to="/faculty" className="text-[#776BFD] hover:underline font-semibold">Back to faculty directory</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#DFDFE0] py-10 px-4 sm:px-6 lg:px-8 text-[#18181B]">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link
          to="/faculty"
          className="inline-flex items-center space-x-1 text-sm text-[#636363] hover:text-[#18181B] mb-6 transition-colors font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>All Faculty</span>
        </Link>

        {/* Profile Card Header */}
        <div className="bg-[#FDFDFD] border border-[#DFDFE0] rounded-3xl p-6 sm:p-8 mb-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start space-x-5">
              <div className="w-20 h-20 rounded-2xl bg-[#776BFD]/10 border border-[#776BFD]/20 flex items-center justify-center text-[#776BFD] font-extrabold text-2xl flex-shrink-0">
                {getInitials(faculty.fullName)}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#18181B]">
                  {faculty.fullName}
                </h1>
                <p className="text-sm font-semibold text-[#776BFD] mt-1">
                  {faculty.designation} • {faculty.departmentName}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#636363]">
                  <a href={`mailto:${faculty.email}`} className="flex items-center space-x-1 hover:text-[#18181B] transition-colors font-medium">
                    <Mail className="w-4 h-4 text-[#B6ADC3]" />
                    <span>{faculty.email}</span>
                  </a>
                  {faculty.officeRoomNumber && (
                    <div className="flex items-center space-x-1 font-medium">
                      <MapPin className="w-4 h-4 text-[#776BFD]" />
                      <span>Office: <strong className="text-[#18181B]">{faculty.officeRoomNumber}</strong> ({faculty.officeBuildingName || faculty.officeBuildingCode})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {faculty.officeLatitude && faculty.officeLongitude && (
              <Link
                to={`/map?lat=${faculty.officeLatitude}&lng=${faculty.officeLongitude}&name=${encodeURIComponent(faculty.fullName + ' Office')}`}
                className="btn-primary inline-flex items-center justify-center space-x-2 py-3 px-5 rounded-2xl font-semibold shadow-md shadow-[#776BFD]/25 self-start md:self-auto"
              >
                <Compass className="w-4 h-4" />
                <span>Navigate to Office</span>
              </Link>
            )}
          </div>
        </div>

        {/* Weekly Timetable Grid */}
        <div className="bg-[#FDFDFD] border border-[#DFDFE0] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#DFDFE0] gap-3">
            <div>
              <h2 className="text-xl font-black text-[#18181B] flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[#776BFD]" />
                <span>Weekly Lecture Schedule</span>
              </h2>
              <p className="text-xs text-[#636363] mt-1">
                Timetable shows scheduled class venues across academic blocks.
              </p>
            </div>

            {/* Crucial GSD Product Philosophy Banner */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-[#F86B7E]/10 border border-[#F86B7E]/30 rounded-xl text-[#F86B7E] text-xs font-semibold">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>Notice: Scheduled Location Only (Not Live Tracking)</span>
            </div>
          </div>

          {timetable.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-10 h-10 text-[#B6ADC3] mx-auto mb-2" />
              <p className="text-[#636363] text-sm font-medium">No scheduled lectures found for this week.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timetable.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-white border border-[#DFDFE0] hover:border-[#B6ADC3] rounded-2xl p-5 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 bg-[#776BFD]/10 text-[#776BFD] font-bold text-xs rounded-lg uppercase tracking-wider">
                        {slot.dayOfWeek}
                      </span>
                      <div className="flex items-center space-x-1.5 text-xs text-[#636363] font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#B6ADC3]" />
                        <span>{slot.startTime} – {slot.endTime}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[#18181B] mb-2">
                      {slot.subject}
                    </h3>

                    <div className="flex items-center space-x-2 text-xs text-[#636363] bg-[#DFDFE0]/30 p-2.5 rounded-xl border border-[#DFDFE0]">
                      <MapPin className="w-4 h-4 text-[#776BFD] flex-shrink-0" />
                      <span className="truncate">
                        Venue: <strong className="text-[#18181B]">{slot.roomNumber}</strong> ({slot.buildingName || slot.buildingCode})
                      </span>
                    </div>
                  </div>

                  {slot.latitude && slot.longitude && (
                    <div className="pt-4 mt-4 border-t border-[#DFDFE0] flex items-center justify-between">
                      <span className="text-[11px] text-[#636363]">
                        Scheduled Venue
                      </span>
                      <Link
                        to={`/map?lat=${slot.latitude}&lng=${slot.longitude}&name=${encodeURIComponent(slot.subject + ' (' + slot.roomNumber + ')')}`}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-[#776BFD] hover:text-[#6455F5] transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>View Room on Map</span>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
