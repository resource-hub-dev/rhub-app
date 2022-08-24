import { all, takeLatest } from 'redux-saga/effects';

import load from './cowsay/sagas';
import userSagas from './user/sagas';
import { CowsayTypes } from './cowsay/types';
import labPolicySagas from './lab/policy/sagas';
import labProductSagas from './lab/product/sagas';
import clusterSagas from './lab/cluster/sagas';
import labRegionSagas from './lab/region/sagas';
import labLocationSagas from './lab/location/sagas';
import openstackCloudSagas from './openstack/cloud/sagas';
import openstackProjectSagas from './openstack/project/sagas';
import satellite from './satellite/sagas';

export default function* rootSaga(): Generator {
  return yield all([
    takeLatest(CowsayTypes.LOAD_REQUEST, load),
    ...userSagas,
    ...labPolicySagas,
    ...labProductSagas,
    ...clusterSagas,
    ...labRegionSagas,
    ...labLocationSagas,
    ...openstackCloudSagas,
    ...openstackProjectSagas,
    ...satellite,
  ]);
}
