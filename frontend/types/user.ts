export type UserIdentifier = {
  user_id: number;
};

export type UserCreate = {
  name: string;
  birthday: string;
  email: string;
  password: string;
  is_restricted: boolean;
  is_admin: boolean;
};

export type UserRead = UserIdentifier & {
  name: string;
  birthday: string;
  email: string;
  password: string;
  is_restricted: boolean;
  is_admin: boolean;
};

export type UserPersonalInfoUpdate = {
  id: number;
  name: string;
  birthday: string;
  email: string;
};

export type UserPasswordUpdate = {
  id: number;
  new_password: string;
  old_password: string;
};
