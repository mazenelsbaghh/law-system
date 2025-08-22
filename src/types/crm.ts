export interface Lawyer {
  id: string;
  name: string;
  phone?: string;
  mobile?: string;
  governorate?: string;
  gender?: string;
  campaignId?: string;
  status?: 'active' | 'inactive';
  // Database column names (snake_case)
  total_cases?: number;
  consumed_cases?: number;
  remaining_cases?: number;
  available_cases?: number;
  price_per_case?: number;
  subscription_amount?: number;
  send_method?: string;
  received_free_case?: boolean;
  is_subscribed?: boolean;
  subscription_date?: string;
  reorder_date?: string;
  reorders?: number;
  created_at?: string;
  updated_at?: string;
  // Legacy fields for backward compatibility
  maxCases?: number;
  availableCases?: number;
  takenCases?: number;
  pricePerCase?: number;
  revenue?: number;
  isSubscribed?: boolean;
  hasFreeCaseUsed?: boolean;
  notes?: string;
  lastCaseDate?: string;
  cases?: number;
  participated?: boolean;
  subscribed?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  budget?: number;
  clients: number;
  responses: number;
  subscribers: number;
  revenue?: number;
  reorders: number;
  status: 'active' | 'completed' | 'paused';
  lawyersData?: LawyerCampaignData[];
}

export interface LawyerCampaignData {
  id: string;
  name: string;
  phone: string;
  governorate?: string;
  isSubscribed: boolean;
  hasFreeCaseUsed: boolean;
  status: 'subscribed' | 'not_subscribed' | 'free_case_used';
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  description?: string;
  sprintNumber: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  type: 'operational' | 'marketing' | 'legal' | 'lawyer_orders' | 'other';
}

export interface Budget {
  id: string;
  totalBudget: number;
  usedBudget: number;
  remainingBudget: number;
  month: string;
  year: number;
}

export interface LawyerOrder {
  id: string;
  lawyerId: string;
  lawyerName: string;
  requestedCases: number;
  pricePerCase: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  dateCreated: string;
  notes?: string;
}