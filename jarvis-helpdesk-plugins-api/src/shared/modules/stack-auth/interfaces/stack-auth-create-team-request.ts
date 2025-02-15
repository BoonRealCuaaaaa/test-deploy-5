export interface StackAuthCreateTeamRequest {
  display_name: string;
  creator_user_id?: string;
  client_readonly_metadata?: Record<string, any>;
  server_metadata?: Record<string, any>;
  profile_image_url?: string;
  client_metadata?: Record<string, any>;
}
