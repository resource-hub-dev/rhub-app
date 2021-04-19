import { combineReducers } from 'redux';
import cowsay from './cowsay';
import user from './user';

export default combineReducers({
  cowsay,
  user,
});
