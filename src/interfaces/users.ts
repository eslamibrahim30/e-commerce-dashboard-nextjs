export type RegisterBody = {
  name: string;
  email: string;
  password: string;
};
export type IUserUpdate = {
  name?: string;
  email?: string;
};
export interface IUserdata{
  success:boolean;
  data:IUser;
  message:string;

}
export interface IUser{
  name:string;
  email:string;
  role:string
}