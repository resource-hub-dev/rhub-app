import {
  PageSection,
  TextContent,
  Text,
  PageSectionVariants,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import React from 'react';
import ResourcesDashboardSvg from 'assets/images/QuickCluster.svg';

import './ResourcesDashboard.css';
import ResourcesDashboardCard from './Card/ResourcesDashboardCard';

const ResourcesDashboard: React.FC = () => {
  const dashboardItems = [
    {
      logoLink: ResourcesDashboardSvg,
      logoAlt: 'quickcluster',
      body: (
        <div>
          {' '}
          <Text component="p">
            QuickCluster provides short-lived clusters with Red Hat products
            preinstalled that could be created with a single click, perfect for
            customer reproducers. It is the successor of QuickLab.
          </Text>
          <Text component="p" className="subtitle">
            This service is hosted on OpenShift and powered by OpenStack and
            Ansible Tower
          </Text>
        </div>
      ),
      footerLinks: [
        {
          link: '/resources/quickcluster/clusters',
          title: 'View My Clusters',
        },
        {
          link: '/resources/quickcluster/shared',
          title: 'Explore OpenShift Shared Clusters',
        },
        {
          link: '/resources/quickcluster/activity',
          title: 'My Activity',
        },
      ],
    },
  ];

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Get Started with Resources</Text>
          <Text component="h3" className="subtitle">
            Explore a Wide Range of Resources that Resource Hub Offers to
            Automate and Expedite Your Workflow
          </Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.default}>
        <Grid hasGutter md={6} lg={3}>
          {dashboardItems.map((item) => (
            <GridItem>
              <ResourcesDashboardCard
                logoLink={item.logoLink}
                logoAlt={item.logoAlt}
                body={item.body}
                footerLinks={item.footerLinks}
              />
            </GridItem>
          ))}
        </Grid>
      </PageSection>
    </>
  );
};

export default ResourcesDashboard;
