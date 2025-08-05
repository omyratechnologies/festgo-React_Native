export interface LoginHistory {
  id: string;
  userId: string;
  deviceModel: string;
  deviceBrand: string;
  osVersion: string;
  location: string;
  platform: string;
  loginTime: string;
}

export interface GstDetail {
  id: string;
  gstNumber: string;
  companyName: string;
  address: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  location: string;
  email: string;
  number: string;
  image_url: string;
  date_of_birth: string;
  gender: string;
  mobile_verified: boolean;
  email_verified: boolean;
  role: string;
  status: string;
  logintype: string | null;
  pincode: string;
  state: string;
  referralCode: string;
  billing_address: string;
  createdAt: string;
  updatedAt: string;
  festgo_coins: number;
  loginHistories: LoginHistory[];
  bookingsCount: number;
  gst_details: GstDetail[];
  profileCompletion: number;
  offers: number;
}

export interface UserProfileResponse {
  success: boolean;
  user: User;
  status: number;
}

export interface UserStore {
  userData: User | null;
  isLoading: boolean;
  error: string | null;
  setUserData: (data: User) => void;
  clearUserData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchUserProfile: () => Promise<void>;
} 