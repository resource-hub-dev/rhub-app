import React, { ReactNode, useState } from 'react';
import {
  BackgroundImage,
  Button,
  Card,
  ExpandableSection,
  Grid,
  GridItem,
  Title,
} from '@patternfly/react-core';
import {
  ArrowRightIcon,
  CatalogIcon,
  ClusterIcon,
  ExternalLinkAltIcon,
  TachometerAltIcon,
} from '@patternfly/react-icons';
import { useKeycloak } from '@react-keycloak/web';
import { Link } from 'react-router-dom';

import './LandingPage.css';
import { stringStore } from '@services/common';

const CustomLink: React.FC<{ link: string; children: ReactNode }> = ({
  link,
  children,
}) => (
  <div>
    <Button
      variant="link"
      component="a"
      href={link}
      target="_blank"
      className="info-link"
    >
      {children}
    </Button>
  </div>
);

const LandingPage: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const { keycloak, initialized } = useKeycloak();
  const images = {
    xs: '/assets/images/pfbg_576.jpg',
    xs2x: '/assets/images/pfbg_576@2x.jpg',
    sm: '/assets/images/pfbg_768.jpg',
    sm2x: '/assets/images/pfbg_768@2x.jpg',
    lg: '/assets/images/pfbg_1200.jpg',
  };

  const welcomeSection = (
    <GridItem rowSpan={8} className="welcome-section">
      <BackgroundImage src={images} />
      <div className="welcome-text">
        <Title headingLevel="h1" size="4xl">
          Welcome to the Resource Hub
        </Title>
        {!keycloak.authenticated && initialized && (
          <Button className="welcome-login-btn" component="a" href="/login">
            Log In To Your Account
          </Button>
        )}
      </div>
    </GridItem>
  );
  const infoSection = (
    <GridItem rowSpan={4}>
      <Card className="info-section">
        <ExpandableSection
          toggleText="Getting Started"
          onToggle={(isExpanded: boolean) => setExpanded(isExpanded)}
          isExpanded={expanded}
        >
          <Grid>
            <GridItem className="grid-card" span={6}>
              <div className="info-title-box learning-resources">
                <CatalogIcon className="info-title-icon learning-resources" />
                Learning Resources
              </div>
              <div>Getting started with documentation</div>
              <CustomLink link={stringStore.guideLink}>
                View All Documentation <ExternalLinkAltIcon />
              </CustomLink>
              <CustomLink link={stringStore.releaseLink}>
                See our release history <ExternalLinkAltIcon />
              </CustomLink>
              <CustomLink link={stringStore.dataRententionLink}>
                Data Retention Policy <ExternalLinkAltIcon />
              </CustomLink>
              <CustomLink link={stringStore.privacyPolicyLink}>
                Privacy Policy <ExternalLinkAltIcon />
              </CustomLink>
            </GridItem>
            <GridItem className="grid-card last-card" span={6}>
              <div className="info-title-box quick-cluster">
                <ClusterIcon className="info-title-icon quick-cluster" />
                Quick Cluster
              </div>
              <div>
                Quick Cluster provides quick, ready-to-use clusters with Red Hat
                products preinstalled. Shared clusters are open to all users of
                Resource Hub, please refrain from altering them or making
                changes that would break the cluster. In order to create a new
                personal cluster, please visit the My Clusters page
              </div>
              <div>
                <Button variant="link" className="info-link">
                  <Link to="/resources/quickcluster/shared">
                    Shared Clusters <ArrowRightIcon />
                  </Link>
                </Button>
              </div>
              <CustomLink link="/resources/quickcluster/clusters">
                My Clusters <ArrowRightIcon />
              </CustomLink>
            </GridItem>
          </Grid>
        </ExpandableSection>
      </Card>
    </GridItem>
  );

  return (
    <>
      <Grid className="welcome-page">
        {welcomeSection}
        {infoSection}
      </Grid>
      <br />
    </>
  );
};

export default LandingPage;
