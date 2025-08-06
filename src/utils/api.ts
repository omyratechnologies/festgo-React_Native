import AsyncStorage from '@react-native-async-storage/async-storage';
export const API_URL = 'https://server.festgo.in/api';


export interface ApiResponse<T = any> {
  success: boolean;
  status: number;
  message?: string;
  data?: T;
  properties?: T;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface NearbyHotelsParams {
  latitude: number;
  longitude: number;
  radius?: number;
  property_type?: string;
  location?: string;
  rooms?: string;
  adult?: string;
  child?: string;
  todate?: string;
  enddate?: string;
  staynight?: string;
}

export interface FilterParams extends NearbyHotelsParams {
  userRatings?: string[];
  starRatings?: number[];
  minPrice?: number;
  maxPrice?: number;
  popular?: string[];
  amenities?: string[];
  roomView?: string[];
  roomAmenities?: string[];
}

export const fetchNearbyHotels = async (params: NearbyHotelsParams): Promise<ApiResponse> => {
  try {
    // If location is provided, send location instead of coordinates
    const requestBody = params.location
      ? { ...params, latitude: undefined, longitude: undefined }
      : { ...params, location: undefined };

    // Clean up undefined values
    const cleanRequestBody = Object.fromEntries(
      Object.entries(requestBody).filter(([_, value]) => value !== undefined)
    );

    const response = await fetch(`${API_URL}/properties/p/active-r`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanRequestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching nearby hotels:', error);
    throw error;
  }
};

export const fetchFilteredHotels = async (params: FilterParams): Promise<ApiResponse> => {
  try {
    // If location is provided, send location instead of coordinates
    const requestBody = params.location
      ? { ...params, latitude: undefined, longitude: undefined }
      : { ...params, location: undefined };

    // Clean up undefined values
    const cleanRequestBody = Object.fromEntries(
      Object.entries(requestBody).filter(([_, value]) => value !== undefined)
    );

    const response = await fetch(`${API_URL}/properties/p/filter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanRequestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching filtered hotels:', error);
    throw error;
  }
};

export interface PropertyDetailsParams {
  propertyId: string;
}

export interface RoomSearchParams {
  propertyId: string;
  adults: string;
  children: string;
  requestedRooms: string;
  startDate: string;
  endDate: string;
}

export interface RoomAmenity {
  name: string;
  selected: boolean;
}

export interface RoomAmenityCategory {
  category: string;
  items: RoomAmenity[];
}

export interface Bed {
  icon: string;
  bedType: string;
  quantity: string;
}

export interface SleepingArrangement {
  beds: Bed[];
  max_adults: string;
  base_adults: string;
  max_children: string;
  max_occupancy: string;
  max_extra_beds: number;
}

export interface RoomPrice {
  child_charge: number;
  extra_adult_charge: string;
  base_price_for_2_adults: string;
}

export interface RoomPricing {
  pricePerNight: number;
  originalPrice: number;
  numberOfDays: number;
  usableCoins: number;
  tax: number;
  service_fee: number;
  coinDiscount: number;
  totalPrice: number;
}

export interface Room {
  id: string;
  propertyId: string;
  room_type: string;
  view: string;
  area: string;
  room_name: string;
  number_of_rooms: number;
  description: string;
  sleeping_arrangement: SleepingArrangement;
  bathroom_available: number;
  price: RoomPrice;
  max_adults: number;
  max_children: number;
  free_cancellation: string;
  additional_info: string;
  meal_plan: string;
  inventory_details: any;
  createdAt: string;
  updatedAt: string;
  pricing: RoomPricing;
  cancellationPolicy: string;
  availableRooms: number;
  zero_booking: boolean;
  deadline: string;
  amenities: RoomAmenityCategory[];
  photos: string[];
  videos: string[];
}

export interface RoomsResponse {
  rooms: Room[];
  count: number;
}

export const fetchPropertyDetails = async (params: PropertyDetailsParams): Promise<ApiResponse> => {
  try {
    console.log('Fetching property details for propertyId:', params.propertyId);
    const response = await fetch(`${API_URL}/properties/p/property-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propertyId: params.propertyId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
};


export const fetchUpdatedRooms = async (
  params: RoomSearchParams
): Promise<RoomsResponse> => {
  try {
    console.log('Fetching updated rooms for propertyId:', params.propertyId);

    const jwtToken = await AsyncStorage.getItem('jwtToken');
    if (!jwtToken) {
      throw new Error('JWT token not found');
    }

    const response = await fetch(`${API_URL}/properties/getupdated-room/p`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(params),
    });
    console.log(response)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching updated rooms:', error);
    throw error;
  }
};
