import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  UtensilsCrossed, 
  Layers, 
  Compass, 
  Navigation, 
  X, 
  ArrowRight,
  ArrowLeft,
  Clock,
  Footprints,
  RotateCcw
} from 'lucide-react';
import { mapApi } from '../api/client';
import { MapMarker, MapCategory, RouteData } from '../types/map';

// Custom colored leaflet div icons
const createCustomIcon = (category: string, isSelected: boolean) => {
  let bgColor = '#3b82f6'; // blue
  let iconLetter = 'B';

  if (category === 'FOOD') {
    bgColor = '#f97316'; // orange
    iconLetter = 'F';
  } else if (category === 'WASHROOM') {
    bgColor = '#14b8a6'; // teal
    iconLetter = 'W';
  } else if (category === 'LAB') {
    bgColor = '#a855f7'; // purple
    iconLetter = 'L';
  } else if (category === 'FACILITY') {
    bgColor = '#eab308'; // yellow
    iconLetter = '★';
  }

  const border = isSelected ? 'border: 3px solid #f59e0b; transform: scale(1.15);' : 'border: 2px solid white;';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${bgColor};
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 800;
        font-size: 13px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        ${border}
        transition: all 0.2s ease;
      ">
        ${iconLetter}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
  });
};

const userOriginIcon = L.divIcon({
  className: 'user-origin-marker',
  html: `
    <div style="
      background: #10b981;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 15px #10b981;
    "></div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

// Map controller component for smooth flying to coordinates
function MapFlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

export default function CampusMap() {
  const [searchParams] = useSearchParams();
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MapCategory>('ALL');
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteData | null>(null);

  // Default campus center: Pune / MIT / Generic Indian Tech Campus coordinates
  const campusCenter: [number, number] = [18.5186, 73.8152];
  const [mapCenter, setMapCenter] = useState<[number, number]>(campusCenter);
  const [mapZoom, setMapZoom] = useState(17);

  // Campus Main Entrance Origin point
  const mainGateCoords: [number, number] = [18.5173, 73.8139];

  useEffect(() => {
    loadMarkers();
  }, [selectedCategory]);

  useEffect(() => {
    // Prevent backspace from zooming/scrolling map
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' && e.target === document.body) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const nameParam = searchParams.get('name');

    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);
      setMapCenter([lat, lng]);
      setMapZoom(18);

      if (nameParam) {
        setSelectedMarker({
          id: 'bldg-query',
          title: decodeURIComponent(nameParam),
          category: 'BUILDING',
          latitude: lat,
          longitude: lng,
          status: 'OPEN',
          description: 'Navigated directly from campus directory.',
        });
      }
    }
  }, [searchParams]);

  const loadMarkers = async () => {
    try {
      const res = await mapApi.getMarkers(selectedCategory);
      if (res.data.success && res.data.data) {
        setMarkers(res.data.data);
      }
    } catch {
      // Fallback demo markers if database not yet seeded
      const fallbackMarkers: MapMarker[] = [
        {
          id: 'sofa',
          title: 'SOFA Building (School of Fine Arts & Design)',
          category: 'BUILDING',
          latitude: 18.5186,
          longitude: 73.8152,
          buildingCode: 'SOFA',
          floorNumber: 4,
          status: 'OPEN',
          description: 'Central building hosting design studios, labs, and faculty offices.',
        },
        {
          id: 'innovation',
          title: 'Innovation Centre',
          category: 'BUILDING',
          latitude: 18.5192,
          longitude: 73.8160,
          buildingCode: 'IC',
          floorNumber: 3,
          status: 'OPEN',
          description: 'Robotics labs, AI research centre, and hackathon arenas.',
        },
        {
          id: 'canteen-main',
          title: 'Central Campus Canteen',
          category: 'FOOD',
          latitude: 18.5180,
          longitude: 73.8148,
          status: 'OPEN',
          description: 'Breakfast, North/South Indian meals, snacks, and fresh juices.',
        },
        {
          id: 'ramanujan',
          title: 'Ramanujan Academic Block',
          category: 'BUILDING',
          latitude: 18.5178,
          longitude: 73.8165,
          buildingCode: 'RMN',
          floorNumber: 5,
          status: 'OPEN',
          description: 'Computer Science & Engineering lecture theatres.',
        },
      ];
      setMarkers(fallbackMarkers);
    }
  };

  const handleSelectMarker = (marker: MapMarker) => {
    setSelectedMarker(marker);
    setMapCenter([marker.latitude, marker.longitude]);
    setMapZoom(18);
    setActiveRoute(null);
  };

  const handleStartNavigation = (marker: MapMarker) => {
    // Generate simulated walking path coordinates from Main Gate to Target Marker
    const midPoint1: [number, number] = [
      mainGateCoords[0] + (marker.latitude - mainGateCoords[0]) * 0.45,
      mainGateCoords[1] + (marker.longitude - mainGateCoords[1]) * 0.2,
    ];
    const midPoint2: [number, number] = [
      mainGateCoords[0] + (marker.latitude - mainGateCoords[0]) * 0.8,
      mainGateCoords[1] + (marker.longitude - mainGateCoords[1]) * 0.75,
    ];

    const pathCoords: [number, number][] = [
      mainGateCoords,
      midPoint1,
      midPoint2,
      [marker.latitude, marker.longitude],
    ];

    // Rough distance calculation
    const distanceMeters = Math.round(
      Math.hypot(
        (marker.latitude - mainGateCoords[0]) * 111000,
        (marker.longitude - mainGateCoords[1]) * 111000
      )
    );
    const walkingMinutes = Math.max(1, Math.round(distanceMeters / 75)); // ~75m/min walking speed

    setActiveRoute({
      originName: 'Main Campus Gate',
      destinationName: marker.title,
      distanceMeters,
      walkingMinutes,
      coordinates: pathCoords,
      steps: [
        { instruction: 'Start at Main Campus Gate facing north', distanceMeters: 50, durationSeconds: 40 },
        { instruction: 'Walk along the Central Promenade towards Fountain Circle', distanceMeters: Math.round(distanceMeters * 0.5), durationSeconds: 180 },
        { instruction: `Turn right towards ${marker.title}`, distanceMeters: Math.round(distanceMeters * 0.45), durationSeconds: 150 },
        { instruction: `Arrive at ${marker.title} Entrance`, distanceMeters: 10, durationSeconds: 15 },
      ],
    });
  };

  const categories: { label: string; value: MapCategory; icon: typeof Building2 }[] = [
    { label: 'All Places', value: 'ALL', icon: Compass },
    { label: 'Buildings', value: 'BUILDING', icon: Building2 },
    { label: 'Food & Mess', value: 'FOOD', icon: UtensilsCrossed },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden flex flex-col">
      {/* Category Pills Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-2xl pointer-events-auto overflow-x-auto scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-primary-500 text-slate-950 shadow-md shadow-primary-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
          
          <Link
            to="/"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all ml-2 border-l border-slate-700 pl-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </Link>
        </div>

        {activeRoute && (
          <button
            onClick={() => setActiveRoute(null)}
            className="pointer-events-auto px-3.5 py-2 bg-rose-500/90 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center space-x-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Exit Navigation</span>
          </button>
        )}
      </div>

      {/* Main Leaflet Map View */}
      <div className="w-full h-full">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          keyboard={false}
          style={{ width: '100%', height: '100%', background: '#090d16' }}
        >
          <MapFlyTo center={mapCenter} zoom={mapZoom} />

          {/* Clean CartoDB Dark Matter OpenStreetMap tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* User Starting Origin Pin (Main Gate) */}
          {activeRoute && (
            <Marker position={mainGateCoords} icon={userOriginIcon}>
              <Popup>
                <div className="text-xs font-bold">Start: Main Campus Gate</div>
              </Popup>
            </Marker>
          )}

          {/* Campus Location Pins */}
          {markers.map((marker) => {
            const isSelected = selectedMarker?.id === marker.id;
            return (
              <Marker
                key={marker.id}
                position={[marker.latitude, marker.longitude]}
                icon={createCustomIcon(marker.category, isSelected)}
                eventHandlers={{
                  click: () => handleSelectMarker(marker),
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-1">
                    <p className="font-bold text-sm text-slate-900">{marker.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{marker.category}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Glowing Animated Walking Path */}
          {activeRoute && (
            <>
              {/* Outer soft glow line */}
              <Polyline
                positions={activeRoute.coordinates}
                pathOptions={{
                  color: '#3b82f6',
                  weight: 8,
                  opacity: 0.4,
                  lineCap: 'round',
                }}
              />
              {/* Inner crisp dashed path */}
              <Polyline
                positions={activeRoute.coordinates}
                pathOptions={{
                  color: '#f59e0b',
                  weight: 4,
                  opacity: 0.95,
                  dashArray: '8, 8',
                  lineCap: 'round',
                }}
              />
            </>
          )}
        </MapContainer>
      </div>

      {/* Floating Location Details Drawer */}
      <AnimatePresence>
        {selectedMarker && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-[1000] bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 bg-primary-500/20 text-primary-400 text-[11px] font-bold rounded-md uppercase tracking-wider">
                  {selectedMarker.category}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-2 leading-tight">
                  {selectedMarker.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
              {selectedMarker.description || 'Verified campus destination with indoor directory.'}
            </p>

            {/* Coordinates / Metadata */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center space-x-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-primary-400" />
                <span>{selectedMarker.latitude.toFixed(4)}, {selectedMarker.longitude.toFixed(4)}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-400">
                <Layers className="w-3.5 h-3.5 text-accent-400" />
                <span>Status: <strong className="text-emerald-400">{selectedMarker.status}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 mt-5">
              <button
                onClick={() => handleStartNavigation(selectedMarker)}
                className="flex-1 btn-primary py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs font-bold shadow-md shadow-primary-500/25"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate Route</span>
              </button>

              {selectedMarker.buildingId && (
                <Link
                  to={`/buildings/${selectedMarker.buildingId}`}
                  className="btn-secondary py-2.5 px-4 rounded-xl flex items-center justify-center space-x-1.5 text-xs font-bold"
                >
                  <span>Floors</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Walking Route Navigation Banner */}
      <AnimatePresence>
        {activeRoute && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="absolute top-20 left-4 right-4 sm:left-6 sm:w-96 z-[1000] bg-slate-900/95 backdrop-blur-xl border border-primary-500/40 rounded-3xl p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center">
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">Walking Navigation</h4>
                  <p className="text-[11px] text-slate-400">To: {activeRoute.destinationName}</p>
                </div>
              </div>
            </div>

            {/* Metric badges */}
            <div className="flex items-center space-x-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 mb-3 text-xs">
              <div className="flex items-center space-x-1.5">
                <Footprints className="w-4 h-4 text-primary-400" />
                <span className="text-white font-bold">{activeRoute.distanceMeters} m</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-accent-400" />
                <span className="text-white font-bold">{activeRoute.walkingMinutes} min walk</span>
              </div>
            </div>

            {/* Step 1 direction */}
            <div className="text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50">
              <strong className="text-primary-400 block mb-0.5">Next step:</strong>
              {activeRoute.steps[0]?.instruction}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
