import { LabPolicyModel, LabPolicyState } from '@ducks/lab/policy/types';
import { UserState } from '@ducks/user/types';

import { loadedUser } from '@mocks/user';
import { labPolicyExample } from './labPolicy';

export const newInvalidPolicy = '{"name": ';

export const newValidPolicy: Partial<LabPolicyModel> = {
  name: 'newName',
  department: 'newDept',
};

const existingPolicy: Partial<LabPolicyModel> = { ...labPolicyExample };
delete existingPolicy.id;

export { existingPolicy };

const userState: UserState = {
  current: loadedUser,
  data: {},
  loggedIn: true,
  loading: false,
  error: false,
};

const labPolicyState: LabPolicyState = {
  data: {
    [labPolicyExample.id]: labPolicyExample,
  },
  loading: false,
  errMsg: {},
  error: false,
};

const manyPoliciesData: { [key: number]: LabPolicyModel } = {};

for (let i = 1; i <= 11; i += 1) {
  manyPoliciesData[i] = {
    ...labPolicyExample,
    id: i,
    name: `name${i}`,
    department: `department${i}`,
  };
}

export const manyPoliciesState: exampleState = {
  user: userState,
  labPolicy: {
    ...labPolicyState,
    data: manyPoliciesData,
  },
};

export const loadedState: exampleState = {
  user: userState,
  labPolicy: labPolicyState,
};

export const noPolicyState: exampleState = {
  ...loadedState,
  labPolicy: {
    ...labPolicyState,
    data: {},
  },
};

export const loadingState: exampleState = {
  user: {
    ...userState,
    loading: true,
  },
  labPolicy: {
    ...labPolicyState,
    loading: true,
  },
};

export const errorState: exampleState = {
  user: userState,
  labPolicy: {
    ...labPolicyState,
    error: true,
    errMsg: {
      detail: 'error message detail',
    },
  },
};

interface exampleState {
  user: UserState;
  labPolicy: LabPolicyState;
}
