import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  ChevronLeft, 
  Layers, 
  DoorClosed, 
  Users, 
  BookOpen, 
  Compass, 
  Loader2 
} from 'lucide-react';
import { campusApi } from '../api/client';
import { Building, Floor } from '../types/campus';

export default function BuildingDetail() {
  const { id } = useParams<{ id: string }>();
  const [building, setBuilding] = useState<Building | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData(parseInt(id, 10));
    }
  }, [id]);

  const loadData = async (buildingId: number) => {
    setLoading(true);
    try {
      const [bldgRes, floorsRes] = await Promise.all([
        campusApi.getBuilding(buildingId),
        campusApi.getFloors(buildingId),
      ]);

      if (bldgRes.data.success && bldgRes.data.data) {
        setBuilding(bldgRes.data.data);
      }
      if (floorsRes.data.success && floorsRes.data.data) {
        const floorList = floorsRes.data.data;
        setFloors(floorList);
        if (floorList.length > 0) {
          setSelectedFloorId(floorList[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load building data', e);
    } finally {
      setLoading(false);
    }
  };

  const selectedFloor = floors.find((f) => f.id === selectedFloorId);

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'CLASSROOM':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'LAB':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'FACULTY_OFFICE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'CONFERENCE_HALL':
      case 'AUDITORIUM':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'WASHROOM':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'CANTEEN':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-3" />
        <p className="text-slate-400">Loading building directory...</p>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="min-h-screen bg-slate-950 py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Building not found</h2>
        <Link to="/buildings" className="text-primary-400 hover:underline">Back to all buildings</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          to="/buildings"
          className="inline-flex items-center space-x-1 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>All Buildings</span>
        </Link>

        {/* Building Hero Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 font-extrabold text-sm rounded-lg border border-primary-500/30">
                  {building.code}
                </span>
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-accent-400" />
                  <span>{building.totalFloors} Total Floors</span>
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {building.name}
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl text-sm sm:text-base">
                {building.description || 'Academic block housing state-of-the-art classrooms, labs, and faculty spaces.'}
              </p>
              {building.address && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 mt-4">
                  <MapPin className="w-4 h-4 text-primary-400" />
                  <span>{building.address}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to={`/map?lat=${building.latitude}&lng=${building.longitude}&name=${encodeURIComponent(building.name)}`}
                className="btn-primary inline-flex items-center space-x-2 py-3 px-5 rounded-xl font-semibold shadow-lg shadow-primary-500/20"
              >
                <Compass className="w-4 h-4" />
                <span>Navigate on Map</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Floor Selection Tabs */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-primary-400" />
            <span>Select Floor</span>
          </h2>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {floors.map((floor) => {
              const isSelected = floor.id === selectedFloorId;
              return (
                <button
                  key={floor.id}
                  onClick={() => setSelectedFloorId(floor.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                    isSelected
                      ? 'bg-primary-500 text-slate-950 border-primary-500 shadow-lg shadow-primary-500/20'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {floor.name} (Floor {floor.floorNumber})
                </button>
              );
            })}
          </div>
        </div>

        {/* Rooms Display for Selected Floor */}
        {selectedFloor ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold text-slate-300">
                Rooms on {selectedFloor.name} ({selectedFloor.rooms?.length || 0})
              </h3>
            </div>

            {!selectedFloor.rooms || selectedFloor.rooms.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                <DoorClosed className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No rooms mapped on this floor yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedFloor.rooms.map((room) => (
                  <motion.div
                    key={room.id}
                    whileHover={{ y: -2 }}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-lg font-bold text-white">
                        {room.roomNumber}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getRoomTypeColor(room.roomType)}`}>
                        {room.roomType.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-sm font-medium text-slate-200 mb-1">
                      {room.name}
                    </h4>

                    {room.indoorDescription && (
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {room.indoorDescription}
                      </p>
                    )}

                    <div className="flex items-center space-x-3 text-xs text-slate-500 pt-2 border-t border-slate-800/80">
                      {room.capacity && (
                        <div className="flex items-center space-x-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>Cap: {room.capacity}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Indoor Spot</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
            <p className="text-slate-400">No floor data available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
