import {
  Grid,
  GridItem,
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';
import React from 'react';

const QuickClusterUserActivity: React.FC = () => {
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h2">Activity</Title>
      </PageSection>
      <PageSection>
        <Grid hasGutter>
          <GridItem>Item 1</GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export default QuickClusterUserActivity;
