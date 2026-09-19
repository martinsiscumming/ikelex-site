export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      case_studies: {
        Row: {
          challenge: string
          created_at: string
          id: string
          image_path: string | null
          outcome: string
          published: boolean
          service_slug: string
          solution: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          challenge: string
          created_at?: string
          id?: string
          image_path?: string | null
          outcome: string
          published?: boolean
          service_slug: string
          solution: string
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          challenge?: string
          created_at?: string
          id?: string
          image_path?: string | null
          outcome?: string
          published?: boolean
          service_slug?: string
          solution?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          service: string
          status: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          service: string
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          service?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          company: string | null
          created_at: string
          customer_name: string
          id: string
          photo_path: string | null
          published: boolean
          rating: number
          review: string
          review_date: string
          service: string | null
          updated_at: string
          verified: boolean
        }
        Insert: {
          company?: string | null
          created_at?: string
          customer_name: string
          id?: string
          photo_path?: string | null
          published?: boolean
          rating: number
          review: string
          review_date: string
          service?: string | null
          updated_at?: string
          verified?: boolean
        }
        Update: {
          company?: string | null
          created_at?: string
          customer_name?: string
          id?: string
          photo_path?: string | null
          published?: boolean
          rating?: number
          review?: string
          review_date?: string
          service?: string | null
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      service_content: {
        Row: {
          audience_title: string
          audiences: Json
          benefits: Json
          eyebrow: string
          faqs: Json
          final_body: string
          final_heading: string
          final_title: string
          hero_cta: string
          hero_description: string
          icon_key: string
          id: string
          intro_body: string
          intro_title: string
          primary_cta: string
          process: Json
          secondary_cta: string
          sections: Json
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          audience_title?: string
          audiences?: Json
          benefits?: Json
          eyebrow: string
          faqs?: Json
          final_body?: string
          final_heading?: string
          final_title?: string
          hero_cta?: string
          hero_description: string
          icon_key?: string
          id?: string
          intro_body: string
          intro_title: string
          primary_cta?: string
          process?: Json
          secondary_cta?: string
          sections?: Json
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          audience_title?: string
          audiences?: Json
          benefits?: Json
          eyebrow?: string
          faqs?: Json
          final_body?: string
          final_heading?: string
          final_title?: string
          hero_cta?: string
          hero_description?: string
          icon_key?: string
          id?: string
          intro_body?: string
          intro_title?: string
          primary_cta?: string
          process?: Json
          secondary_cta?: string
          sections?: Json
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_images: {
        Row: {
          alt_text: string
          id: string
          image_key: string
          published: boolean
          storage_path: string
          updated_at: string
        }
        Insert: {
          alt_text: string
          id?: string
          image_key: string
          published?: boolean
          storage_path: string
          updated_at?: string
        }
        Update: {
          alt_text?: string
          id?: string
          image_key?: string
          published?: boolean
          storage_path?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string
          contact_person: string
          email: string | null
          id: string
          phone: string
          social_media: Json
          updated_at: string
          whatsapp: string
        }
        Insert: {
          address?: string
          contact_person?: string
          email?: string | null
          id?: string
          phone?: string
          social_media?: Json
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          address?: string
          contact_person?: string
          email?: string | null
          id?: string
          phone?: string
          social_media?: Json
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
