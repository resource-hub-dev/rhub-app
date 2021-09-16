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

import { loadRequest, deleteRequest } from '@ducks/cluster/actions';

interface Props {
  clusterId: string;
}

const ClusterDetails: React.FC = () => {
    const dispatch = useDispatch();
    const routerHistory = useHistory();

    
    const { clusterId } = useParams<Props>();
    useEffect(() => {

    })
    return(<></>);
}

export default ClusterDetails;