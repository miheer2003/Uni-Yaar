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
    <div className="min-h-screen bg-[#DFDFE0] py-12 px-4 sm:px-6 lg:px-8 text-[#18181B]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#FDFDFD] border border-[#DFDFE0] rounded-full text-[#776BFD] text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Campus Infrastructure</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-[#18181B] tracking-tight"
          >
            Explore <span className="bg-gradient-to-r from-[#776BFD] to-[#F86B7E] bg-clip-text text-transparent">Buildings & Blocks</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-lg text-[#636363] font-medium"
          >
            Find academic departments, lecture halls, computer labs, and faculty offices across your campus.
          </motion.p>

          {/* Search bar */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#636363]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by building name or code (e.g. SOFA, Ramanujan)..."
              className="w-full pl-12 pr-4 py-3.5 bg-[#FDFDFD] border border-[#DFDFE0] rounded-2xl text-[#18181B] placeholder-[#636363]/60 focus:outline-none focus:ring-2 focus:ring-[#776BFD]/20 focus:border-[#776BFD] transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Building Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#776BFD] mb-3" />
            <p className="text-[#636363] text-sm font-medium">Discovering campus buildings...</p>
          </div>
        ) : buildings.length === 0 ? (
          <div className="text-center py-20 bg-[#FDFDFD] border border-[#DFDFE0] rounded-3xl p-8 max-w-lg mx-auto shadow-sm">
            <Building2 className="w-12 h-12 text-[#B6ADC3] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#18181B]">No buildings found</h3>
            <p className="text-[#636363] text-sm mt-1">
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
                className="bg-[#FDFDFD] hover:border-[#B6ADC3] border border-[#DFDFE0] rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(119,107,253,0.08)]"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#776BFD]/10 border border-[#776BFD]/20 rounded-2xl flex items-center justify-center text-[#776BFD] font-extrabold text-lg group-hover:scale-105 transition-transform">
                      {building.code}
                    </div>
                    <span className="inline-flex items-center space-x-1 px-3 py-1 bg-[#DFDFE0]/40 text-[#636363] border border-[#DFDFE0] text-xs font-semibold rounded-full">
                      <Layers className="w-3 h-3 text-[#776BFD]" />
                      <span>{building.totalFloors} Floors</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#18181B] group-hover:text-[#776BFD] transition-colors">
                    {building.name}
                  </h3>
                  <p className="text-[#636363] text-sm mt-2 line-clamp-2 leading-relaxed">
                    {building.description || 'Academic & departmental facility with classrooms, labs, and faculty offices.'}
                  </p>

                  {building.address && (
                    <div className="flex items-center space-x-1.5 text-xs text-[#636363] mt-4 font-medium">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#776BFD]" />
                      <span className="truncate">{building.address}</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-[#DFDFE0] flex items-center justify-between">
                  <div className="text-xs text-[#636363]">
                    Lat: {building.latitude.toFixed(4)}, Long: {building.longitude.toFixed(4)}
                  </div>
                  <Link
                    to={`/buildings/${building.id}`}
                    className="inline-flex items-center space-x-1.5 text-sm font-bold text-[#776BFD] hover:text-[#6455F5] transition-colors"
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
