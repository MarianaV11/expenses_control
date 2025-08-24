export type Auth = {
  token_type: string;
  access_token: string;
};

export type AuthResponse = {
  id: number;
  auth: Auth;
};

export type AuthRequest = {
  email: string;
  password: string;
};
