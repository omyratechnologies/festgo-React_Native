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
