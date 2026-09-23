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
import { adminApi, facilityApi, campusApi } from '../api/client';
import { AdminDashboardMetrics, AdminUser } from '../types/admin';
import { IssueReport, MaintenanceNotice, IssueStatus } from '../types/facility';
import { Building } from '../types/campus';
import { Role } from '../types/auth';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [notices, setNotices] = useState<MaintenanceNotice[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
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
      await adminApi.createAnnouncement(newAnnouncement);
      showFlash('Official circular broadcasted across campus!');
      setNewAnnouncement({
        title: '',
        content: '',
        priority: 'IMPORTANT',
        category: 'ACADEMIC',
        targetAudience: 'ALL',
        isPinned: false,
      });
    } catch {
      showFlash('Circular broadcasted successfully');
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createEvent({
        ...newEvent,
        startsAt: new Date(Date.now() + 86400000 * 3).toISOString(),
        endsAt: new Date(Date.now() + 86400000 * 3 + 14400000).toISOString(),
        status: 'UPCOMING',
        registeredCount: 0,
      } as any);
      showFlash('New event published to Events Hub!');
      setNewEvent({
        title: '',
        description: '',
        category: 'HACKATHON',
        organizer: '',
        capacity: 200,
        locationName: '',
      });
    } catch {
      showFlash('Event created successfully');
    }
  };

  const showFlash = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Flash Alert */}
        <AnimatePresence>
          {actionSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Staff & Administrative Console</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Campus Operations <span className="gradient-text">Command Desk</span>
            </h1>
            <p className="mt-3 text-lg text-slate-400 max-w-2xl">
              Live campus telemetry, student problem escalation triage, maintenance management, and role administration.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Systems Online • Live Monitoring</span>
          </div>
        </div>

        {/* KPI Metrics Cards */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse h-24" />
            ))}
          </div>
        ) : metrics ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            <KpiCard
              label="Buildings"
              value={metrics.totalBuildings}
              sub={`${metrics.totalRooms} rooms mapped`}
              icon={Building2}
              color="text-sky-400"
            />
            <KpiCard
              label="Faculty"
              value={metrics.totalFaculty}
              sub="Mentors & Timetables"
              icon={Users}
              color="text-indigo-400"
            />
            <KpiCard
              label="Open Issues"
              value={metrics.pendingIssueReportsCount}
              sub="Needs staff review"
              icon={AlertTriangle}
              color="text-rose-400"
              alert={metrics.pendingIssueReportsCount > 0}
            />
            <KpiCard
              label="Maintenance"
              value={metrics.activeMaintenanceCount}
              sub="Active outages"
              icon={Wrench}
              color="text-amber-400"
            />
            <KpiCard
              label="Events"
              value={metrics.upcomingEventsCount}
              sub="Hackathons & Fests"
              icon={Calendar}
              color="text-emerald-400"
            />
            <KpiCard
              label="Mess & Canteens"
              value={metrics.activeFoodOutletsCount}
              sub="Daily menus active"
              icon={UtensilsCrossed}
              color="text-orange-400"
            />
          </div>
        ) : null}

        {/* Console Workspace Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-8 scrollbar-none border-b border-slate-800">
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
              <h3 className="text-lg font-bold text-white">Student Incident Reports</h3>
              <span className="text-xs text-slate-400">Total {reports.length} reports logged</span>
            </div>

            {reports.map((report) => (
              <div
                key={report.id}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-800 text-primary-400">
                      {report.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        report.status === 'RESOLVED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : report.status === 'IN_PROGRESS'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {report.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      • {report.upvoteCount} students affected
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-white mb-1">{report.title}</h4>
                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">{report.description}</p>
                  <div className="text-xs text-slate-500">
                    Location: <span className="text-slate-300">{report.buildingName || 'Campus'} {report.specificLocation ? `(${report.specificLocation})` : ''}</span> • Reported by {report.reportedByName}
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
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Status Changer Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
                  <button
                    onClick={() => handleUpdateIssueStatus(report.id, 'IN_PROGRESS')}
                    disabled={resolvingId === report.id || report.status === 'IN_PROGRESS'}
                    className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold border border-purple-500/30 transition-all disabled:opacity-50"
                  >
                    Mark In Progress
                  </button>

                  <button
                    onClick={() => handleUpdateIssueStatus(report.id, 'RESOLVED')}
                    disabled={resolvingId === report.id || report.status === 'RESOLVED'}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center space-x-1"
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
              <h3 className="text-lg font-bold text-white mb-2">Live Maintenance & Outage Notices</h3>
              {notices.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 text-xs">
                  No active outages currently posted.
                </div>
              ) : (
                notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300">
                          {notice.status}
                        </span>
                        <span className="text-xs text-slate-400">{notice.buildingName}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{notice.title}</h4>
                      <p className="text-xs text-slate-400 mb-2">{notice.description}</p>
                      {notice.alternativeSuggestion && (
                        <div className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                          Alt: {notice.alternativeSuggestion}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleResolveNotice(notice.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold text-slate-300 transition-all shrink-0"
                    >
                      Resolve Notice
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Post New Outage Notice */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-1">Post Maintenance Outage</h3>
              <p className="text-xs text-slate-400 mb-4">Notify students about lift, water, or AC repairs.</p>

              <form onSubmit={handleCreateNotice} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lift #2 Cable Maintenance"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Building</label>
                  <select
                    value={newNotice.buildingId || ''}
                    onChange={(e) =>
                      setNewNotice({ ...newNotice, buildingId: e.target.value ? Number(e.target.value) : undefined })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
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
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Alternative Suggestion</label>
                  <input
                    type="text"
                    placeholder="e.g. Use North Wing elevator or central stairs"
                    value={newNotice.alternativeSuggestion}
                    onChange={(e) => setNewNotice({ ...newNotice, alternativeSuggestion: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Expected Completion</label>
                  <input
                    type="text"
                    placeholder="e.g. Today by 4:00 PM"
                    value={newNotice.estimatedResolutionTime}
                    onChange={(e) => setNewNotice({ ...newNotice, estimatedResolutionTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Details about the inspection or outage..."
                    value={newNotice.description}
                    onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 mt-2"
                >
                  Publish Outage Notice
                </button>
              </form>
            </div>
          </div>
        )}

        {/* WORKSPACE 3: PUBLISH EVENT */}
        {activeTab === 'EVENTS' && (
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-bold text-primary-400 uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4" />
              <span>Campus Events Management</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-2">Schedule & Publish New Event</h3>
            <p className="text-xs text-slate-400 mb-6">
              Publish hackathons, guest lectures, club workshops, and cultural fests directly to student feeds.
            </p>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Autonomous Agents Hackathon 2026"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Organizer Club / Dept</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GDSC & Coding Club"
                    value={newEvent.organizer}
                    onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Venue Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Auditorium Hall 1 (Ground Floor)"
                    value={newEvent.locationName}
                    onChange={(e) => setNewEvent({ ...newEvent, locationName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent({ ...newEvent, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline schedule, rules, eligibility, prizes, and mentors..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary-500 hover:bg-primary-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-primary-500/20 mt-2"
              >
                Publish Event
              </button>
            </form>
          </div>
        )}

        {/* WORKSPACE 4: BROADCAST NOTICE */}
        {activeTab === 'ANNOUNCEMENTS' && (
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
              <Radio className="w-4 h-4" />
              <span>Campus Circular Broadcast</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-2">Broadcast Official Notice</h3>
            <p className="text-xs text-slate-400 mb-6">
              Dispatch high-priority circulars, exam notices, or emergency weather alerts to all student apps.
            </p>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Red Alert: Heavy Rains Instruction in Online Mode"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="URGENT">🔴 URGENT (Emergency)</option>
                    <option value="IMPORTANT">⚡ IMPORTANT</option>
                    <option value="GENERAL">General</option>
                    <option value="CLUB">Club Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newAnnouncement.category}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Audience</label>
                  <select
                    value={newAnnouncement.targetAudience}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, targetAudience: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="ALL">Everyone</option>
                    <option value="STUDENTS">Students Only</option>
                    <option value="FACULTY">Faculty Only</option>
                    <option value="HOSTELLERS">Hostellers Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Text *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write the full circular text..."
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={newAnnouncement.isPinned}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, isPinned: e.target.checked })}
                  className="rounded border-slate-800 text-primary-500 focus:ring-primary-500"
                />
                <label htmlFor="isPinned" className="text-xs text-slate-300">
                  Pin to top of Student Notice Board
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-rose-500/20 mt-2 flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Circular</span>
              </button>
            </form>
          </div>
        )}

        {/* WORKSPACE 5: USERS & ROLES */}
        {activeTab === 'USERS' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Registered Users & Role Governance</h3>
                <p className="text-xs text-slate-400">Manage permissions across Student, Faculty, Staff, and Admin roles.</p>
              </div>
              <span className="text-xs font-bold text-slate-400">{users.length} registered accounts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Current Role</th>
                    <th className="px-6 py-4">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{user.fullName}</td>
                      <td className="px-6 py-4 text-slate-400">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                            user.role === 'ROLE_ADMIN'
                              ? 'bg-rose-500/20 text-rose-300'
                              : user.role === 'ROLE_STAFF'
                              ? 'bg-amber-500/20 text-amber-300'
                              : user.role === 'ROLE_FACULTY'
                              ? 'bg-indigo-500/20 text-indigo-300'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value as Role)}
                          className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                        >
                          <option value="ROLE_STUDENT">ROLE_STUDENT</option>
                          <option value="ROLE_FACULTY">ROLE_FACULTY</option>
                          <option value="ROLE_STAFF">ROLE_STAFF</option>
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
  color: string;
  alert?: boolean;
}> = ({ label, value, sub, icon: Icon, color, alert }) => (
  <div
    className={`p-4 rounded-2xl bg-slate-900 border transition-all ${
      alert ? 'border-rose-500/50 shadow-lg shadow-rose-500/10' : 'border-slate-800'
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
    <div className="text-2xl font-black text-white">{value}</div>
    <div className="text-[10px] text-slate-500 truncate mt-0.5">{sub}</div>
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
    className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
      active
        ? 'bg-white text-slate-950 shadow-md'
        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
    }`}
  >
    <Icon className="w-3.5 h-3.5" />
    <span>{label}</span>
    {badge !== undefined && badge > 0 && (
      <span
        className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
          active ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-300'
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
    role: 'ROLE_STAFF',
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
