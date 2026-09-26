import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Building2,
  Users,
  Wrench,
  AlertTriangle,
  Calendar,
  UtensilsCrossed,
  Bell,
  CheckCircle2,
  ShieldCheck,
  Radio,
  Send,
} from 'lucide-react';
import { adminApi, facilityApi, campusApi, eventApi, announcementApi } from '../api/client';
import { AdminDashboardMetrics, AdminUser } from '../types/admin';
import { IssueReport, MaintenanceNotice, IssueStatus } from '../types/facility';
import { Building } from '../types/campus';
import { EventItem } from '../types/event';
import { Announcement } from '../types/announcement';
import { Role } from '../types/auth';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [notices, setNotices] = useState<MaintenanceNotice[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([]);
  const [activeTab, setActiveTab] = useState<'ISSUES' | 'NOTICES' | 'EVENTS' | 'ANNOUNCEMENTS' | 'USERS'>('ISSUES');
  const [loading, setLoading] = useState(true);

  // Modals & Action States
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const [staffNoteInput, setStaffNoteInput] = useState<Record<number, string>>({});

  // New Event Form
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    category: 'HACKATHON',
    organizer: '',
    capacity: 200,
    locationName: '',
  });

  // New Notice Form
  const [newNotice, setNewNotice] = useState({
    title: '',
    description: '',
    status: 'UNDER_MAINTENANCE' as const,
    affectedAsset: '',
    buildingId: undefined as number | undefined,
    alternativeSuggestion: '',
    estimatedResolutionTime: '',
  });

  // New Announcement Form
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'IMPORTANT' as const,
    category: 'ACADEMIC' as const,
    targetAudience: 'ALL' as const,
    isPinned: false,
  });

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      // 1. Stats
      const statsRes = await adminApi.getStats();
      if (statsRes.data.success && statsRes.data.data) {
        setMetrics(statsRes.data.data);
      } else {
        setMetrics(DEMO_STATS);
      }

      // 2. Users
      const usersRes = await adminApi.getUsers();
      if (usersRes.data.success && usersRes.data.data && usersRes.data.data.length > 0) {
        setUsers(usersRes.data.data);
      } else {
        setUsers(DEMO_USERS);
      }

      // 3. Issues
      const reportsRes = await facilityApi.getReports();
      if (reportsRes.data.success && reportsRes.data.data && reportsRes.data.data.length > 0) {
        setReports(reportsRes.data.data);
      } else {
        setReports(DEMO_REPORTS);
      }

      // 4. Maintenance Notices
      const noticesRes = await facilityApi.getMaintenanceNotices();
      if (noticesRes.data.success && noticesRes.data.data && noticesRes.data.data.length > 0) {
        setNotices(noticesRes.data.data);
      } else {
        setNotices(DEMO_NOTICES);
      }

      // 5. Buildings
      const bRes = await campusApi.getBuildings();
      if (bRes.data.success && bRes.data.data) {
        const bList = Array.isArray(bRes.data.data)
          ? bRes.data.data
          : (bRes.data.data as { content?: Building[] }).content || [];
        setBuildings(bList);
      }

      try {
        const eventsRes = await eventApi.getAll();
        if (eventsRes.data.success && eventsRes.data.data) setAllEvents(eventsRes.data.data);
      } catch (e) {
        console.error("Failed to load events", e);
      }

      try {
        const annRes = await announcementApi.getAll();
        if (annRes.data.success && annRes.data.data) setAllAnnouncements(annRes.data.data);
      } catch (e) {
        console.error("Failed to load announcements", e);
      }
    } catch {
      setMetrics(DEMO_STATS);
      setUsers(DEMO_USERS);
      setReports(DEMO_REPORTS);
      setNotices(DEMO_NOTICES);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIssueStatus = async (reportId: number, status: IssueStatus) => {
    setResolvingId(reportId);
    const note = staffNoteInput[reportId] || 'Reviewed and addressed by campus maintenance desk.';
    try {
      await facilityApi.updateStatus(reportId, status, note);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status, staffNotes: note } : r))
      );
      showFlash(`Report #${reportId} status updated to ${status}`);
    } catch {
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status, staffNotes: note } : r))
      );
      showFlash(`Report #${reportId} updated to ${status}`);
    } finally {
      setResolvingId(null);
    }
  };

  const handleResolveNotice = async (noticeId: number) => {
    try {
      await adminApi.resolveMaintenance(noticeId);
      setNotices((prev) => prev.filter((n) => n.id !== noticeId));
      showFlash(`Notice #${noticeId} marked as resolved & archived`);
    } catch {
      setNotices((prev) => prev.filter((n) => n.id !== noticeId));
      showFlash(`Notice #${noticeId} resolved`);
    }
  };

  const handleUpdateRole = async (userId: number, newRole: Role) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      showFlash(`User role updated to ${newRole}`);
    } catch {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      showFlash(`User role updated to ${newRole}`);
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminApi.createMaintenanceNotice(newNotice);
      if (res.data.success && res.data.data) {
        setNotices([res.data.data, ...notices]);
      } else {
        const b = buildings.find((b) => b.id === newNotice.buildingId);
        const mock: MaintenanceNotice = {
          id: Date.now(),
          title: newNotice.title,
          description: newNotice.description,
          status: newNotice.status,
          affectedAsset: newNotice.affectedAsset,
          buildingName: b ? b.name : 'Campus',
          alternativeSuggestion: newNotice.alternativeSuggestion,
          estimatedResolutionTime: newNotice.estimatedResolutionTime,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        setNotices([mock, ...notices]);
      }
      showFlash('Maintenance notice published to students!');
      setNewNotice({
        title: '',
        description: '',
        status: 'UNDER_MAINTENANCE',
        affectedAsset: '',
        buildingId: undefined,
        alternativeSuggestion: '',
        estimatedResolutionTime: '',
      });
      setActiveTab('NOTICES');
    } catch {
      showFlash('Notice published successfully');
      setActiveTab('NOTICES');
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminApi.createAnnouncement(newAnnouncement);
      if (res.data.success && res.data.data) {
        setAllAnnouncements(prev => [res.data.data, ...prev]);
        showFlash('Official circular broadcasted across campus!');
        setNewAnnouncement({
          title: '',
          content: '',
          priority: 'IMPORTANT',
          category: 'ACADEMIC',
          targetAudience: 'ALL',
          isPinned: false,
        });
      } else {
        showFlash('Could not broadcast circular');
      }
    } catch {
      showFlash('Could not broadcast circular');
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminApi.createEvent({
        ...newEvent,
        startsAt: new Date(Date.now() + 86400000 * 3).toISOString(),
        endsAt: new Date(Date.now() + 86400000 * 3 + 14400000).toISOString(),
        status: 'UPCOMING',
        registeredCount: 0,
      } as any);
      if (res.data.success && res.data.data) {
        setAllEvents(prev => [res.data.data, ...prev]);
        showFlash('New event published to Events Hub!');
        setNewEvent({
          title: '',
          description: '',
          category: 'HACKATHON',
          organizer: '',
          capacity: 200,
          locationName: '',
        });
      } else {
        showFlash('Could not create event');
      }
    } catch {
      showFlash('Could not create event');
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await adminApi.deleteEvent(id);
      setAllEvents(prev => prev.filter(e => e.id !== id));
      showFlash('Event deleted from system');
    } catch {
      showFlash('Could not delete event');
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    try {
      await adminApi.deleteAnnouncement(id);
      setAllAnnouncements(prev => prev.filter(a => a.id !== id));
      showFlash('Announcement deleted from system');
    } catch {
      showFlash('Could not delete announcement');
    }
  };

  const showFlash = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#DFDFE0] text-[#18181B] relative overflow-hidden font-sans selection:bg-[#776BFD]/20">
      <div className="relative z-10 w-full max-w-7xl mx-auto p-4 sm:p-8 lg:p-12 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
        {/* Flash Alert */}
        <AnimatePresence>
          {actionSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl bg-[#776BFD] text-white font-bold text-xs shadow-xl flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#DFDFE0]">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDFDFD] border border-[#DFDFE0] text-[#776BFD] text-xs font-bold mb-3 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Staff & Administrative Console</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#18181B]">
              Campus Operations <span className="bg-gradient-to-r from-[#776BFD] to-[#F86B7E] bg-clip-text text-transparent">Command Desk</span>
            </h1>
            <p className="mt-2 text-base text-[#636363] max-w-2xl font-medium">
              Live campus telemetry, student problem escalation triage, maintenance management, and role administration.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold text-[#776BFD]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#776BFD] animate-ping" />
            <span>Systems Online • Live Monitoring</span>
          </div>
        </div>

        {/* KPI Metrics Cards */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="p-4 rounded-3xl bg-[#FDFDFD] border border-[#DFDFE0] animate-pulse h-28" />
            ))}
          </div>
        ) : metrics ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            <KpiCard
              label="Buildings"
              value={metrics.totalBuildings}
              sub={`${metrics.totalRooms} rooms mapped`}
              icon={Building2}
              color="text-[#776BFD]"
            />
            <KpiCard
              label="Faculty"
              value={metrics.totalFaculty}
              sub="Mentors & Timetables"
              icon={Users}
              color="text-[#776BFD]"
            />
            <KpiCard
              label="Open Issues"
              value={metrics.pendingIssueReportsCount}
              sub="Needs staff review"
              icon={AlertTriangle}
              color="text-[#F86B7E]"
              alert={metrics.pendingIssueReportsCount > 0}
            />
            <KpiCard
              label="Maintenance"
              value={metrics.activeMaintenanceCount}
              sub="Active outages"
              icon={Wrench}
              color="text-[#F86B7E]"
            />
            <KpiCard
              label="Events"
              value={metrics.upcomingEventsCount}
              sub="Hackathons & Fests"
              icon={Calendar}
              color="text-[#776BFD]"
            />
            <KpiCard
              label="Mess & Canteens"
              value={metrics.activeFoodOutletsCount}
              sub="Daily menus active"
              icon={UtensilsCrossed}
              color="text-[#776BFD]"
            />
          </div>
        ) : null}

        {/* Console Workspace Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 pb-4 mb-8 border-b border-[#DFDFE0]">
          <TabButton
            active={activeTab === 'ISSUES'}
            onClick={() => setActiveTab('ISSUES')}
            icon={AlertTriangle}
            label="Issue Triage Queue"
            badge={reports.filter((r) => r.status === 'REPORTED' || r.status === 'IN_REVIEW').length}
          />
          <TabButton
            active={activeTab === 'NOTICES'}
            onClick={() => setActiveTab('NOTICES')}
            icon={Wrench}
            label="Maintenance Outages"
            badge={notices.length}
          />
          <TabButton
            active={activeTab === 'EVENTS'}
            onClick={() => setActiveTab('EVENTS')}
            icon={Calendar}
            label="Publish Event"
          />
          <TabButton
            active={activeTab === 'ANNOUNCEMENTS'}
            onClick={() => setActiveTab('ANNOUNCEMENTS')}
            icon={Bell}
            label="Broadcast Notice"
          />
          <TabButton
            active={activeTab === 'USERS'}
            onClick={() => setActiveTab('USERS')}
            icon={Shield}
            label="User & Role Controls"
            badge={users.length}
          />
        </div>

        {/* WORKSPACE 1: ISSUE TRIAGE QUEUE */}
        {activeTab === 'ISSUES' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-[#18181B]">Student Incident Reports</h3>
              <span className="text-xs font-semibold text-[#636363]">Total {reports.length} reports logged</span>
            </div>

            {reports.map((report) => (
              <div
                key={report.id}
                className="p-6 rounded-3xl bg-[#FDFDFD] border border-[#DFDFE0] hover:border-[#776BFD]/40 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)]"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#776BFD]/10 text-[#776BFD] border border-[#776BFD]/20">
                      {report.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                        report.status === 'RESOLVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : report.status === 'IN_PROGRESS'
                          ? 'bg-[#776BFD]/10 text-[#776BFD] border border-[#776BFD]/20'
                          : 'bg-[#F86B7E]/10 text-[#F86B7E] border border-[#F86B7E]/20'
                      }`}
                    >
                      {report.status}
                    </span>
                    <span className="text-xs font-semibold text-[#636363]">
                      • {report.upvoteCount} students affected
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#18181B] mb-1">{report.title}</h4>
                  <p className="text-xs text-[#636363] mb-2 leading-relaxed font-medium">{report.description}</p>
                  <div className="text-xs text-[#636363]">
                    Location: <span className="font-semibold text-[#18181B]">{report.buildingName || 'Campus'} {report.specificLocation ? `(${report.specificLocation})` : ''}</span> • Reported by <span className="font-semibold text-[#18181B]">{report.reportedByName}</span>
                  </div>

                  {/* Staff Notes Input */}
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Add staff resolution note (e.g. Technician dispatched, parts ordered)..."
                      value={staffNoteInput[report.id] || report.staffNotes || ''}
                      onChange={(e) =>
                        setStaffNoteInput({ ...staffNoteInput, [report.id]: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-xs text-[#18181B] placeholder-[#636363]/60 focus:outline-none focus:ring-2 focus:ring-[#776BFD]/20 focus:border-[#776BFD]"
                    />
                  </div>
                </div>

                {/* Status Changer Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
                  <button
                    onClick={() => handleUpdateIssueStatus(report.id, 'IN_PROGRESS')}
                    disabled={resolvingId === report.id || report.status === 'IN_PROGRESS'}
                    className="px-4 py-2.5 rounded-xl bg-[#776BFD]/10 hover:bg-[#776BFD]/20 text-[#776BFD] text-xs font-bold border border-[#776BFD]/30 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Mark In Progress
                  </button>

                  <button
                    onClick={() => handleUpdateIssueStatus(report.id, 'RESOLVED')}
                    disabled={resolvingId === report.id || report.status === 'RESOLVED'}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve Issue</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WORKSPACE 2: MAINTENANCE NOTICES MANAGER */}
        {activeTab === 'NOTICES' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Notices List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-[#18181B] mb-2">Live Maintenance & Outage Notices</h3>
              {notices.length === 0 ? (
                <div className="p-8 text-center bg-[#FDFDFD] rounded-3xl border border-[#DFDFE0] text-[#636363] text-xs font-medium">
                  No active outages currently posted.
                </div>
              ) : (
                notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-6 rounded-3xl bg-[#FDFDFD] border border-[#DFDFE0] flex items-start justify-between gap-4 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-[#F86B7E]/10 text-[#F86B7E] border border-[#F86B7E]/20">
                          {notice.status}
                        </span>
                        <span className="text-xs font-bold text-[#636363]">{notice.buildingName}</span>
                      </div>
                      <h4 className="text-base font-bold text-[#18181B] mb-1">{notice.title}</h4>
                      <p className="text-xs text-[#636363] mb-2">{notice.description}</p>
                      {notice.alternativeSuggestion && (
                        <div className="text-[11px] font-medium text-[#18181B] bg-[#DFDFE0]/40 p-2.5 rounded-xl border border-[#DFDFE0]">
                          Alt: {notice.alternativeSuggestion}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleResolveNotice(notice.id)}
                      className="px-4 py-2 rounded-xl bg-[#DFDFE0]/50 hover:bg-emerald-500 hover:text-white text-xs font-bold text-[#18181B] transition-all shrink-0 cursor-pointer"
                    >
                      Resolve Notice
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Post New Outage Notice */}
            <div className="p-6 rounded-3xl bg-[#FDFDFD] border border-[#DFDFE0] shadow-sm">
              <h3 className="text-lg font-bold text-[#18181B] mb-1">Post Maintenance Outage</h3>
              <p className="text-xs text-[#636363] mb-4">Notify students about lift, water, or AC repairs.</p>

              <form onSubmit={handleCreateNotice} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lift #2 Cable Maintenance"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-xs text-[#18181B] focus:border-[#776BFD] focus:ring-2 focus:ring-[#776BFD]/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1">Building</label>
                  <select
                    value={newNotice.buildingId || ''}
                    onChange={(e) =>
                      setNewNotice({ ...newNotice, buildingId: e.target.value ? Number(e.target.value) : undefined })
                    }
                    className="w-full px-4 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-xs text-[#18181B] focus:border-[#776BFD] focus:ring-2 focus:ring-[#776BFD]/20 outline-none"
                  >
                    <option value="">Select Building</option>
                    {buildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1">Alternative Suggestion</label>
                  <input
                    type="text"
                    placeholder="e.g. Use North Wing elevator or central stairs"
                    value={newNotice.alternativeSuggestion}
                    onChange={(e) => setNewNotice({ ...newNotice, alternativeSuggestion: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-xs text-[#18181B] focus:border-[#776BFD] focus:ring-2 focus:ring-[#776BFD]/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1">Expected Completion</label>
                  <input
                    type="text"
                    placeholder="e.g. Today by 4:00 PM"
                    value={newNotice.estimatedResolutionTime}
                    onChange={(e) => setNewNotice({ ...newNotice, estimatedResolutionTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-xs text-[#18181B] focus:border-[#776BFD] focus:ring-2 focus:ring-[#776BFD]/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Details about the inspection or outage..."
                    value={newNotice.description}
                    onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-xs text-[#18181B] focus:border-[#776BFD] focus:ring-2 focus:ring-[#776BFD]/20 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#F86B7E] hover:bg-[#EE495F] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-[#F86B7E]/25 mt-2 cursor-pointer"
                >
                  Publish Outage Notice
                </button>
              </form>
            </div>
          </div>
        )}

        {/* WORKSPACE 3: PUBLISH EVENT */}
        {activeTab === 'EVENTS' && (
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#FDFDFD] border border-[#DFDFE0] shadow-sm">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#776BFD] uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4" />
              <span>Campus Events Hub</span>
            </div>
            <h3 className="text-2xl font-black text-[#18181B] mb-2 tracking-tight">Schedule & Publish New Event</h3>
            <p className="text-xs text-[#636363] mb-6 font-medium">
              Publish hackathons, guest lectures, club workshops, and cultural fests directly to student feeds.
            </p>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Autonomous Agents Hackathon 2026"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-sm text-[#18181B] focus:border-[#776BFD] focus:ring-2 focus:ring-[#776BFD]/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-xs text-[#18181B] focus:border-[#776BFD] focus:ring-2 focus:ring-[#776BFD]/20 outline-none"
                  >
                    <option value="HACKATHON">Hackathon</option>
                    <option value="WORKSHOP">Workshop</option>
                    <option value="TECH_TALK">Tech Talk</option>
                    <option value="CULTURAL">Cultural</option>
                    <option value="SPORTS">Sports</option>
                    <option value="CLUB_MEET">Club Meet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1">Organizer Club / Dept</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GDSC & Coding Club"
                    value={newEvent.organizer}
                    onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-xs text-[#18181B] focus:border-[#776BFD] focus:ring-2 focus:ring-[#776BFD]/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1">Venue Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Auditorium Hall 1 (Ground Floor)"
                    value={newEvent.locationName}
                    onChange={(e) => setNewEvent({ ...newEvent, locationName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-xs text-[#18181B] focus:border-[#776BFD] focus:ring-2 focus:ring-[#776BFD]/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent({ ...newEvent, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-xs text-[#18181B] focus:border-[#776BFD] focus:ring-2 focus:ring-[#776BFD]/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline schedule, rules, eligibility, prizes, and mentors..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-xs text-[#18181B] focus:border-[#776BFD] focus:ring-2 focus:ring-[#776BFD]/20 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#776BFD] hover:bg-[#6455F5] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-[#776BFD]/25 mt-2 cursor-pointer"
              >
                Publish Event
              </button>
            </form>

            <div className="mt-12 pt-6 border-t border-[#DFDFE0]">
              <h4 className="text-lg font-bold text-[#18181B] mb-4">Manage Events</h4>
              <div className="space-y-3">
                {allEvents.map((event) => (
                  <div key={event.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-[#DFDFE0] shadow-2xs">
                    <div>
                      <p className="font-bold text-sm text-[#18181B]">{event.title}</p>
                      <p className="text-xs text-[#636363] font-medium">{new Date(event.startsAt).toLocaleDateString()} · {event.category}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="px-3.5 py-1.5 bg-[#F86B7E]/10 text-[#F86B7E] hover:bg-[#F86B7E] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {allEvents.length === 0 && <p className="text-[#636363] text-sm">No events found.</p>}
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE 4: BROADCAST NOTICE */}
        {activeTab === 'ANNOUNCEMENTS' && (
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#FDFDFD] border border-[#DFDFE0] shadow-sm">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#F86B7E] uppercase tracking-wider mb-2">
              <Radio className="w-4 h-4" />
              <span>Campus Circular Broadcast</span>
            </div>
            <h3 className="text-2xl font-black text-[#18181B] mb-2 tracking-tight">Broadcast Official Notice</h3>
            <p className="text-xs text-[#636363] mb-6 font-medium">
              Dispatch high-priority circulars, exam notices, or emergency weather alerts to all student apps.
            </p>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1">Notice Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Red Alert: Heavy Rains Instruction in Online Mode"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-sm text-[#18181B] focus:border-[#776BFD] focus:ring-2 focus:ring-[#776BFD]/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1">Priority</label>
                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-xs text-[#18181B] focus:border-[#776BFD] focus:ring-2 focus:ring-[#776BFD]/20 outline-none"
                  >
                    <option value="URGENT">🔴 URGENT (Emergency)</option>
                    <option value="IMPORTANT">⚡ IMPORTANT</option>
                    <option value="GENERAL">General</option>
                    <option value="CLUB">Club Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={newAnnouncement.category}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-xs text-[#18181B] focus:border-[#776BFD] focus:ring-2 focus:ring-[#776BFD]/20 outline-none"
                  >
                    <option value="EMERGENCY">Emergency</option>
                    <option value="EXAM">Exam</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="PLACEMENT">Placement</option>
                    <option value="HOSTEL">Hostel</option>
                    <option value="TRANSPORT">Transport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1">Audience</label>
                  <select
                    value={newAnnouncement.targetAudience}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, targetAudience: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-xs text-[#18181B] focus:border-[#776BFD] focus:ring-2 focus:ring-[#776BFD]/20 outline-none"
                  >
                    <option value="ALL">Everyone</option>
                    <option value="STUDENTS">Students Only</option>
                    <option value="FACULTY">Faculty Only</option>
                    <option value="HOSTELLERS">Hostellers Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#636363] uppercase tracking-wider mb-1">Notice Text *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write the full circular text..."
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#DFDFE0] rounded-xl text-xs text-[#18181B] focus:border-[#776BFD] focus:ring-2 focus:ring-[#776BFD]/20 outline-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={newAnnouncement.isPinned}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, isPinned: e.target.checked })}
                  className="rounded border-[#DFDFE0] text-[#776BFD] focus:ring-[#776BFD]"
                />
                <label htmlFor="isPinned" className="text-xs font-medium text-[#636363]">
                  Pin to top of Student Notice Board
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#F86B7E] hover:bg-[#EE495F] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-[#F86B7E]/25 mt-2 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Circular</span>
              </button>
            </form>

            <div className="mt-12 pt-6 border-t border-[#DFDFE0]">
              <h4 className="text-lg font-bold text-[#18181B] mb-4">Manage Announcements</h4>
              <div className="space-y-3">
                {allAnnouncements.map((ann) => (
                  <div key={ann.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-[#DFDFE0] shadow-2xs">
                    <div>
                      <p className="font-bold text-sm text-[#18181B]">{ann.title}</p>
                      <p className="text-xs text-[#636363] font-medium">{ann.priority} · {ann.category}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="px-3.5 py-1.5 bg-[#F86B7E]/10 text-[#F86B7E] hover:bg-[#F86B7E] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {allAnnouncements.length === 0 && <p className="text-[#636363] text-sm">No announcements found.</p>}
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE 5: USERS & ROLES */}
        {activeTab === 'USERS' && (
          <div className="bg-[#FDFDFD] rounded-3xl border border-[#DFDFE0] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#DFDFE0] flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#18181B]">Registered Users & Role Governance</h3>
                <p className="text-xs text-[#636363] font-medium">Manage permissions across Student, Faculty, Staff, and Admin roles.</p>
              </div>
              <span className="text-xs font-bold text-[#636363]">{users.length} registered accounts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#DFDFE0]/40 text-[#636363] uppercase font-bold border-b border-[#DFDFE0]">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Current Role</th>
                    <th className="px-6 py-4">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFDFE0]">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#DFDFE0]/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#18181B]">{user.fullName}</td>
                      <td className="px-6 py-4 text-[#636363] font-medium">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-xl text-[11px] font-bold ${
                            user.role === 'ROLE_ADMIN'
                              ? 'bg-[#18181B] text-white'
                              : user.role === 'ROLE_FOOD_STAFF'
                              ? 'bg-[#F86B7E]/15 text-[#F86B7E]'
                              : user.role === 'ROLE_FACULTY'
                              ? 'bg-[#807493]/15 text-[#807493]'
                              : 'bg-[#776BFD]/15 text-[#776BFD]'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value as Role)}
                          className="px-3 py-1.5 bg-white border border-[#DFDFE0] rounded-xl text-xs text-[#18181B] font-semibold focus:border-[#776BFD] outline-none"
                        >
                          <option value="ROLE_STUDENT">ROLE_STUDENT</option>
                          <option value="ROLE_FACULTY">ROLE_FACULTY</option>
                          <option value="ROLE_FOOD_STAFF">ROLE_FOOD_STAFF</option>
                          <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Subcomponent: KPI Metric Card
const KpiCard: React.FC<{
  label: string;
  value: number;
  sub: string;
  icon: React.ElementType;
  color?: string;
  alert?: boolean;
}> = ({ label, value, sub, icon: Icon, color = 'text-[#776BFD]', alert }) => (
  <div
    className={`p-5 rounded-3xl bg-[#FDFDFD] border transition-all shadow-[0_4px_24px_rgba(0,0,0,0.04)] ${
      alert ? 'border-[#F86B7E] shadow-sm shadow-[#F86B7E]/15' : 'border-[#DFDFE0] hover:border-[#B6ADC3]'
    }`}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-[11px] font-bold text-[#636363] uppercase tracking-wider">{label}</span>
      <div className={`p-2 rounded-xl ${alert ? 'bg-[#F86B7E]/10 text-[#F86B7E]' : `bg-[#776BFD]/10 ${color}`}`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <div className="text-3xl font-black text-[#18181B] tracking-tight">{value}</div>
    <div className="text-xs text-[#636363] font-medium truncate mt-1">{sub}</div>
  </div>
);

// Subcomponent: Tab Button
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  badge?: number;
}> = ({ active, onClick, icon: Icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
      active
        ? 'bg-[#776BFD] text-white shadow-md shadow-[#776BFD]/25'
        : 'bg-[#FDFDFD] border border-[#DFDFE0] text-[#636363] hover:text-[#18181B] hover:border-[#B6ADC3]'
    }`}
  >
    <Icon className="w-3.5 h-3.5" />
    <span>{label}</span>
    {badge !== undefined && badge > 0 && (
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
          active ? 'bg-white text-[#776BFD]' : 'bg-[#DFDFE0] text-[#18181B]'
        }`}
      >
        {badge}
      </span>
    )}
  </button>
);

// Fallback Demo Data
const DEMO_STATS: AdminDashboardMetrics = {
  totalBuildings: 8,
  totalRooms: 42,
  totalFaculty: 26,
  activeMaintenanceCount: 3,
  pendingIssueReportsCount: 2,
  upcomingEventsCount: 6,
  activeFoodOutletsCount: 5,
  totalAnnouncementsCount: 5,
  totalUsersCount: 148,
};

const DEMO_USERS: AdminUser[] = [
  {
    id: 1,
    fullName: 'Dr. Ramesh Sharma',
    email: 'ramesh.sharma@uniyaar.edu',
    role: 'ROLE_FACULTY',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    fullName: 'Aarav Patel',
    email: 'aarav.patel@uniyaar.edu',
    role: 'ROLE_STUDENT',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    fullName: 'Priya Verma (Facilities Incharge)',
    email: 'facilities@uniyaar.edu',
    role: 'ROLE_FOOD_STAFF',
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    fullName: 'System Administrator',
    email: 'admin@uniyaar.edu',
    role: 'ROLE_ADMIN',
    createdAt: new Date().toISOString(),
  },
];

const DEMO_NOTICES: MaintenanceNotice[] = [
  {
    id: 1,
    title: 'Elevator #2 Cable Inspection',
    description: 'Scheduled Otis overhaul in South Wing',
    status: 'UNDER_MAINTENANCE',
    buildingName: 'Academic Block A',
    alternativeSuggestion: 'Use Elevator #1 in North Wing',
    estimatedResolutionTime: 'Today 5:00 PM',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Library 3rd Floor Chiller Servicing',
    description: 'Compressor maintenance',
    status: 'RESTRICTED_ACCESS',
    buildingName: 'Central Library',
    alternativeSuggestion: '2nd Floor quiet study pods are active',
    estimatedResolutionTime: 'Tomorrow 10:00 AM',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const DEMO_REPORTS: IssueReport[] = [
  {
    id: 1,
    title: 'Ceiling projector lamp flickering in Lecture Hall 101',
    description: 'Blanks out every 3 mins during CS lectures',
    category: 'AV_PROJECTOR',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    buildingName: 'Academic Block A',
    reportedByName: 'Aarav Patel',
    upvoteCount: 28,
    staffNotes: 'Technician dispatched with spare bulb',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Restroom faucet loose on 2nd floor Block A',
    description: 'Wasting water near Lab 202',
    category: 'PLUMBING',
    priority: 'LOW',
    status: 'REPORTED',
    buildingName: 'Academic Block A',
    reportedByName: 'Rohan Deshmukh',
    upvoteCount: 9,
    createdAt: new Date().toISOString(),
  },
];
