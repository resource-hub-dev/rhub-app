// Action Types
export enum UserTypes {
  LOAD_CURRUSR_REQUEST = '@user/LOAD_CURRUSR_REQUEST',
  LOAD_CURRUSR_SUCCESS = '@user/LOAD_CURRUSR_SUCCESS',
  LOAD_CURRUSR_FAILURE = '@user/LOAD_CURRUSR_FAILURE',
  LOAD_REQUEST = '@user/LOAD_REQUEST',
  LOAD_SUCCESS = '@user/LOAD_SUCCESS',
  LOAD_FAILURE = '@user/LOAD_FAILURE',
  PUT_TOKEN_REQUEST = '@user/PUT_TOKEN',
  TOKEN_UPDATE = '@user/TOKEN_UPDATE',
  TOKEN_UPDATE_SUCCESS = '@user/TOKEN_UPDATE_SUCCESS',
  TOKEN_UPDATE_FAILURE = '@user/TOKEN_UPDATE_FAILURE',
}

// Data Types - Returned by the API
// Todo: Implement UserModel incase we need all users like in QLB
export interface UserData {
  id: string;
  token: string | null;
  ldap_dn: string;
  external_uuid: string;
  ssh_keys: string[];
  manager_id: string | null;
  roles: string[] | null;
  name: string;
  email: string;
}

export interface Group {
  id: string;
  name: string;
}

export interface UserState {
  readonly current: UserData;
  readonly data: { [key: string]: UserData };
  readonly loggedIn: boolean;
  readonly loading: boolean;
  readonly error: boolean;
}
