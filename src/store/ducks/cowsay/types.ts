// Action Types
export enum CowsayTypes {
  LOAD_REQUEST = '@cowsay/LOAD_REQUEST',
  LOAD_SUCCESS = '@cowsay/LOAD_SUCCESS',
  LOAD_FAILURE = '@cowsay/LOAD_FAILURE',
}

//  State Type
export interface CowsayState {
  readonly message: string;
  readonly loading: boolean;
  readonly error: boolean;
}
