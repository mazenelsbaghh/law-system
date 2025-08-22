import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Lawyer {
  id: string
  name: string
  phone?: string
  mobile?: string
  governorate?: string
  gender?: string
  // Database column names (snake_case) - primary
  subscription_amount?: number
  send_method?: string
  total_cases?: number
  consumed_cases?: number
  remaining_cases?: number
  available_cases?: number
  price_per_case?: number
  revenue?: number
  participated?: boolean
  subscribed?: boolean
  received_free_case?: boolean
  is_subscribed?: boolean
  subscription_date?: string
  reorder_date?: string
  reorders?: number
  created_at?: string
  updated_at?: string
  // Legacy fields for backward compatibility (camelCase)
  cases?: number
  maxCases?: number
  availableCases?: number
  pricePerCase?: number
  receivedFreeCase?: boolean
  isSubscribed?: boolean
  lastCaseDate?: string
  // Additional legacy fields
  maxcases?: number
  availablecases?: number
  pricepercase?: number
  receivedfreecase?: boolean
}

export interface Campaign {
  id: string
  name: string
  startDate: string
  endDate: string
  budget: number
  clients: number
  responses: number
  subscribers: number
  revenue: number
  reorders: number
  status: 'نشطة' | 'مكتملة' | 'متوقفة'
  created_at?: string
  updated_at?: string
}



export interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  created_at?: string
  updated_at?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  assignee: string
  priority: 'عالية' | 'متوسطة' | 'منخفضة'
  status: 'جديدة' | 'قيد التنفيذ' | 'مكتملة'
  dueDate: string
  created_at?: string
  updated_at?: string
}