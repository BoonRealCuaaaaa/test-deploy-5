export interface StackAuthUser {
  id: string;
  display_name: string | null;
  primary_email: string;
  primary_email_verified: boolean;
  profile_image_url: string | null;
  signed_up_at_millis: number;
  client_metadata: any;
  client_read_only_metadata: any;
  server_metadata: any;
  has_password: boolean;
  auth_with_email: boolean;
  requires_totp_mfa: boolean;
  oauth_providers: { id: string }[];
  selected_team_id: string;
  selected_team: string;
  last_active_at_millis: number;
}
