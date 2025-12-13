export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string | null
          address: string | null
          township: string | null
          created_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['customers']['Row']>
      }
      systems: {
        Row: {
          id: string
          customer_id: string
          system_type: string | null
          flow_rate_lph: number | null
          location: string | null
          installed_at: string | null
          notes: string | null
          created_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['systems']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['systems']['Row']>
      }
      system_filters: {
        Row: {
          id: string
          system_id: string
          template_id: string
          life_days_override: number | null
          last_changed_at: string | null
          created_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['system_filters']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['system_filters']['Row']>
      }
      filter_templates: {
        Row: {
          id: string
          name: string
          default_life_days: number | null
          stage_order: number | null
        }
        Insert: Omit<Database['public']['Tables']['filter_templates']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['filter_templates']['Row']>
      }
      maintenance_tickets: {
        Row: {
          id: string
          customer_id: string
          system_id: string
          status: string | null
          subject: string | null
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['maintenance_tickets']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['maintenance_tickets']['Row']>
      }
      maintenance_logs: {
        Row: {
          id: string
          system_id: string
          performed_at: string | null
          summary: string | null
          technician_name: string | null
          next_due_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['maintenance_logs']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['maintenance_logs']['Row']>
      }
      leads: {
        Row: {
          id: string
          name: string | null
          phone: string | null
          email: string | null
          location: string | null
          category: string | null
          message: string | null
          created_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['leads']['Row']>
      }
      media_assets: {
        Row: {
          id: string
          kind: 'project' | 'product' | 'client_logo'
          title: string | null
          bucket: string | null
          path: string | null
          created_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['media_assets']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['media_assets']['Row']>
      }
      projects: {
        Row: {
          id: string
          title: string
          category: string | null
          description: string | null
          flow_rate_lph: number | null
          solutions: Json | null
          created_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['projects']['Row']>
      }
      project_photos: {
        Row: {
          id: string
          project_id: string
          asset_id: string
        }
        Insert: Omit<Database['public']['Tables']['project_photos']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['project_photos']['Row']>
      }
      profiles: {
        Row: {
          id: string
          role: 'admin' | 'customer'
          name: string | null
          phone: string | null
          created_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
