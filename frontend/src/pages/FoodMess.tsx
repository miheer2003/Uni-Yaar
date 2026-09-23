import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UtensilsCrossed, 
  Clock, 
  MapPin, 
  Compass, 
  Calendar, 
  Loader2, 
  Coffee, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { foodApi } from '../api/client';
import { FoodFacility, Menu, MealType, DietaryTag } from '../types/food';

export default function FoodMess() {
  const [facilities, setFacilities] = useState<FoodFacility[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [activeMeal, setActiveMeal] = useState<MealType>('LUNCH');
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag>('ALL');
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0); // 0 for today, 1 for tomorrow
  const [loadingOutlets, setLoadingOutlets] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);

  useEffect(() => {
    loadFacilities();
  }, []);

  useEffect(() => {
    if (selectedFacilityId) {
      loadMenu(selectedFacilityId, selectedDayOffset);
    }
  }, [selectedFacilityId, selectedDayOffset]);

  const loadFacilities = async () => {
    setLoadingOutlets(true);
    try {
      const res = await foodApi.getFacilities();
      if (res.data.success && res.data.data && res.data.data.length > 0) {
        setFacilities(res.data.data);
        setSelectedFacilityId(res.data.data[0].id);
      } else {
        // Fallback demo outlets
        const demoOutlets: FoodFacility[] = [
          {
            id: 1,
            name: 'Central Student Mess (Annapurna)',
            type: 'MESS',
            buildingName: 'Hostel Complex Block A',
            buildingCode: 'HOSTEL-A',
            latitude: 18.5180,
            longitude: 73.8148,
            openingTime: '07:30 AM',
            closingTime: '09:30 PM',
            status: 'OPEN',
            description: 'Subsidized daily breakfast, lunch, tea-snacks, and dinner for students & staff.',
          },
          {
            id: 2,
            name: 'Tech Park Canteen (Cafe Bistro)',
            type: 'CANTEEN',
            buildingName: 'SOFA Building Ground Floor',
            buildingCode: 'SOFA',
            latitude: 18.5186,
            longitude: 73.8152,
            openingTime: '08:30 AM',
            closingTime: '10:30 PM',
            status: 'OPEN',
            description: 'South Indian dosas, rolls, parathas, coffee, and quick bites.',
          },
          {
            id: 3,
            name: 'Innovation Cafe & Juice Bar',
            type: 'CAFETERIA',
            buildingName: 'Innovation Centre',
            buildingCode: 'IC',
            latitude: 18.5192,
            longitude: 73.8160,
            openingTime: '09:00 AM',
            closingTime: '08:00 PM',
            status: 'OPEN',
            description: 'Espresso beverages, healthy salads, cold-pressed juices, and bakery items.',
          },
        ];
        setFacilities(demoOutlets);
        setSelectedFacilityId(1);
      }
    } catch {
      // Demo fallbacks handled
    } finally {
      setLoadingOutlets(false);
    }
  };

  const loadMenu = async (facilityId: number, dayOffset: number) => {
    setLoadingMenu(true);
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);
    const dateStr = targetDate.toISOString().split('T')[0];

    try {
      const res = await foodApi.getMenu(facilityId, dateStr);
      if (res.data.success && res.data.data && res.data.data.items?.length > 0) {
        setMenu(res.data.data);
      } else {
        // Fallback realistic demo menu
        const demoMenu: Menu = {
          foodFacilityId: facilityId,
          foodFacilityName: facilities.find((f) => f.id === facilityId)?.name || 'Campus Canteen',
          menuDate: dateStr,
          items: [
            // Breakfast
            { id: 1, mealType: 'BREAKFAST', itemName: 'Steamed Idli with Sambar & Chutney', dietaryTag: 'VEG', price: 40, description: 'Fresh 3 pcs idlis with aromatic lentil sambar' },
            { id: 2, mealType: 'BREAKFAST', itemName: 'Kanda Poha with Sev & Lemon', dietaryTag: 'VEG', price: 30, description: 'Traditional roasted beaten rice with peanuts' },
            { id: 3, mealType: 'BREAKFAST', itemName: 'Jain Poha (No Onion/Garlic)', dietaryTag: 'JAIN', price: 30, description: 'Made with turmeric, peanuts, curry leaves' },
            { id: 4, mealType: 'BREAKFAST', itemName: 'Masala Chai / Filter Coffee', dietaryTag: 'VEG', price: 15, description: 'Hot brewed cutting tea' },
            // Lunch
            { id: 5, mealType: 'LUNCH', itemName: 'Shahi Paneer Thali', dietaryTag: 'VEG', price: 90, description: 'Cottage cheese in rich gravy, 3 Rotis, Jeera Rice, Dal Tadka, Salad' },
            { id: 6, mealType: 'LUNCH', itemName: 'Jain Special Dal Khichdi', dietaryTag: 'JAIN', price: 70, description: 'Comforting moong dal khichdi served with roasted papad' },
            { id: 7, mealType: 'LUNCH', itemName: 'Butter Chicken Curry Plate', dietaryTag: 'NON_VEG', price: 120, description: 'Tender chicken in tomato butter sauce with rice & rotis' },
            { id: 8, mealType: 'LUNCH', itemName: 'South Indian Curd Rice', dietaryTag: 'VEG', price: 50, description: 'Cooling seasoned curd rice with mustard tempering' },
            // Snacks
            { id: 9, mealType: 'SNACKS', itemName: 'Crispy Samosa (2 pcs)', dietaryTag: 'VEG', price: 30, description: 'Potato & pea filled flaky pastry with mint chutney' },
            { id: 10, mealType: 'SNACKS', itemName: 'Paneer Kathi Roll', dietaryTag: 'VEG', price: 60, description: 'Grilled spiced cottage cheese wrapped in roomali roti' },
            { id: 11, mealType: 'SNACKS', itemName: 'Egg Roll', dietaryTag: 'NON_VEG', price: 50, description: 'Double egg wrapped with crunchy onions and sauces' },
            // Dinner
            { id: 12, mealType: 'DINNER', itemName: 'Veg Kolhapuri with Tawa Parathas', dietaryTag: 'VEG', price: 85, description: 'Spicy mixed vegetables curry served with hot parathas' },
            { id: 13, mealType: 'DINNER', itemName: 'Yellow Dal Tadka & Steamed Rice', dietaryTag: 'VEG', price: 65, description: 'Light comforting dinner thali' },
            { id: 14, mealType: 'DINNER', itemName: 'Jain Matar Paneer Thali', dietaryTag: 'JAIN', price: 90, description: 'Green peas and paneer without onion/garlic' },
          ],
        };
        setMenu(demoMenu);
      }
    } catch {
      // Fallback already set
    } finally {
      setLoadingMenu(false);
    }
  };

  const selectedFacility = facilities.find((f) => f.id === selectedFacilityId);

  const filteredItems = menu?.items.filter((item) => {
    const mealMatch = item.mealType === activeMeal;
    const dietaryMatch = selectedDietary === 'ALL' || item.dietaryTag === selectedDietary;
    return mealMatch && dietaryMatch;
  }) || [];

  const getDietaryBadge = (tag: string) => {
    switch (tag) {
      case 'VEG':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">🟢 Veg</span>;
      case 'JAIN':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">🟡 Jain</span>;
      case 'NON_VEG':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">🔴 Non-Veg</span>;
      default:
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300">Special</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Gen-Z / Indian Brand Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Campus Dining & Mess</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
          >
            Khane Ka <span className="gradient-text">Kya Scene Hai?</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-lg text-slate-400"
          >
            Check today's mess menu, canteen timings, live availability, and dietary choices across campus.
          </motion.p>
        </div>

        {/* Canteen / Mess Outlet Cards Selector */}
        {loadingOutlets ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 animate-pulse h-36">
                <div className="h-4 bg-slate-800 rounded w-1/4 mb-3" />
                <div className="h-6 bg-slate-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-800 rounded w-full mb-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {facilities.map((outlet) => {
            const isSelected = outlet.id === selectedFacilityId;
            return (
              <button
                key={outlet.id}
                onClick={() => setSelectedFacilityId(outlet.id)}
                className={`text-left p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900 border-primary-500 shadow-xl shadow-primary-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-400">
                    {outlet.type}
                  </span>
                  <span className={`inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    outlet.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {outlet.status === 'OPEN' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>{outlet.status}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1.5 leading-snug">
                  {outlet.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {outlet.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-accent-400" />
                    <span>{outlet.openingTime} – {outlet.closingTime}</span>
                  </div>
                  {outlet.buildingName && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[120px]">{outlet.buildingName}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        )}

        {/* Active Canteen Info & Map Navigation */}
        {selectedFacility && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 mb-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-primary-400 font-semibold mb-1">
                <Coffee className="w-4 h-4" />
                <span>Selected Outlet Details</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                {selectedFacility.name}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Located at {selectedFacility.buildingName || 'Campus Central Block'} • Open today until {selectedFacility.closingTime}
              </p>
            </div>

            {selectedFacility.latitude && selectedFacility.longitude && (
              <Link
                to={`/map?lat=${selectedFacility.latitude}&lng=${selectedFacility.longitude}&name=${encodeURIComponent(selectedFacility.name)}`}
                className="btn-primary inline-flex items-center space-x-2 py-3 px-5 rounded-xl font-semibold shadow-lg shadow-primary-500/20 self-start sm:self-auto"
              >
                <Compass className="w-4 h-4" />
                <span>Navigate on Map</span>
              </Link>
            )}
          </div>
        )}

        {/* Date Selector & Meal Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Day Switcher */}
          <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 w-fit">
            <button
              onClick={() => setSelectedDayOffset(0)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDayOffset === 0
                  ? 'bg-primary-500 text-slate-950 shadow-md shadow-primary-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Today's Menu</span>
            </button>
            <button
              onClick={() => setSelectedDayOffset(1)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDayOffset === 1
                  ? 'bg-primary-500 text-slate-950 shadow-md shadow-primary-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Tomorrow's Menu</span>
            </button>
          </div>

          {/* Dietary Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {(['ALL', 'VEG', 'JAIN', 'NON_VEG'] as DietaryTag[]).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedDietary(tag)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  selectedDietary === tag
                    ? 'bg-slate-800 text-white border-primary-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {tag === 'ALL' ? '🍽️ All Diets' : tag === 'VEG' ? '🟢 Pure Veg' : tag === 'JAIN' ? '🟡 Jain' : '🔴 Non-Veg'}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Category Tabs (Breakfast, Lunch, Snacks, Dinner) */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto scrollbar-none">
          {(['BREAKFAST', 'LUNCH', 'SNACKS', 'DINNER'] as MealType[]).map((meal) => {
            const isCurrent = activeMeal === meal;
            return (
              <button
                key={meal}
                onClick={() => setActiveMeal(meal)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isCurrent
                    ? 'bg-primary-500 text-slate-950 shadow-lg shadow-primary-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {meal === 'BREAKFAST' ? '🌅 Breakfast' : meal === 'LUNCH' ? '🍛 Lunch' : meal === 'SNACKS' ? '☕ Snacks' : '🌙 Dinner'}
              </button>
            );
          })}
        </div>

        {/* Menu Items Grid */}
        {loadingMenu ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-3" />
            <p className="text-slate-400 text-sm">Fetching fresh mess menu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto">
            <UtensilsCrossed className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No items found</h3>
            <p className="text-slate-400 text-sm mt-1">
              No menu items matching "{selectedDietary}" for {activeMeal.toLowerCase()}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-slate-900/90 border border-slate-850 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-base font-bold text-white leading-tight">
                      {item.itemName}
                    </h4>
                    {item.price && (
                      <span className="text-sm font-extrabold text-primary-400 ml-2">
                        ₹{item.price}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {item.description || 'Prepared fresh daily as per university mess quality standards.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  {getDietaryBadge(item.dietaryTag)}
                  <span className="text-[11px] text-slate-500">
                    {activeMeal}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
