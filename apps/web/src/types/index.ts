export interface Bid {
  id: string;
  load_id: string;
  carrier_id: string;
  amount: number;
  currency: string;
  notes?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED';
  created_at: string;
}

export interface Load {
  id: string;
  owner_user_id: string;
  title: string;
  description: string;
  origin_city: string;
  origin_state: string;
  origin_zip?: string;
  destination_city: string;
  destination_state: string;
  destination_zip?: string;
  pickup_date: string;
  delivery_date: string;
  mileage?: number;
  rate_per_mile?: number;
  equipment_type: string;
  weight: number;
  weight_unit: string;
  rate: number;
  currency: string;
  status: 'OPEN' | 'ASSIGNED' | 'HEADING_TO_PICKUP' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  pod_document_id?: string;
}
