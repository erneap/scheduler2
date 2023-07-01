import { IUser } from "../users/user";

export interface UsersResponse {
  users: IUser[];
  exception: string;
}

export interface ExceptionResponse {
  exception: string;
}