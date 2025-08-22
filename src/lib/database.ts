import { supabase } from './supabase'
import type { Lawyer, Campaign, Expense, Task } from './supabase'

// Lawyers operations
export const lawyersService = {
  async getAll(): Promise<Lawyer[]> {
    const { data, error } = await supabase
      .from('lawyers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(lawyer: Omit<Lawyer, 'id' | 'created_at' | 'updated_at'>): Promise<Lawyer> {
    const { data, error } = await supabase
      .from('lawyers')
      .insert([lawyer])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Lawyer>): Promise<Lawyer> {
    const { data, error } = await supabase
      .from('lawyers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('lawyers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async bulkCreate(lawyers: Omit<Lawyer, 'id' | 'created_at' | 'updated_at'>[]): Promise<Lawyer[]> {
    const { data, error } = await supabase
      .from('lawyers')
      .insert(lawyers)
      .select()
    
    if (error) throw error
    return data || []
  }
}

// Campaigns operations
export const campaignsService = {
  async getAll(): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaign])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}



// Expenses operations
export const expensesService = {
  async getAll(): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Expense>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Tasks operations
export const tasksService = {
  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Database initialization and table creation
export const initializeDatabase = async () => {
  try {
    // Check if tables exist by trying to select from them
    const { error: lawyersError } = await supabase.from('lawyers').select('id').limit(1)
    const { error: campaignsError } = await supabase.from('campaigns').select('id').limit(1)
    const { error: expensesError } = await supabase.from('expenses').select('id').limit(1)
    const { error: tasksError } = await supabase.from('tasks').select('id').limit(1)
    
    // If any table doesn't exist, we need to create the schema
    if (lawyersError || campaignsError || expensesError || tasksError) {
      console.warn('⚠️ Database tables are not found!')
      console.warn('📋 Please run the SQL commands from database-schema.sql in your Supabase dashboard:')
      console.warn('1. Go to https://vvcwnokwrtyykfjimvgm.supabase.co/project/vvcwnokwrtyykfjimvgm/sql')
      console.warn('2. Copy and paste the contents of database-schema.sql')
      console.warn('3. Click "Run" to create the tables')
      console.warn('4. Refresh this page after creating the tables')
      return false
    }
    
    console.log('✅ Database connection successful!')
    return true
  } catch (error) {
    console.error('❌ Database initialization error:', error)
    return false
  }
}