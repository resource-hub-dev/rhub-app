// Action Types
export enum UserTypes {
  LOGIN_REQUEST = '@user/LOGIN_REQUEST',
  LOGIN_SUCCESS = '@user/LOGIN_SUCCESS',
  LOGIN_FAILURE = '@user/LOGIN_FAILURE',
  LOAD_REQUEST = '@user/LOAD_REQUEST',
  LOAD_SUCCESS = '@user/LOAD_SUCCESS',
  LOAD_FAILURE = '@user/LOAD_FAILURE',
  TOKEN_UPDATE = '@user/TOKEN_UPDATE',
  TOKEN_UPDATE_SUCCESS = '@user/TOKEN_UPDATE_SUCCESS',
  TOKEN_UPDATE_FAILURE = '@user/TOKEN_UPDATE_FAILURE',
}

// Data Types - Returned by the API
// Todo: Implement UserModel incase we need all users like in QLB
export interface UserData {
  id: string;
  token: string;
  name: string;
  email: string;
}

export interface UserModel {
  id: string;
  email: string;
  token: string;
}

export interface UserState {
  readonly current: UserModel;
  readonly data: { [key: string]: UserModel };
  readonly loggedIn: boolean;
  readonly loading: boolean;
  readonly error: boolean;
}
