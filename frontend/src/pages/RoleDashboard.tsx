import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventApi, announcementApi, foodApi, foodStaffApi, facultyApi } from '../api/client';
import { EventItem, EventCategory } from '../types/event';
import { Announcement } from '../types/announcement';
import { FoodFacility, Menu } from '../types/food';
import { Faculty, TimetableEntry } from '../types/faculty';
import {
  MapPin, Users, UtensilsCrossed, Calendar, Bell,
  Plus, Trash2, ChefHat, Clock, Wrench, ChevronRight, Zap, Sparkles, ArrowUpRight
} from 'lucide-react';

export default function RoleDashboard() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="min-h-screen bg-[#DFDFE0] text-[#18181B] relative overflow-hidden font-sans selection:bg-[#776BFD]/20">
      <div className="relative z-10 w-full max-w-7xl mx-auto p-4 sm:p-8 lg:p-12">
        {user.role === 'ROLE_STUDENT' && <StudentDashboard />}
        {user.role === 'ROLE_FACULTY' && <FacultyWorkspace />}
        {user.role === 'ROLE_FOOD_STAFF' && <FoodStaffDashboard />}
      </div>
    </div>
  );
}

/* ──────────────────────── SHARED CLEAN MINIMALIST COMPONENTS ──────────────────────── */
const WhiteCard = ({ children, className = '', onClick }: any) => (
  <div
    onClick={onClick}
    className={`bg-[#FDFDFD] border border-[#DFDFE0] rounded-3xl p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all ${className}`}
  >
    {children}
  </div>
);

const CleanInput = ({ label, value, onChange, required, type = "text", isTextarea = false }: any) => (
  <label className="block w-full group">
    <span className="block text-xs font-bold tracking-wider text-[#636363] uppercase mb-2 group-focus-within:text-[#776BFD] transition-colors">{label}</span>
    {isTextarea ? (
      <textarea
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-5 py-3.5 bg-[#FDFDFD] border border-[#DFDFE0] rounded-2xl text-sm focus:ring-2 focus:ring-[#776BFD]/20 focus:border-[#776BFD] outline-none text-[#18181B] min-h-[100px] transition-all shadow-xs"
      />
    ) : (
      <input
        required={required}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-5 py-3.5 bg-[#FDFDFD] border border-[#DFDFE0] rounded-2xl text-sm focus:ring-2 focus:ring-[#776BFD]/20 focus:border-[#776BFD] outline-none text-[#18181B] transition-all shadow-xs"
      />
    )}
  </label>
);

const CleanSelect = ({ label, value, onChange, options }: any) => (
  <label className="block w-full group">
    <span className="block text-xs font-bold tracking-wider text-[#636363] uppercase mb-2 group-focus-within:text-[#776BFD] transition-colors">{label}</span>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-5 py-3.5 bg-[#FDFDFD] border border-[#DFDFE0] rounded-2xl text-sm focus:ring-2 focus:ring-[#776BFD]/20 focus:border-[#776BFD] outline-none text-[#18181B] transition-all appearance-none shadow-xs"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt} className="bg-white text-[#18181B]">
          {opt}
        </option>
      ))}
    </select>
  </label>
);

const PrimaryButton = ({ children, onClick, className = '' }: any) => (
  <button
    onClick={onClick}
    className={`bg-[#776BFD] hover:bg-[#6455F5] text-white font-bold px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-[#776BFD]/25 hover:shadow-lg hover:shadow-[#776BFD]/35 cursor-pointer ${className}`}
  >
    <div className="flex items-center justify-center gap-2">
      {children}
    </div>
  </button>
);

const FlamingoButton = ({ children, onClick, className = '' }: any) => (
  <button
    onClick={onClick}
    className={`bg-[#F86B7E] hover:bg-[#EE495F] text-white font-bold px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-[#F86B7E]/25 hover:shadow-lg hover:shadow-[#F86B7E]/35 cursor-pointer ${className}`}
  >
    <div className="flex items-center justify-center gap-2">
      {children}
    </div>
  </button>
);

/* ──────────────────────── STUDENT DASHBOARD ──────────────────────── */
function StudentDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [facilities, setFacilities] = useState<FoodFacility[]>([]);

  useEffect(() => {
    eventApi.getAll(undefined, undefined, true).then((r: any) => setEvents(r.data.data || [])).catch(() => {});
    announcementApi.getAll().then((r: any) => setAnnouncements((r.data.data || []).slice(0, 4))).catch(() => {});
    foodApi.getFacilities().then((r: any) => setFacilities(r.data.data || [])).catch(() => {});
  }, []);

  const openFacilities = facilities.filter(f => f.status === 'OPEN').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#DFDFE0]">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDFDFD] border border-[#DFDFE0] text-[#776BFD] text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Dashboard</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#18181B]">
            Student <span className="bg-gradient-to-r from-[#776BFD] to-[#F86B7E] bg-clip-text text-transparent">Nexus</span>
          </h1>
          <p className="text-base text-[#636363] mt-2 font-medium">
            Welcome back, {user?.fullName}. Here is your campus activity overview.
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="/map"
            title="Campus Map"
            className="w-12 h-12 rounded-2xl bg-[#FDFDFD] border border-[#DFDFE0] flex items-center justify-center hover:border-[#776BFD] hover:shadow-md transition-all group shadow-xs"
          >
            <MapPin className="w-5 h-5 text-[#636363] group-hover:text-[#776BFD] transition-colors" />
          </a>
          <a
            href="/facilities"
            title="Facilities"
            className="w-12 h-12 rounded-2xl bg-[#FDFDFD] border border-[#DFDFE0] flex items-center justify-center hover:border-[#776BFD] hover:shadow-md transition-all group shadow-xs"
          >
            <Wrench className="w-5 h-5 text-[#636363] group-hover:text-[#776BFD] transition-colors" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Metric Cards inspired by Michal Parulski Health UI */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Card 1: Event Activity Widget (Fiery Flamingo / Bar-Chart inspired) */}
          <WhiteCard className="group hover:border-[#F86B7E]/50 cursor-pointer" onClick={() => window.location.href='/events'}>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-[#636363] uppercase tracking-wider">Campus Events</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#DFDFE0]/40 text-[#18181B] text-xs font-semibold group-hover:bg-[#F86B7E]/10 group-hover:text-[#F86B7E] transition-colors">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <h3 className="text-5xl font-black text-[#18181B] tracking-tight">{events.length}</h3>
                <span className="text-lg font-bold text-[#636363]">active</span>
              </div>
              <p className="text-xs text-[#636363] mt-1 font-medium">Upcoming hackathons, talks & meets</p>
            </div>

            {/* Stylized Bar Chart Widget in Fiery Flamingo (#F86B7E) */}
            <div className="pt-6 pb-2 border-t border-[#DFDFE0]">
              <div className="flex items-end justify-between gap-2 h-20 px-2">
                {[
                  { day: 'Mo', val: 40, avg: false },
                  { day: 'Tu', val: 75, avg: false },
                  { day: 'We', val: 95, avg: true },
                  { day: 'Th', val: 60, avg: false },
                  { day: 'Fr', val: 85, avg: false },
                  { day: 'Sa', val: 50, avg: false },
                  { day: 'Su', val: 30, avg: false },
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    {bar.avg && (
                      <span className="text-[9px] font-bold bg-[#18181B] text-white px-1.5 py-0.5 rounded-md -mb-1 z-10 scale-90">
                        Peak
                      </span>
                    )}
                    <div
                      style={{ height: `${bar.val}%` }}
                      className={`w-full max-w-[12px] rounded-full transition-all ${
                        bar.avg ? 'bg-[#F86B7E] shadow-sm shadow-[#F86B7E]/40' : 'bg-[#F86B7E]/50 hover:bg-[#F86B7E]'
                      }`}
                    />
                    <span className="text-[10px] font-bold text-[#636363]">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </WhiteCard>

          {/* Card 2: Canteen Energy & Capacity (Stargate Shimmer #776BFD & Misty Lilac #B6ADC3) */}
          <WhiteCard className="group hover:border-[#776BFD]/50 cursor-pointer" onClick={() => window.location.href='/food'}>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-[#636363] uppercase tracking-wider">Canteen Operations</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#DFDFE0]/40 text-[#18181B] text-xs font-semibold group-hover:bg-[#776BFD]/10 group-hover:text-[#776BFD] transition-colors">
                Menus <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <h3 className="text-5xl font-black text-[#18181B] tracking-tight">{openFacilities}</h3>
                <span className="text-xl font-bold text-[#636363]">/ {facilities.length} Open</span>
              </div>
              <p className="text-xs text-[#636363] mt-1 font-medium">Live food & mess status across campus</p>
            </div>

            {/* Horizontal segmented bars inspired by Michal Parulski energy activity */}
            <div className="space-y-3 pt-6 border-t border-[#DFDFE0]">
              {[
                { label: 'Q1 Hostels', primary: 80, secondary: 20 },
                { label: 'Q2 Tech Park', primary: 65, secondary: 35 },
                { label: 'Q3 Food Court', primary: 90, secondary: 10 },
              ].map((bar, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-[#636363] w-20 truncate">{bar.label}</span>
                  <div className="flex-1 h-3.5 bg-[#DFDFE0]/50 rounded-full overflow-hidden flex">
                    <div style={{ width: `${bar.primary}%` }} className="bg-[#776BFD] h-full rounded-l-full" />
                    <div style={{ width: `${bar.secondary}%` }} className="bg-[#B6ADC3] h-full rounded-r-full" />
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-end gap-4 pt-2 text-[10px] font-bold text-[#636363]">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#776BFD]"></span> Open Outlets</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#B6ADC3]"></span> Prep Phase</span>
              </div>
            </div>
          </WhiteCard>

        </div>

        {/* Right Column: Circulars and Quick Portals */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <WhiteCard className="flex-1">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#DFDFE0]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#776BFD]/10 text-[#776BFD]">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#18181B]">Campus Circulars</h2>
                  <p className="text-xs text-[#636363] font-medium">Official verified updates & emergency memos</p>
                </div>
              </div>
              <a href="/announcements" className="text-xs font-bold text-[#776BFD] hover:underline flex items-center gap-1">
                All Notices <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
            
            <div className="space-y-3.5">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="group p-4 rounded-2xl bg-white hover:bg-[#FDFDFD] border border-[#DFDFE0] hover:border-[#776BFD]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#18181B] group-hover:text-[#776BFD] transition-colors text-base">
                      {a.title}
                    </h4>
                    <p className="text-xs text-[#636363] font-medium">
                      {new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {a.category}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-xl ${
                      a.priority === 'URGENT'
                        ? 'bg-[#F86B7E]/10 text-[#F86B7E] border border-[#F86B7E]/20'
                        : a.priority === 'IMPORTANT'
                        ? 'bg-[#776BFD]/10 text-[#776BFD] border border-[#776BFD]/20'
                        : 'bg-[#B6ADC3]/20 text-[#636363]'
                    }`}
                  >
                    {a.priority}
                  </span>
                </div>
              ))}
              {!announcements.length && (
                <p className="text-[#636363] text-sm italic py-4">No active circulars at this time.</p>
              )}
            </div>
          </WhiteCard>

          {/* Quick Action Navigation Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div
              className="p-6 rounded-3xl bg-[#FDFDFD] border border-[#DFDFE0] hover:border-[#776BFD] hover:shadow-clean-lg transition-all group cursor-pointer shadow-xs"
              onClick={() => window.location.href='/faculty'}
            >
              <div className="flex flex-col h-full justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#776BFD]/10 flex items-center justify-center mb-6 text-[#776BFD] group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#18181B] mb-1 group-hover:text-[#776BFD] transition-colors">Faculty Directory</h3>
                  <p className="text-xs text-[#636363] font-medium">Find professors, cabin locations & book consultation hours</p>
                </div>
              </div>
            </div>
            
            <div
              className="p-6 rounded-3xl bg-[#FDFDFD] border border-[#DFDFE0] hover:border-[#F86B7E] hover:shadow-clean-lg transition-all group cursor-pointer shadow-xs"
              onClick={() => window.location.href='/events'}
            >
              <div className="flex flex-col h-full justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#F86B7E]/10 flex items-center justify-center mb-6 text-[#F86B7E] group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#18181B] mb-1 group-hover:text-[#F86B7E] transition-colors">Explore Events</h3>
                  <p className="text-xs text-[#636363] font-medium">Register for upcoming campus hackathons, workshops & fests</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ──────────────────────── FACULTY WORKSPACE ──────────────────────── */
function FacultyWorkspace() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Faculty | null>(null);
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ designation: '', subjects: '', avatarUrl: '', bio: '' });
  const [slot, setSlot] = useState({ roomId: '', subject: '', dayOfWeek: 'MONDAY', startTime: '09:00 AM', endTime: '10:00 AM' });
  const [eventForm, setEventForm] = useState({ title: '', description: '', category: 'WORKSHOP' as EventCategory, startsAt: '', endsAt: '', locationName: '', capacity: '' });
  const [myEvents, setMyEvents] = useState<EventItem[]>([]);
  const [editEventId, setEditEventId] = useState<number | null>(null);

  useEffect(() => {
    facultyApi.getMyProfile().then(({ data }: any) => {
      if (!data.data) return;
      setProfile(data.data);
      setForm({ designation: data.data.designation || '', subjects: data.data.subjects || '', avatarUrl: data.data.avatarUrl || '', bio: data.data.bio || '' });
    }).catch(() => setMessage('Unable to load profile.'));
    facultyApi.getMyTimetable().then(({ data }: any) => setEntries(data.data || [])).catch(() => {});
    eventApi.getAll().then(({ data }: any) => { if (data.data && user) setMyEvents(data.data.filter((e: any) => e.organizer === user.fullName)); });
  }, [user]);

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await facultyApi.updateMyProfile(form);
      setProfile(data.data);
      setMessage('Profile updated successfully.');
      setTimeout(()=>setMessage(''), 3000);
    } catch {
      setMessage('Failed to save profile.');
    }
  };

  const addMySlot = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await facultyApi.createMyTimetable({ roomId: Number(slot.roomId), subject: slot.subject, dayOfWeek: slot.dayOfWeek, startTime: slot.startTime, endTime: slot.endTime });
      const { data } = await facultyApi.getMyTimetable();
      setEntries(data.data || []);
      setMessage('Schedule slot added.');
      setTimeout(()=>setMessage(''), 3000);
    } catch {
      setMessage('Failed to add slot.');
    }
  };

  const removeMySlot = async (id: number) => {
    try {
      await facultyApi.deleteMyTimetable(id);
      setEntries(current => current.filter(e => e.id !== id));
      setMessage('Slot removed.');
      setTimeout(()=>setMessage(''), 3000);
    } catch {
      setMessage('Failed to remove slot.');
    }
  };

  const publishEvent = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const payload = {
        ...eventForm,
        startsAt: new Date(eventForm.startsAt).toISOString(),
        endsAt: new Date(eventForm.endsAt).toISOString(),
        capacity: eventForm.capacity ? Number(eventForm.capacity) : undefined
      };
      if (editEventId) {
        await eventApi.update(editEventId, payload);
        setMessage('Event updated successfully.');
        setEditEventId(null);
      } else {
        await eventApi.create(payload);
        setMessage('Event published to student hub.');
      }
      setTimeout(()=>setMessage(''), 3000);
      setEventForm({ title: '', description: '', category: 'WORKSHOP', startsAt: '', endsAt: '', locationName: '', capacity: '' });
      const { data } = await eventApi.getAll();
      if (data.data && user) setMyEvents(data.data.filter((e: any) => e.organizer === user.fullName));
    } catch {
      setMessage('Failed to save event.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#DFDFE0]">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDFDFD] border border-[#DFDFE0] text-[#776BFD] text-xs font-bold mb-3 shadow-2xs">
            <Users className="w-3.5 h-3.5" />
            <span>Faculty Workspace</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#18181B]">
            Faculty <span className="bg-gradient-to-r from-[#776BFD] to-[#F86B7E] bg-clip-text text-transparent">Management Desk</span>
          </h1>
          <p className="text-[#636363] mt-2 font-medium">Manage your public profile, lecture timetable, and host campus events.</p>
        </div>
      </div>
      
      {message && (
        <div className="p-4 rounded-2xl bg-[#776BFD]/10 border border-[#776BFD]/30 text-[#776BFD] text-sm font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4"/> {message}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Profile Card */}
        <WhiteCard>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#DFDFE0]">
            <div className="p-2.5 rounded-2xl bg-[#776BFD]/10 text-[#776BFD]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#18181B]">Public Directory Profile</h2>
              <p className="text-xs text-[#636363]">Visible to students across the university</p>
            </div>
          </div>
          <form onSubmit={saveProfile} className="space-y-4">
            <CleanInput label="Designation" value={form.designation} onChange={(v:any) => setForm({ ...form, designation: v })} required />
            <CleanInput label="Subjects Taught (comma separated)" value={form.subjects} onChange={(v:any) => setForm({ ...form, subjects: v })} />
            <CleanInput label="Professional Bio" value={form.bio} onChange={(v:any) => setForm({ ...form, bio: v })} isTextarea />
            <PrimaryButton>Update Profile</PrimaryButton>
          </form>
          <p className="text-xs font-bold tracking-wider uppercase text-[#636363] mt-6 pt-4 border-t border-[#DFDFE0]">
            Department: <span className="text-[#18181B]">{profile?.departmentName || 'Unassigned'}</span>
          </p>
        </WhiteCard>

        {/* Timetable Card */}
        <WhiteCard>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#DFDFE0]">
            <div className="p-2.5 rounded-2xl bg-[#776BFD]/10 text-[#776BFD]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#18181B]">Lecture Schedule</h2>
              <p className="text-xs text-[#636363]">Define recurring classroom and consultation slots</p>
            </div>
          </div>
          <form onSubmit={addMySlot} className="grid grid-cols-2 gap-3.5 mb-6 p-4 rounded-2xl bg-white border border-[#DFDFE0] shadow-xs">
            <CleanInput label="Room ID" value={slot.roomId} onChange={(v:any) => setSlot({ ...slot, roomId: v })} required />
            <CleanInput label="Subject" value={slot.subject} onChange={(v:any) => setSlot({ ...slot, subject: v })} required />
            <CleanSelect label="Day" value={slot.dayOfWeek} onChange={(v:any) => setSlot({ ...slot, dayOfWeek: v })} options={['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']} />
            <CleanInput label="Start" type="time" value={slot.startTime} onChange={(v:any) => setSlot({ ...slot, startTime: v })} required />
            <CleanInput label="End" type="time" value={slot.endTime} onChange={(v:any) => setSlot({ ...slot, endTime: v })} required />
            <div className="col-span-2 pt-2">
              <PrimaryButton className="w-full"><Plus className="w-4 h-4"/> Add Schedule Slot</PrimaryButton>
            </div>
          </form>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {entries.map(entry => (
              <div key={entry.id} className="p-4 rounded-2xl bg-white border border-[#DFDFE0] flex items-center justify-between group hover:border-[#776BFD] transition-all shadow-2xs">
                <div>
                  <h4 className="font-bold text-[#18181B] text-sm">{entry.subject}</h4>
                  <p className="text-xs text-[#636363] mt-1 font-medium">{entry.dayOfWeek} • {entry.startTime} - {entry.endTime} • Room {entry.roomNumber}</p>
                </div>
                <button
                  onClick={() => removeMySlot(entry.id)}
                  className="p-2 rounded-xl bg-[#F86B7E]/10 text-[#F86B7E] hover:bg-[#F86B7E]/20 transition-colors"
                  title="Remove slot"
                >
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            ))}
            {!entries.length && <p className="text-sm text-[#636363] italic py-2">No schedule entries active.</p>}
          </div>
        </WhiteCard>
      </div>

      {/* Host Events Section */}
      <WhiteCard>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#DFDFE0]">
          <div className="p-2.5 rounded-2xl bg-[#F86B7E]/10 text-[#F86B7E]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#18181B]">{editEventId ? 'Edit Event' : 'Host Campus Event'}</h2>
            <p className="text-xs text-[#636363]">Broadcast workshops, guest talks, and campus gatherings</p>
          </div>
        </div>
        <form onSubmit={publishEvent} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <CleanInput label="Event Title" value={eventForm.title} onChange={(v:any) => setEventForm({ ...eventForm, title: v })} required />
          <CleanSelect label="Category" value={eventForm.category} onChange={(v:any) => setEventForm({ ...eventForm, category: v })} options={['HACKATHON', 'WORKSHOP', 'CULTURAL', 'SPORTS', 'SEMINAR', 'TECH_TALK', 'CLUB_MEET']} />
          <CleanInput label="Location" value={eventForm.locationName} onChange={(v:any) => setEventForm({ ...eventForm, locationName: v })} />
          <CleanInput label="Starts At" type="datetime-local" value={eventForm.startsAt} onChange={(v:any) => setEventForm({ ...eventForm, startsAt: v })} required />
          <CleanInput label="Ends At" type="datetime-local" value={eventForm.endsAt} onChange={(v:any) => setEventForm({ ...eventForm, endsAt: v })} required />
          <CleanInput label="Capacity" type="number" value={eventForm.capacity} onChange={(v:any) => setEventForm({ ...eventForm, capacity: v })} />
          <div className="sm:col-span-2 lg:col-span-3">
            <CleanInput label="Description" value={eventForm.description} onChange={(v:any) => setEventForm({ ...eventForm, description: v })} isTextarea />
          </div>
          <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-4 pt-2">
            <PrimaryButton>{editEventId ? 'Update Event' : 'Publish Event'}</PrimaryButton>
            {editEventId && (
              <button
                type="button"
                onClick={() => {
                  setEditEventId(null);
                  setEventForm({ title: '', description: '', category: 'WORKSHOP', startsAt: '', endsAt: '', locationName: '', capacity: '' });
                }}
                className="text-sm font-bold text-[#636363] hover:text-[#18181B] transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-[#DFDFE0]">
          <h3 className="text-xs font-bold tracking-wider text-[#636363] uppercase mb-4">My Hosted Events</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {myEvents.map(evt => (
              <div key={evt.id} className="p-5 rounded-2xl bg-white border border-[#DFDFE0] hover:border-[#776BFD] transition-colors flex justify-between items-center shadow-2xs">
                <div>
                  <h4 className="font-bold text-[#18181B] mb-1">{evt.title}</h4>
                  <p className="text-xs text-[#636363] font-medium">{new Date(evt.startsAt).toLocaleDateString()} • {evt.category}</p>
                </div>
                <button
                  onClick={() => {
                    setEditEventId(evt.id);
                    setEventForm({
                      title: evt.title,
                      description: evt.description || '',
                      category: evt.category,
                      startsAt: new Date(evt.startsAt).toISOString().slice(0, 16),
                      endsAt: new Date(evt.endsAt).toISOString().slice(0, 16),
                      locationName: evt.locationName || '',
                      capacity: evt.capacity ? String(evt.capacity) : ''
                    });
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-[#DFDFE0]/40 text-xs font-bold text-[#18181B] hover:bg-[#776BFD] hover:text-white transition-colors"
                >
                  Edit
                </button>
              </div>
            ))}
            {!myEvents.length && <p className="text-sm text-[#636363] italic">No events published yet.</p>}
          </div>
        </div>
      </WhiteCard>
    </div>
  );
}

/* ──────────────────────── FOOD STAFF DASHBOARD ──────────────────────── */
function FoodStaffDashboard() {
  const [facilities, setFacilities] = useState<FoodFacility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [message, setMessage] = useState('');
  const [itemForm, setItemForm] = useState({ mealType: 'LUNCH', itemName: '', dietaryTag: 'VEG', price: '', description: '' });

  useEffect(() => {
    foodApi.getFacilities().then((r: any) => setFacilities(r.data.data || [])).catch(() => {});
  }, []);

  const loadMenu = async (id: number) => {
    setSelectedFacility(id);
    try {
      const { data } = await foodApi.getMenu(id);
      setMenu(data.data);
    } catch {
      setMessage('Failed to load menu.');
    }
  };

  const addItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFacility) return;
    try {
      await foodStaffApi.addMenuItem(selectedFacility, { ...itemForm, price: itemForm.price ? Number(itemForm.price) : undefined });
      setMessage('Menu item added successfully.');
      setItemForm({ mealType: 'LUNCH', itemName: '', dietaryTag: 'VEG', price: '', description: '' });
      loadMenu(selectedFacility);
      setTimeout(()=>setMessage(''), 3000);
    } catch {
      setMessage('Failed to add item.');
    }
  };

  const removeItem = async (id: number) => {
    try {
      await foodStaffApi.deleteMenuItem(id);
      loadMenu(selectedFacility!);
      setMessage('Item removed.');
      setTimeout(()=>setMessage(''), 3000);
    } catch {
      setMessage('Failed to remove item.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#DFDFE0]">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDFDFD] border border-[#DFDFE0] text-[#F86B7E] text-xs font-bold mb-3 shadow-2xs">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Food Operations</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#18181B]">
            Dining & Mess <span className="bg-gradient-to-r from-[#F86B7E] to-[#776BFD] bg-clip-text text-transparent">Desk</span>
          </h1>
          <p className="text-[#636363] mt-2 font-medium">Manage daily meals, menus, prices, and food outlets for campus students.</p>
        </div>
      </div>
      
      {message && (
        <div className="p-4 rounded-2xl bg-[#776BFD]/10 border border-[#776BFD]/30 text-[#776BFD] text-sm font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4"/> {message}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Facilities List */}
        <WhiteCard className="lg:col-span-1 h-fit">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#DFDFE0]">
            <div className="p-2.5 rounded-2xl bg-[#F86B7E]/10 text-[#F86B7E]">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#18181B]">Select Facility</h2>
              <p className="text-xs text-[#636363]">Choose a mess or canteen</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {facilities.map(f => (
              <button
                key={f.id}
                onClick={() => loadMenu(f.id)}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedFacility === f.id
                    ? 'bg-white border-[#776BFD] shadow-md shadow-[#776BFD]/15'
                    : 'bg-white border-[#DFDFE0] hover:border-[#B6ADC3]'
                }`}
              >
                <h4 className="font-bold text-[#18181B] mb-1">{f.name}</h4>
                <div className="flex items-center justify-between text-xs text-[#636363] font-medium">
                  <span>{f.openingTime} - {f.closingTime}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${f.status === 'OPEN' ? 'bg-emerald-500' : 'bg-[#F86B7E]'}`}></span>
                </div>
              </button>
            ))}
            {!facilities.length && <p className="text-sm text-[#636363] italic">No assigned facilities.</p>}
          </div>
        </WhiteCard>

        {/* Menu Manager */}
        {selectedFacility && (
          <WhiteCard className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#DFDFE0]">
              <div className="p-2.5 rounded-2xl bg-[#776BFD]/10 text-[#776BFD]">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#18181B]">Menu Editor</h2>
                <p className="text-xs text-[#636363]">Update menu offerings, meal times, and dietary labels</p>
              </div>
            </div>

            <form onSubmit={addItem} className="grid sm:grid-cols-2 gap-4 p-6 rounded-3xl bg-white border border-[#DFDFE0] mb-8 shadow-xs">
              <CleanInput label="Item Name" value={itemForm.itemName} onChange={(v:any) => setItemForm({ ...itemForm, itemName: v })} required />
              <CleanSelect label="Meal Time" value={itemForm.mealType} onChange={(v:any) => setItemForm({ ...itemForm, mealType: v })} options={['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER']} />
              <CleanSelect label="Dietary Tag" value={itemForm.dietaryTag} onChange={(v:any) => setItemForm({ ...itemForm, dietaryTag: v })} options={['VEG', 'NON_VEG', 'VEGAN', 'JAIN', 'EGG']} />
              <CleanInput label="Price (₹)" type="number" value={itemForm.price} onChange={(v:any) => setItemForm({ ...itemForm, price: v })} />
              <div className="sm:col-span-2">
                <CleanInput label="Description" value={itemForm.description} onChange={(v:any) => setItemForm({ ...itemForm, description: v })} />
              </div>
              <div className="sm:col-span-2 pt-2">
                <FlamingoButton className="w-fit"><Plus className="w-4 h-4"/> Add to Menu</FlamingoButton>
              </div>
            </form>

            {menu && (
              <div className="space-y-8">
                {['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'].map(meal => {
                  const items = menu.items.filter((i: any) => i.mealType === meal);
                  if (!items.length) return null;
                  return (
                    <div key={meal}>
                      <h4 className="text-xs font-black tracking-widest text-[#636363] uppercase mb-3 pl-2 border-l-3 border-[#776BFD]">
                        {meal}
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3.5">
                        {items.map((item: any) => (
                          <div key={item.id} className="p-4 rounded-2xl bg-white border border-[#DFDFE0] flex justify-between items-start group hover:border-[#776BFD] transition-all shadow-2xs">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`w-2.5 h-2.5 rounded-full ${item.dietaryTag === 'VEG' ? 'bg-emerald-500' : item.dietaryTag === 'NON_VEG' ? 'bg-[#F86B7E]' : 'bg-[#776BFD]'}`}></span>
                                <h5 className="font-bold text-[#18181B] text-sm">{item.itemName}</h5>
                              </div>
                              {item.description && <p className="text-xs text-[#636363] mt-1">{item.description}</p>}
                              {item.price && <p className="text-xs font-bold text-emerald-600 mt-2">₹{item.price}</p>}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 rounded-xl bg-[#F86B7E]/10 text-[#F86B7E] hover:bg-[#F86B7E]/20 transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4"/>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </WhiteCard>
        )}

      </div>
    </div>
  );
}
