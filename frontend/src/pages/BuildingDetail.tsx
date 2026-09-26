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
        return 'bg-[#776BFD]/10 text-[#776BFD] border-[#776BFD]/20';
      case 'LAB':
        return 'bg-[#B6ADC3]/20 text-[#636363] border-[#B6ADC3]/30';
      case 'FACULTY_OFFICE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CONFERENCE_HALL':
      case 'AUDITORIUM':
        return 'bg-[#F86B7E]/10 text-[#F86B7E] border-[#F86B7E]/20';
      case 'WASHROOM':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANTEEN':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-[#DFDFE0]/40 text-[#636363] border-[#DFDFE0]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#DFDFE0] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#776BFD] mb-3" />
        <p className="text-[#636363] font-medium">Loading building directory...</p>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="min-h-screen bg-[#DFDFE0] py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-[#18181B] mb-2">Building not found</h2>
        <Link to="/buildings" className="text-[#776BFD] hover:underline font-semibold">Back to all buildings</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#DFDFE0] py-10 px-4 sm:px-6 lg:px-8 text-[#18181B]">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          to="/buildings"
          className="inline-flex items-center space-x-1 text-sm text-[#636363] hover:text-[#18181B] mb-6 transition-colors font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>All Buildings</span>
        </Link>

        {/* Building Hero Header */}
        <div className="bg-[#FDFDFD] border border-[#DFDFE0] rounded-3xl p-6 sm:p-8 mb-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="px-3 py-1 bg-[#776BFD]/10 text-[#776BFD] font-extrabold text-sm rounded-xl border border-[#776BFD]/20">
                  {building.code}
                </span>
                <span className="text-xs text-[#636363] font-semibold flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-[#776BFD]" />
                  <span>{building.totalFloors} Total Floors</span>
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#18181B] tracking-tight">
                {building.name}
              </h1>
              <p className="text-[#636363] mt-2 max-w-2xl text-sm sm:text-base font-medium">
                {building.description || 'Academic block housing state-of-the-art classrooms, labs, and faculty spaces.'}
              </p>
              {building.address && (
                <div className="flex items-center space-x-2 text-xs text-[#636363] mt-4 font-medium">
                  <MapPin className="w-4 h-4 text-[#776BFD]" />
                  <span>{building.address}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to={`/map?lat=${building.latitude}&lng=${building.longitude}&name=${encodeURIComponent(building.name)}`}
                className="btn-primary inline-flex items-center space-x-2 py-3 px-5 rounded-2xl font-semibold shadow-md shadow-[#776BFD]/25"
              >
                <Compass className="w-4 h-4" />
                <span>Navigate on Map</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Floor Selection Tabs */}
        <div className="mb-6">
          <h2 className="text-lg font-black text-[#18181B] mb-3 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#776BFD]" />
            <span>Select Floor</span>
          </h2>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {floors.map((floor) => {
              const isSelected = floor.id === selectedFloorId;
              return (
                <button
                  key={floor.id}
                  onClick={() => setSelectedFloorId(floor.id)}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? 'bg-[#776BFD] text-white border-[#776BFD] shadow-md shadow-[#776BFD]/25'
                      : 'bg-[#FDFDFD] text-[#636363] border-[#DFDFE0] hover:text-[#18181B] hover:border-[#B6ADC3]'
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
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#636363]">
                Rooms on {selectedFloor.name} ({selectedFloor.rooms?.length || 0})
              </h3>
            </div>

            {!selectedFloor.rooms || selectedFloor.rooms.length === 0 ? (
              <div className="text-center py-12 bg-[#FDFDFD] border border-[#DFDFE0] rounded-3xl p-6 shadow-sm">
                <DoorClosed className="w-8 h-8 text-[#B6ADC3] mx-auto mb-2" />
                <p className="text-[#636363] text-sm font-medium">No rooms mapped on this floor yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedFloor.rooms.map((room) => (
                  <motion.div
                    key={room.id}
                    whileHover={{ y: -2 }}
                    className="bg-[#FDFDFD] border border-[#DFDFE0] hover:border-[#B6ADC3] rounded-2xl p-5 transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-lg font-black text-[#18181B]">
                        {room.roomNumber}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getRoomTypeColor(room.roomType)}`}>
                        {room.roomType.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#18181B] mb-1">
                      {room.name}
                    </h4>

                    {room.indoorDescription && (
                      <p className="text-xs text-[#636363] line-clamp-2 mb-3 leading-relaxed">
                        {room.indoorDescription}
                      </p>
                    )}

                    <div className="flex items-center space-x-3 text-xs text-[#636363] pt-2 border-t border-[#DFDFE0]">
                      {room.capacity && (
                        <div className="flex items-center space-x-1 font-medium">
                          <Users className="w-3.5 h-3.5 text-[#776BFD]" />
                          <span>Cap: {room.capacity}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1 font-medium">
                        <BookOpen className="w-3.5 h-3.5 text-[#B6ADC3]" />
                        <span>Indoor Spot</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#FDFDFD] border border-[#DFDFE0] rounded-3xl shadow-sm">
            <p className="text-[#636363] font-medium">No floor data available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
