import { UserState } from '@ducks/user/types';

export const initialState: ExampleState = {
  user: {
    current: { id: '', token: '', email: '' },
    data: {},
    loggedIn: true,
    loading: false,
    error: false,
  },
};

export interface ExampleState {
  user: UserState;
}
