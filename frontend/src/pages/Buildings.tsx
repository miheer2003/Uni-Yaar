import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Search, Layers, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { campusApi } from '../api/client';
import { Building } from '../types/campus';

export default function Buildings() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBuildings();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const res = await campusApi.getBuildings(search);
      if (res.data.success && res.data.data) {
        setBuildings(res.data.data.content || []);
      }
    } catch {
      // Fallback empty list
      setBuildings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Campus Infrastructure</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
          >
            Explore <span className="gradient-text">Buildings & Blocks</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-lg text-slate-400"
          >
            Find academic departments, lecture halls, computer labs, and faculty offices across your campus.
          </motion.p>

          {/* Search bar */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by building name or code (e.g. SOFA, Ramanujan)..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-lg"
            />
          </div>
        </div>

        {/* Building Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-3" />
            <p className="text-slate-400 text-sm">Discovering campus buildings...</p>
          </div>
        ) : buildings.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800/80 rounded-3xl p-8 max-w-lg mx-auto">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">No buildings found</h3>
            <p className="text-slate-400 text-sm mt-1">
              Try searching with another keyword or explore the default list.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.map((building, idx) => (
              <motion.div
                key={building.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-primary-500/5"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-500/10 border border-primary-500/30 rounded-xl flex items-center justify-center text-primary-400 font-bold text-lg group-hover:scale-105 transition-transform">
                      {building.code}
                    </div>
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-full">
                      <Layers className="w-3 h-3 text-accent-400" />
                      <span>{building.totalFloors} Floors</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                    {building.name}
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                    {building.description || 'Academic & departmental facility with classrooms, labs, and faculty offices.'}
                  </p>

                  {building.address && (
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-4">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{building.address}</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Lat: {building.latitude.toFixed(4)}, Long: {building.longitude.toFixed(4)}
                  </div>
                  <Link
                    to={`/buildings/${building.id}`}
                    className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <span>View Rooms</span>
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
