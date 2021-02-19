import { Reducer } from 'redux';
import { CowsayState, CowsayTypes } from './types';

export const INITIAL_STATE: CowsayState = {
  message: '',
  loading: false,
  error: false,
};

const reducer: Reducer<CowsayState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CowsayTypes.LOAD_REQUEST:
      return { ...state, loading: true };
    case CowsayTypes.LOAD_SUCCESS:
      return {
        loading: false,
        error: false,
        message: action.payload,
      };
    case CowsayTypes.LOAD_FAILURE:
      return { loading: false, error: true, message: '' };
    default:
      return state;
  }
};

export default reducer;
