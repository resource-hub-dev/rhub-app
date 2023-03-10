import { UserData } from '@ducks/user/types';

export const responseAPI: UserData = {
  id: '12345678-lol-lmao-1234-567890lmfao',
  token: 'abcdedaff-dsdasbadsd',
  ldap_dn: '',
  external_uuid: '',
  ssh_keys: [],
  manager_id: '',
  roles: [],
  name: 'johnny',
  email: 'johnny@email.example',
};

export const loadedUser: UserData = {
  id: '12345678-lol-lmao-1234-567890lmfao',
  token: 'abcdedaff-dsdasbadsd',
  ldap_dn: '',
  external_uuid: '',
  ssh_keys: [],
  manager_id: '',
  roles: [],
  name: 'johnny',
  email: 'johnny@email.example',
};

export const emptyUser: UserData = {
  id: '',
  token: '',
  ldap_dn: '',
  external_uuid: '',
  ssh_keys: [],
  manager_id: null,
  roles: null,
  name: '',
  email: '',
};
