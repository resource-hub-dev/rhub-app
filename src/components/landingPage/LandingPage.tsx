import React from 'react';
import { useSelector } from 'react-redux';

import {
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';

import config from '../../services/config';
import { AppState } from '../../store';

const LandingPage: React.FC = () => {
  const token = useSelector((state: AppState) => state.user.current.token);
  const loggedIn = useSelector((state: AppState) => state.user.loggedIn);

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Title headingLevel="h1" size="lg">
        Welcome to the Resource Hub!
      </Title>
      <br />
      Config:
      <pre>{JSON.stringify(config, null, 4)}</pre>
      <div>The user is {loggedIn ? '' : 'NOT'} authenticated</div>
      {token}
    </PageSection>
  );
};

export default LandingPage;
