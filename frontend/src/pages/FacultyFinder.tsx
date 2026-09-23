import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Search, Mail, BookOpen, MapPin, ArrowRight, Loader2, Award } from 'lucide-react';
import { facultyApi } from '../api/client';
import { Faculty } from '../types/faculty';

export default function FacultyFinder() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFaculty();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await facultyApi.getFacultyList(search);
      if (res.data.success && res.data.data) {
        setFacultyList(res.data.data.content || []);
      }
    } catch {
      // Demo fallbacks if empty
      const demoFaculty: Faculty[] = [
        {
          id: 1,
          userId: 101,
          fullName: 'Dr. Anand Joshi',
          email: 'anand.joshi@uniyaar.edu',
          departmentName: 'Computer Engineering',
          designation: 'Head of Department & Professor',
          subjects: 'Database Management Systems, Distributed Systems',
          officeRoomNumber: 'Room 204',
          officeBuildingName: 'SOFA Building',
          officeBuildingCode: 'SOFA',
          bio: 'Ph.D. in Computer Science with 18+ years of research in distributed computing.',
        },
        {
          id: 2,
          userId: 102,
          fullName: 'Prof. Sneha Kulkarni',
          email: 'sneha.kulkarni@uniyaar.edu',
          departmentName: 'Information Technology',
          designation: 'Associate Professor',
          subjects: 'Artificial Intelligence, Machine Learning, Python',
          officeRoomNumber: 'Room 312',
          officeBuildingName: 'Innovation Centre',
          officeBuildingCode: 'IC',
          bio: 'Specializing in Computer Vision, NLP, and AI student mentor.',
        },
        {
          id: 3,
          userId: 103,
          fullName: 'Dr. Rajesh Patil',
          email: 'rajesh.patil@uniyaar.edu',
          departmentName: 'Computer Engineering',
          designation: 'Assistant Professor',
          subjects: 'Data Structures & Algorithms, Java Programming',
          officeRoomNumber: 'Room 105',
          officeBuildingName: 'Ramanujan Block',
          officeBuildingCode: 'RMN',
          bio: 'Author of competitive programming guides with strong student rapport.',
        },
      ];
      setFacultyList(demoFaculty);
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

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Faculty Directory</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
          >
            Find Your <span className="gradient-text">Professors</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-lg text-slate-400"
          >
            Search faculty profiles, scheduled lecture timetables, and find their designated campus offices.
          </motion.p>

          {/* Search bar */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by professor name, department, or subject..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-lg"
            />
          </div>
        </div>

        {/* Faculty Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-3" />
            <p className="text-slate-400 text-sm">Searching faculty records...</p>
          </div>
        ) : facultyList.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 max-w-lg mx-auto">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">No faculty found</h3>
            <p className="text-slate-400 text-sm mt-1">Try another search keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facultyList.map((fac, idx) => (
              <motion.div
                key={fac.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-primary-500/5"
              >
                <div>
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-primary-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-extrabold text-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                      {getInitials(fac.fullName)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors leading-snug">
                        {fac.fullName}
                      </h3>
                      <p className="text-xs text-primary-400 font-medium mt-0.5 flex items-center space-x-1">
                        <Award className="w-3 h-3" />
                        <span>{fac.designation}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{fac.departmentName}</p>
                    </div>
                  </div>

                  {fac.subjects && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-2">
                        <BookOpen className="w-3.5 h-3.5 text-accent-400" />
                        <span className="font-semibold text-slate-300">Teaches:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {fac.subjects.split(',').map((subj, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 bg-slate-800/80 text-slate-300 text-[11px] rounded-md"
                          >
                            {subj.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Office badge */}
                  {fac.officeRoomNumber && (
                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-4 bg-slate-800/30 p-2.5 rounded-xl border border-slate-800">
                      <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                      <span className="truncate">
                        Office: <strong>{fac.officeRoomNumber}</strong> ({fac.officeBuildingName || fac.officeBuildingCode})
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <a
                    href={`mailto:${fac.email}`}
                    className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact</span>
                  </a>
                  <Link
                    to={`/faculty/${fac.id}`}
                    className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <span>View Schedule</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
