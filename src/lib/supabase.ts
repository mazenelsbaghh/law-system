import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vvcwnokwrtyykfjimvgm.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY'

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