import React from 'react';

import {
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';

import config from '../../services/config';

const LandingPage: React.FC = () => {
  return (
    <PageSection variant={PageSectionVariants.light}>
      <Title headingLevel="h1" size="lg">
        Welcome to Dandelion
      </Title>
      <br />
      Config:
      <pre>{JSON.stringify(config, null, 4)}</pre>
    </PageSection>
  );
};

export default LandingPage;
