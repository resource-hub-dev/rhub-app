import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import {
  Button,
  Grid,
  GridItem,
  PageSection,
  PageSectionVariants,
  Title,
  Spinner,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';

import { AppState } from '@store';
import { AuthorizedFunction } from '@services/user';
import {
  loadRequest,
  deleteRequest,
  rebootHostRequest,
} from '@ducks/lab/cluster/actions';
import { ClusterHost } from '@ducks/lab/cluster/types';

import PageNotFound from '@components/pageNotFound/PageNotFound';
import ClusterLifespan from './cards/ClusterLifespan';
import OverView from './cards/OverView';
import ClusterInfo from './cards/ClusterInfo';
import ClusterEvents from './cards/ClusterEvents';
import UtilizationCard from './cards/Utilization';

import './ClusterDetails.css';

/*
  TODOs: 
  Fix ClusterAccess (Q3 2021 no reading roles in UI yet)
 */
interface Props {
  clusterId: string;
}

const ClusterDetails: React.FC = () => {
  const dispatch = useDispatch();
  const routerHistory = useHistory();

  const { clusterId } = useParams<Props>();
  const id = Number(clusterId);

  const [openModal, setOpenModal] = useState('');
  const [nodeToBeRebooted, setNodeToBeRebooted] = useState();
  const token = useSelector((state: AppState) => state.user.current.token);

  // fetch API calls
  useEffect(() => {
    dispatch(loadRequest(id));
  }, [dispatch, id, token]);

  const cluster = useSelector((state: AppState) => state.cluster.data[id]);
  const events = useSelector((state: AppState) => state.cluster.events);
  // const hosts = useSelector((state: AppState) => state.cluster.data[id].hosts);
  const isLoading = useSelector((state: AppState) => state.cluster.loading);
  const user = useSelector((state: AppState) => state.user.current);
  const authorized = AuthorizedFunction(['rhub-admin']);
  const closeModal = () => {
    setOpenModal('');
  };

  const dispatchDelete = () => {
    closeModal();
    let prevPath = '';
    if (routerHistory.location.state)
      prevPath = (routerHistory.location.state as any).prevPath;
    const flatten = prevPath.split('/');
    if (flatten.indexOf('groups') !== -1) {
      const groupname = flatten[flatten.indexOf('groups') + 1];
      dispatch(deleteRequest(id));
      routerHistory.goBack();
    } else {
      dispatch(deleteRequest(id));
      routerHistory.push('/resources/quickcluster/clusters');
    }
  };
  const dispatchNodeReboot = () => {
    closeModal();
    if (nodeToBeRebooted)
      dispatch(rebootHostRequest([nodeToBeRebooted], Number(clusterId)));
  };
  if (!cluster) {
    return <PageNotFound />;
  }
  if (isLoading || !events) {
    return (
      <div>
        <h3>Loading...</h3>
        <Spinner />
      </div>
    );
  }
  const {
    name,
    owner_name,
    status,
    region_name,
    product_name,
    group_name,
    description,
    reservation_expiration,
    lifespan_expiration,
    hosts,
    quota,
  } = cluster;

  // only shows all information if a cluster is not deleted
  const isDeleted = cluster.status === 'Deleted';
  // Only limit 'New Bundle' and 'Delete' to 3 groups:
  // cluster owner, admin and group members

  /* FUTURE WORK 
  const clusterAccess = !!(
    user &&
    (user.isAdmin ||
      user.username === owner ||
      (userGroups &&
        userGroups.length &&
        userGroups.find((item) => item.groupName === group)))
  ); */
  const clusterAccess = true;

  // can only delete if below conditions are met
  const deleteConditions: string[] = [
    'Active',
    'Pre-Provisioning Failed',
    'Provisioning Failed',
    'Post-Provisioning Failed',
    'Pre-Installation Queued',
    'Pre-Installing',
    'Pre-Installation Failed',
    'Installation Queued',
    'Installing',
    'Installation Failed',
    'Post-Installation Queued',
    'Post-Installing',
    'Post-Installation Failed',
    'Pre-Deletion Failed',
    'Deletion Failed',
    'Post-Deletion Failed',
  ];
  const disableDelete = !deleteConditions.includes(cluster.status);

  // calculate quota for the charts
  let num_vcpus = 0;
  let ram_mb = 0;
  let volumes_gb = 0;
  let num_volumes = 0;
  hosts.forEach((host: ClusterHost) => {
    num_vcpus += host.num_vcpus;
    ram_mb += host.ram_mb;
    num_volumes += host.num_volumes;
    volumes_gb += host.volumes_gb;
  });
  const isShared = group_name === 'sharedclusters';
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        {!isDeleted && !isShared ? (
          <Title headingLevel="h2">
            Cluster Name: {name}
            <Button
              className="btn-delete"
              variant="danger"
              onClick={() => setOpenModal('deleteModal')}
              isDisabled={disableDelete || !clusterAccess}
            >
              Delete
            </Button>
          </Title>
        ) : null}
      </PageSection>
      <PageSection>
        <Grid hasGutter>
          {!isDeleted ? (
            <>
              <GridItem span={5} className="ql-card-layout">
                <OverView
                  owner={owner_name}
                  status={status}
                  region={region_name}
                  template={`${product_name}`}
                  group={group_name}
                />
              </GridItem>
              <GridItem span={4} className="ql-card-layout">
                <ClusterLifespan
                  clusterId={cluster.id}
                  reservationExpiration={reservation_expiration}
                  lifespanExpiration={lifespan_expiration}
                  showExpBtn={
                    // user.isAdmin ||
                    reservation_expiration !== null && clusterAccess
                  }
                  showLifespanBtn={authorized}
                  isShared={isShared}
                />
              </GridItem>
              <GridItem span={3} rowSpan={8} className="ql-card-layout">
                <UtilizationCard
                  num_vcpus={num_vcpus}
                  ram_mb={ram_mb}
                  volumes_gb={volumes_gb}
                  num_volumes={num_volumes}
                  cpuQuota={quota.num_vcpus}
                  ramQuotaMb={quota.ram_mb}
                  volumesMaxGb={quota.volumes_gb}
                />
              </GridItem>
              <GridItem span={9}>
                <ClusterInfo
                  hosts={hosts}
                  clusterId={Number(clusterId)}
                  setNodeToBeRebooted={setNodeToBeRebooted}
                  setOpenModal={setOpenModal}
                  description={description}
                />
              </GridItem>
            </>
          ) : null}
          <GridItem span={9}>
            <ClusterEvents events={events} />
          </GridItem>
        </Grid>
      </PageSection>
      <Modal
        variant={ModalVariant.small}
        title="Please Confirm"
        isOpen={openModal === 'deleteModal'}
        onClose={closeModal}
        actions={[
          <Button key="delete" variant="danger" onClick={dispatchDelete}>
            Yes
          </Button>,
          <Button key="cancel" variant="link" onClick={closeModal}>
            Cancel
          </Button>,
        ]}
      >
        Are you sure that you want to delete the cluster: {name}?
      </Modal>
      <Modal
        variant={ModalVariant.small}
        title="Please Confirm"
        isOpen={openModal === 'rebootModal'}
        onClose={closeModal}
        actions={[
          <Button key="delete" variant="danger" onClick={dispatchNodeReboot}>
            Yes
          </Button>,
          <Button key="cancel" variant="link" onClick={closeModal}>
            Cancel
          </Button>,
        ]}
      >
        Are you sure that you want to reboot the node?
      </Modal>
    </>
  );
};

export default ClusterDetails;
