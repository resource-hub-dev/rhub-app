import { combineReducers } from 'redux';
import cowsay from './cowsay';
import user from './user';
import labPolicy from './lab/policy';

export default combineReducers({
  cowsay,
  user,
  labPolicy,
});
