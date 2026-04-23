export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'TRIAL' | 'CANCELLED';

// Matches SchoolRequest.java
export interface SchoolRequest {
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
}

// Matches SchoolResponse.java
export interface SchoolResponse {
  id: number;
  name: string;
  code: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logoUrl: string | null;
  isActive: boolean;
  subscriptionStatus: SubscriptionStatus;
  createdAt: string;
}
