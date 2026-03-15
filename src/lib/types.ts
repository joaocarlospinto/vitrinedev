export type Project = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  description: string;
  thumbnail_url: string | null;
  tags: string[] | null;
  created_at: string;
  featured: boolean | null;
  clicks: number | null;
};

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          url: string;
          description: string;
          thumbnail_url?: string | null;
          tags?: string[] | null;
          created_at?: string;
          featured?: boolean | null;
          clicks?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
    };
  };
};
