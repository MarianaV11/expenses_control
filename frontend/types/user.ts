export type UserCreate = {
  name: string;
  birthday: string;
  email: string;
  password: string;
  is_restricted: boolean;
  is_admin: boolean;
};
