export interface ProfileDTO {
  id: number;
  name: string;
  email: string;
  role: string;
  is_email_verified: boolean;
  is_active: boolean;
  created_at: string;
}
