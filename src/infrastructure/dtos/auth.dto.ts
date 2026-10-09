import { UserDTO } from './user.dto';

export interface AuthResponseDTO {
  access_token: string;
  user_info: UserDTO;
  expires_in_seconds: number;
}

