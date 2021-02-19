import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { PageSection, PageSectionVariants } from '@patternfly/react-core';

import { loadRequest } from '../../store/ducks/cowsay/actions';
import { AppState } from '../../store';

const Cowsay: React.FC = () => {
  const dispatch = useDispatch();
  const message = useSelector((state: AppState) => state.cowsay.message);

  const queryMessage = (): void => {
    dispatch(loadRequest());
  };

  useEffect(queryMessage, [dispatch]);

  return (
    <PageSection variant={PageSectionVariants.dark}>{message}</PageSection>
  );
};

export default Cowsay;
