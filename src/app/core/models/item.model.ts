export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  brand: string;
  status: ItemStatus;
  purchaseDate?: string;
  warrantyExpiry?: string;
  serialNumber?: string;
}

export enum ItemCategory {
  PHONE = 'phone',
  LAPTOP = 'laptop',
  TABLET = 'tablet',
  WATCH = 'watch',
  CAMERA = 'camera',
  OTHER = 'other'
}

export enum ItemStatus {
  ACTIVE = 'active',
  IN_REPAIR = 'in_repair',
  WARRANTY_EXPIRED = 'warranty_expired',
  SOLD = 'sold'
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  query: string;
  context?: Record<string, any>;
}

export interface ChatResponse {
  response: string;
  agent_used?: boolean;
  tool_calls?: any[];
  model?: string;
}

export interface RepairBooking {
  id: string;
  item_id: string;
  issue: string;
  status: string;
  created_at: string;
  estimated_completion?: string;
}
