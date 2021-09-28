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
import { useKeycloak } from '@react-keycloak/web';

import { AppState } from '@store';

import { loadRequest, deleteRequest } from '@ducks/lab/cluster/actions';
import { ClusterHost } from '@ducks/lab/cluster/types';
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
  const { keycloak } = useKeycloak();
  const id = Number(clusterId);

  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const dispatchDelete = () => {
    handleModalToggle();
    let prevPath = '';
    if (routerHistory.location.state)
      prevPath = (routerHistory.location.state as any).prevPath;
    const flatten = prevPath.split('/');
    if (flatten.indexOf('groups') !== -1) {
      const groupname = flatten[flatten.indexOf('groups') + 1];
      dispatch(deleteRequest(id, { groupname }));
      routerHistory.goBack();
    } else {
      dispatch(deleteRequest(id, { username: user.email }));
      routerHistory.push('/');
    }
  };
  if (isLoading || !cluster || !events) {
    return (
      <div>
        <h3>Loading...</h3>
        <Spinner />
      </div>
    );
  }
  const {
    name,
    user_name,
    status,
    region_name,
    template_id,
    group_name,
    description,
    reservation_expiration,
    lifespan_expiration,
    hosts,
  } = cluster;

  // only shows all information if a cluster is not deleted
  const isDeleted =
    cluster &&
    !name &&
    !user_name &&
    !status &&
    !region_name &&
    !template_id &&
    !description;
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

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        {!isDeleted ? (
          <Title headingLevel="h2">
            Cluster Name: {name}
            <Button
              className="btn-delete"
              variant="danger"
              onClick={handleModalToggle}
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
              <GridItem span={4} className="ql-card-layout">
                <OverView
                  owner={user_name}
                  status={status}
                  region={region_name}
                  template={`${template_id}`}
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
                  showLifespanBtn={keycloak.hasRealmRole('rhub-admin')}
                />
              </GridItem>
              <GridItem span={4} rowSpan={8} className="ql-card-layout">
                <UtilizationCard
                  num_vcpus={num_vcpus}
                  ram_mb={ram_mb}
                  volumes_gb={volumes_gb}
                  num_volumes={num_volumes}
                  cpuQuota={40}
                  ramQuotaMb={17000}
                  volumesMaxGb={120}
                />
              </GridItem>
              <GridItem span={8}>
                <ClusterInfo hosts={hosts} description={description} />
              </GridItem>
            </>
          ) : null}
          <GridItem span={8}>
            <ClusterEvents events={events} />
          </GridItem>
        </Grid>
      </PageSection>
      <Modal
        variant={ModalVariant.small}
        title="Please Confirm"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="delete" variant="danger" onClick={dispatchDelete}>
            Yes
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>,
        ]}
      >
        Are you sure that you want to delete the cluster: {name}?
      </Modal>
    </>
  );
};

export default ClusterDetails;
