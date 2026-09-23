export type FoodType = 'MESS' | 'CANTEEN' | 'CAFETERIA' | 'FOOD_STALL';
export type MealType = 'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER';
export type DietaryTag = 'ALL' | 'VEG' | 'NON_VEG' | 'JAIN' | 'SPECIAL';

export interface FoodFacility {
  id: number;
  name: string;
  type: FoodType;
  buildingId?: number;
  buildingName?: string;
  buildingCode?: string;
  latitude?: number;
  longitude?: number;
  openingTime: string;
  closingTime: string;
  status: string; // OPEN, CLOSED
  description?: string;
}

export interface MenuItem {
  id: number;
  mealType: MealType;
  itemName: string;
  dietaryTag: string;
  price?: number;
  description?: string;
}

export interface Menu {
  id?: number;
  foodFacilityId: number;
  foodFacilityName: string;
  menuDate: string;
  items: MenuItem[];
}
