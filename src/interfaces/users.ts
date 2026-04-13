export type RegisterBody = {
  name: string;
  email: string;
  password: string;
};
export type IUserUpdate = {
  name?: string;
  email?: string;
};