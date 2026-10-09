/**
 * Data Transfer Object received from backend API for User entity.
 */
export interface UserDTO {
  id: string;
  full_name: string;
  email_address: string;
  user_role: string;
  created_at: string;
  is_active: boolean;
}

