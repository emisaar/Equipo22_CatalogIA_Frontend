// User Types based on backend API schemas

export interface UserCreate {
  email: string;
  username: string;
  given_name?: string;
  paternal_surname?: string;
  maternal_surname?: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  username: string;
  given_name?: string;
  paternal_surname?: string;
  maternal_surname?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserUpdate {
  email?: string;
  username?: string;
  given_name?: string;
  paternal_surname?: string;
  maternal_surname?: string;
  password?: string;
}
