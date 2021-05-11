import { UserData, UserModel } from './types';

export const responseAPI: UserData = {
  id: '12345678-lol-lmao-1234-567890lmfao',
  token: 'abcdedaff-dsdasbadsd',
  name: 'johnny',
  email: 'johnny@email.example',
};

export const loadedUser: UserModel = {
  id: '12345678-lol-lmao-1234-567890lmfao',
  email: 'johnny@email.example',
  token: 'abcdedaff-dsdasbadsd',
};

export const emptyUser: UserModel = {
  id: '',
  email: '',
  token: '',
};
