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
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      git_links: {
        Row: {
          created_at: string | null
          git_ref: string
          id: string
          link_type: string
          metadata: Json | null
          ticket_id: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          git_ref: string
          id?: string
          link_type: string
          metadata?: Json | null
          ticket_id?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          git_ref?: string
          id?: string
          link_type?: string
          metadata?: Json | null
          ticket_id?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "git_links_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "git_links_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["ticket_id"]
          },
          {
            foreignKeyName: "git_links_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "v_ticket_current_status_duration"
            referencedColumns: ["ticket_id"]
          },
        ]
      }
      internal_credentials: {
        Row: {
          access_level: string
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          encrypted_data: string
          id: string
          service_name: string
          updated_at: string | null
        }
        Insert: {
          access_level?: string
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          encrypted_data: string
          id?: string
          service_name: string
          updated_at?: string | null
        }
        Update: {
          access_level?: string
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          encrypted_data?: string
          id?: string
          service_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internal_credentials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_credentials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_assignee_status_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "internal_credentials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["assignee_id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          channel_id: string | null
          created_at: string | null
          error_message: string | null
          event_data: Json | null
          event_type: string
          id: string
          message_ts: string | null
          project_id: string | null
          retry_count: number | null
          rule_id: string | null
          sent_at: string | null
          status: string
          ticket_id: string | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          error_message?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          message_ts?: string | null
          project_id?: string | null
          retry_count?: number | null
          rule_id?: string | null
          sent_at?: string | null
          status: string
          ticket_id?: string | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          error_message?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          message_ts?: string | null
          project_id?: string | null
          retry_count?: number | null
          rule_id?: string | null
          sent_at?: string | null
          status?: string
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "notification_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["ticket_id"]
          },
          {
            foreignKeyName: "notification_logs_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "v_ticket_current_status_duration"
            referencedColumns: ["ticket_id"]
          },
        ]
      }
      notification_rules: {
        Row: {
          channel_type: string
          conditions: Json | null
          created_at: string | null
          created_by: string | null
          custom_channel_id: string | null
          custom_template: string | null
          description: string | null
          event_type: string
          id: string
          is_enabled: boolean | null
          name: string
          priority_order: number | null
          project_id: string | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          channel_type: string
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          custom_channel_id?: string | null
          custom_template?: string | null
          description?: string | null
          event_type: string
          id?: string
          is_enabled?: boolean | null
          name: string
          priority_order?: number | null
          project_id?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          channel_type?: string
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          custom_channel_id?: string | null
          custom_template?: string | null
          description?: string | null
          event_type?: string
          id?: string
          is_enabled?: boolean | null
          name?: string
          priority_order?: number | null
          project_id?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_assignee_status_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notification_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["assignee_id"]
          },
          {
            foreignKeyName: "notification_rules_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_rules_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          block_kit_json: Json | null
          content_en: string | null
          content_ko: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_system: boolean | null
          name: string
          placeholders: Json | null
          project_id: string | null
          template_type: string
          updated_at: string | null
        }
        Insert: {
          block_kit_json?: Json | null
          content_en?: string | null
          content_ko: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          placeholders?: Json | null
          project_id?: string | null
          template_type: string
          updated_at?: string | null
        }
        Update: {
          block_kit_json?: Json | null
          content_en?: string | null
          content_ko?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          placeholders?: Json | null
          project_id?: string | null
          template_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_assignee_status_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notification_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["assignee_id"]
          },
          {
            foreignKeyName: "notification_templates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_credentials: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          encrypted_data: string
          environment: string | null
          id: string
          project_id: string | null
          service_name: string
          updated_at: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          encrypted_data: string
          environment?: string | null
          id?: string
          project_id?: string | null
          service_name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          encrypted_data?: string
          environment?: string | null
          id?: string
          project_id?: string | null
          service_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_credentials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_credentials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_assignee_status_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "project_credentials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["assignee_id"]
          },
          {
            foreignKeyName: "project_credentials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          created_at: string | null
          id: string
          member_role: string | null
          project_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          member_role?: string | null
          project_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          member_role?: string | null
          project_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_assignee_status_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["assignee_id"]
          },
        ]
      }
      project_specs: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_primary: boolean | null
          order_index: number | null
          project_id: string | null
          spec_type: string
          title: string
          updated_at: string | null
          updated_by: string | null
          version: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_primary?: boolean | null
          order_index?: number | null
          project_id?: string | null
          spec_type: string
          title: string
          updated_at?: string | null
          updated_by?: string | null
          version?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_primary?: boolean | null
          order_index?: number | null
          project_id?: string | null
          spec_type?: string
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_specs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_specs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_assignee_status_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "project_specs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["assignee_id"]
          },
          {
            foreignKeyName: "project_specs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_specs_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_specs_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "v_assignee_status_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "project_specs_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["assignee_id"]
          },
        ]
      }
      projects: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          description: string | null
          environments: Json | null
          github_repo: string | null
          id: string
          name: string
          settings: Json | null
          slack_channel_id: string | null
          slug: string
          status: string | null
          theme_color: string | null
          ticket_counter: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          environments?: Json | null
          github_repo?: string | null
          id?: string
          name: string
          settings?: Json | null
          slack_channel_id?: string | null
          slug: string
          status?: string | null
          theme_color?: string | null
          ticket_counter?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          environments?: Json | null
          github_repo?: string | null
          id?: string
          name?: string
          settings?: Json | null
          slack_channel_id?: string | null
          slug?: string
          status?: string | null
          theme_color?: string | null
          ticket_counter?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      spec_documents: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          doc_type: string
          file_type: string | null
          file_url: string | null
          id: string
          is_core: boolean | null
          order_index: number | null
          project_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          doc_type: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_core?: boolean | null
          order_index?: number | null
          project_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          doc_type?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_core?: boolean | null
          order_index?: number | null
          project_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spec_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spec_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_assignee_status_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "spec_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["assignee_id"]
          },
          {
            foreignKeyName: "spec_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      story_point_config: {
        Row: {
          complexity_factors: Json
          created_at: string | null
          criteria: Json
          excluded_types: Json
          golden_stories: Json
          id: string
          principles: Json
          reference_tickets: Json
          updated_at: string | null
          updated_by: string | null
          version: number
        }
        Insert: {
          complexity_factors?: Json
          created_at?: string | null
          criteria?: Json
          excluded_types?: Json
          golden_stories?: Json
          id?: string
          principles?: Json
          reference_tickets?: Json
          updated_at?: string | null
          updated_by?: string | null
          version?: number
        }
        Update: {
          complexity_factors?: Json
          created_at?: string | null
          criteria?: Json
          excluded_types?: Json
          golden_stories?: Json
          id?: string
          principles?: Json
          reference_tickets?: Json
          updated_at?: string | null
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "story_point_config_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_point_config_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "v_assignee_status_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "story_point_config_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["assignee_id"]
          },
        ]
      }
      ticket_comments: {
        Row: {
          attachments: Json | null
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          is_internal: boolean | null
          ticket_id: string | null
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          ticket_id?: string | null
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          ticket_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "v_assignee_status_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ticket_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["assignee_id"]
          },
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["ticket_id"]
          },
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "v_ticket_current_status_duration"
            referencedColumns: ["ticket_id"]
          },
        ]
      }
      ticket_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          field_name: string
          id: string
          new_value: string | null
          old_value: string | null
          ticket_id: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          field_name: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          ticket_id?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          field_name?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "v_assignee_status_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ticket_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["assignee_id"]
          },
          {
            foreignKeyName: "ticket_history_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_history_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["ticket_id"]
          },
          {
            foreignKeyName: "ticket_history_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "v_ticket_current_status_duration"
            referencedColumns: ["ticket_id"]
          },
        ]
      }
      ticket_status_log: {
        Row: {
          assigned_to_at_change: string | null
          changed_at: string
          changed_by: string | null
          duration_seconds: number | null
          from_status: Database["public"]["Enums"]["ticket_status"] | null
          id: string
          project_id: string
          ticket_id: string
          to_status: Database["public"]["Enums"]["ticket_status"]
        }
        Insert: {
          assigned_to_at_change?: string | null
          changed_at?: string
          changed_by?: string | null
          duration_seconds?: number | null
          from_status?: Database["public"]["Enums"]["ticket_status"] | null
          id?: string
          project_id: string
          ticket_id: string
          to_status: Database["public"]["Enums"]["ticket_status"]
        }
        Update: {
          assigned_to_at_change?: string | null
          changed_at?: string
          changed_by?: string | null
          duration_seconds?: number | null
          from_status?: Database["public"]["Enums"]["ticket_status"] | null
          id?: string
          project_id?: string
          ticket_id?: string
          to_status?: Database["public"]["Enums"]["ticket_status"]
        }
        Relationships: [
          {
            foreignKeyName: "ticket_status_log_assigned_to_at_change_fkey"
            columns: ["assigned_to_at_change"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_status_log_assigned_to_at_change_fkey"
            columns: ["assigned_to_at_change"]
            isOneToOne: false
            referencedRelation: "v_assignee_status_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ticket_status_log_assigned_to_at_change_fkey"
            columns: ["assigned_to_at_change"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["assignee_id"]
          },
          {
            foreignKeyName: "ticket_status_log_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_status_log_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "v_assignee_status_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ticket_status_log_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["assignee_id"]
          },
          {
            foreignKeyName: "ticket_status_log_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_status_log_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_status_log_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["ticket_id"]
          },
          {
            foreignKeyName: "ticket_status_log_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "v_ticket_current_status_duration"
            referencedColumns: ["ticket_id"]
          },
        ]
      }
      tickets: {
        Row: {
          action_reason: string | null
          assigned_to: string | null
          client_visible: boolean | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          description: string | null
          direction: string
          due_date: string | null
          estimated_hours: number | null
          file_paths: string[] | null
          id: string
          parent_ticket_id: string | null
          priority: string | null
          project_id: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          story_points: number | null
          technical_spec: string | null
          ticket_number: number
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          action_reason?: string | null
          assigned_to?: string | null
          client_visible?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          description?: string | null
          direction?: string
          due_date?: string | null
          estimated_hours?: number | null
          file_paths?: string[] | null
          id?: string
          parent_ticket_id?: string | null
          priority?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          story_points?: number | null
          technical_spec?: string | null
          ticket_number: number
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          action_reason?: string | null
          assigned_to?: string | null
          client_visible?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          description?: string | null
          direction?: string
          due_date?: string | null
          estimated_hours?: number | null
          file_paths?: string[] | null
          id?: string
          parent_ticket_id?: string | null
          priority?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          story_points?: number | null
          technical_spec?: string | null
          ticket_number?: number
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "v_assignee_status_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["assignee_id"]
          },
          {
            foreignKeyName: "tickets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_assignee_status_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tickets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["assignee_id"]
          },
          {
            foreignKeyName: "tickets_parent_ticket_id_fkey"
            columns: ["parent_ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_parent_ticket_id_fkey"
            columns: ["parent_ticket_id"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["ticket_id"]
          },
          {
            foreignKeyName: "tickets_parent_ticket_id_fkey"
            columns: ["parent_ticket_id"]
            isOneToOne: false
            referencedRelation: "v_ticket_current_status_duration"
            referencedColumns: ["ticket_id"]
          },
          {
            foreignKeyName: "tickets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          github_username: string | null
          id: string
          name: string | null
          slack_user_id: string | null
          system_role: Database["public"]["Enums"]["system_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          github_username?: string | null
          id: string
          name?: string | null
          slack_user_id?: string | null
          system_role?: Database["public"]["Enums"]["system_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          github_username?: string | null
          id?: string
          name?: string | null
          slack_user_id?: string | null
          system_role?: Database["public"]["Enums"]["system_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      v_assignee_status_stats: {
        Row: {
          avg_duration_seconds: number | null
          avg_hours: number | null
          max_duration_seconds: number | null
          max_hours: number | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          transition_count: number | null
          user_id: string | null
          user_name: string | null
        }
        Relationships: []
      }
      v_delayed_tickets: {
        Row: {
          assignee_id: string | null
          assignee_name: string | null
          critical_hours: number | null
          delay_level: string | null
          hours_in_current_status: number | null
          project_name: string | null
          project_slug: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          ticket_id: string | null
          ticket_number: number | null
          title: string | null
          warning_hours: number | null
        }
        Relationships: []
      }
      v_ticket_current_status_duration: {
        Row: {
          assigned_to: string | null
          assignee_name: string | null
          current_status: Database["public"]["Enums"]["ticket_status"] | null
          days_in_current_status: number | null
          hours_in_current_status: number | null
          project_id: string | null
          project_name: string | null
          project_slug: string | null
          seconds_in_current_status: number | null
          status_entered_at: string | null
          ticket_id: string | null
          ticket_number: number | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "v_assignee_status_stats"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "v_delayed_tickets"
            referencedColumns: ["assignee_id"]
          },
          {
            foreignKeyName: "tickets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      is_project_member_for_storage: {
        Args: { project_id_param: string }
        Returns: boolean
      }
    }
    Enums: {
      system_role: "admin" | "developer" | "client"
      ticket_status:
        | "pending"
        | "in_progress"
        | "review_needed"
        | "done"
        | "cancelled"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      system_role: ["admin", "developer", "client"],
      ticket_status: [
        "pending",
        "in_progress",
        "review_needed",
        "done",
        "cancelled",
      ],
    },
  },
} as const
