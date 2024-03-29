import { combineReducers } from 'redux';
import cowsay from './cowsay';
import user from './user';
import labPolicy from './lab/policy';
import labProduct from './lab/product';
import cluster from './lab/cluster';
import labRegion from './lab/region';
import labLocation from './lab/location';
import openstackCloud from './openstack/cloud';
import openstackProject from './openstack/project';
import dns from './dns';
import satellite from './satellite';

export default combineReducers({
  cluster,
  cowsay,
  user,
  labPolicy,
  labRegion,
  labProduct,
  labLocation,
  openstackCloud,
  openstackProject,
  satellite,
  dns,
});
