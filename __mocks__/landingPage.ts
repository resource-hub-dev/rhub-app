import { UserState } from '@ducks/user/types';

export const initialState: ExampleState = {
  user: {
    current: {
      id: '',
      token: '',
      ldap_dn: '',
      external_uuid: '',
      ssh_keys: [],
      manager_id: null,
      roles: ['rhub-admin, policy-owner'],
      name: '',
      email: '',
    },
    data: {},
    loggedIn: true,
    loading: false,
    error: false,
  },
};

export interface ExampleState {
  user: UserState;
}
