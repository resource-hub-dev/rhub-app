import { combineReducers } from 'redux';
import cowsay from './cowsay';
import user from './user';
import labPolicy from './lab/policy';
import cluster from './lab/cluster';
import labRegion from './lab/region';

export default combineReducers({
  cluster,
  cowsay,
  user,
  labPolicy,
  labRegion,
});
