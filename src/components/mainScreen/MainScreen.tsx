import React, { useEffect, useState } from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useDispatch } from 'react-redux';
import {
  Button,
  Nav,
  NavItem,
  NavList,
  Page,
  PageHeader,
  PageHeaderTools,
  PageSidebar,
} from '@patternfly/react-core';

import { loginRequest, updateToken } from '@ducks/user/actions';
import { UserData } from '@ducks/user/types';
import ClusterDetails from '@components/clusterDetails/ClusterDetails';
import SharedClusters from '@components/clusters/SharedClusters';
import MyClusters from '@components/clusters/MyClusters';
import ResourcesDashboard from '@components/ResourcesDashboard/ResourcesDashboard';
import QuickClusterWizard from '@components/QuickClusterWizard/QuickClusterWizard';

import { Login, PrivateRoute, PublicRoute } from './CustomRoutes';

import Cowsay from '../cowsay/Cowsay';
import Policies from '../policies/Policies';
import LandingPage from '../landingPage/LandingPage';
import PageNotFound from '../pageNotFound/PageNotFound';
import { AdminNav, UserNav } from './Navigation';

const MainScreen: React.FC = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);
  const [topNavActive, setTopNavActive] = useState<string | number>(0);
  const [activeGroup, setActiveGroup] = useState<number | string>('');
  const [activeItem, setActiveItem] = useState<number | string>('');
  const { keycloak, initialized } = useKeycloak();

  const dispatch = useDispatch();
  keycloak.onTokenExpired = () => {
    keycloak
      .updateToken(5)
      .then((refreshed) => {
        if (refreshed) {
          dispatch(updateToken(keycloak.token));
        }
      })
      .catch(() => {
        keycloak.logout();
      });
  };
  useEffect(() => {
    if (keycloak.authenticated) {
      const userProfile: any = keycloak.tokenParsed; // type is any because Keycloak defines this very loosely
      const user: UserData = {
        name: userProfile.name,
        email: userProfile.email,
        id: userProfile.sub,
        token: keycloak.token!,
      };
      dispatch(loginRequest(user));
    }
  }, [dispatch, keycloak.token, keycloak.authenticated, keycloak.tokenParsed]);

  const onSideNavToggle = (): void => setIsSideNavOpen(!isSideNavOpen);
  const onTopNavSelect = (selectedItem: {
    groupId: number | string;
    itemId: number | string;
    to: string;
    event: React.FormEvent<HTMLInputElement>;
  }) => {
    setTopNavActive(selectedItem.itemId);
  };
  const onSideNavSelect = (result: {
    groupId: number | string;
    itemId: number | string;
    to: string;
    event: React.FormEvent<HTMLInputElement>;
  }) => {
    setActiveGroup(result.groupId);
    setActiveItem(result.itemId);
  };

  if (!initialized) {
    return <h3>Loading ... !!!</h3>;
  }

  const Toolbar = (
    <PageHeaderTools>
      <Button variant="link">Guide</Button>
      <Button variant="link">Contact</Button>
      <Button variant="link">Report Issue</Button>
      {keycloak.authenticated && initialized && (
        <Button variant="secondary" onClick={() => keycloak.logout()}>
          Log Out
        </Button>
      )}
    </PageHeaderTools>
  );

  const topNav = (
    <Nav onSelect={onTopNavSelect} variant="horizontal">
      <NavList>
        <NavItem key={1} itemId={1} isActive={topNavActive === 1}>
          <NavLink exact to="/resources">
            Resources
          </NavLink>
        </NavItem>

        <NavItem key={2} itemId={2} isActive={topNavActive === 2}>
          <NavLink exact to="/admin">
            Admin
          </NavLink>
        </NavItem>
      </NavList>
    </Nav>
  );
  const Header = (
    <PageHeader
      logo="Resource Hub"
      logoProps={{
        href: '/',
      }}
      topNav={keycloak.authenticated && topNav}
      headerTools={Toolbar}
      showNavToggle={keycloak.authenticated}
      isNavOpen={isSideNavOpen}
      onNavToggle={onSideNavToggle}
    />
  );

  const Navigation = (
    <Nav onSelect={onSideNavSelect} theme="dark">
      <NavList>
        {topNavActive === 2 ? (
          <AdminNav
            activeGroup={`${activeGroup}`}
            activeItem={`${activeItem}`}
          />
        ) : (
          <UserNav
            activeGroup={`${activeGroup}`}
            activeItem={`${activeItem}`}
          />
        )}
      </NavList>
    </Nav>
  );
  const Sidebar = (
    <PageSidebar
      nav={Navigation}
      isNavOpen={isSideNavOpen}
      theme="dark"
      data-testid="sidebar"
    />
  );
  return (
    <Page header={Header} sidebar={keycloak.authenticated && Sidebar}>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <PublicRoute exact path="/login">
          <Login />
        </PublicRoute>
        <PrivateRoute
          roles={[]}
          exact
          path="/resources/quickcluster/clusters/:clusterId"
        >
          <ClusterDetails />
        </PrivateRoute>
        <PrivateRoute roles={[]} exact path="/resources/quickcluster/shared">
          <SharedClusters />
        </PrivateRoute>
        <PrivateRoute roles={[]} exact path="/resources/quickcluster/clusters">
          <MyClusters />
        </PrivateRoute>
        <PrivateRoute roles={[]} exact path="/resources/quickcluster/new">
          <QuickClusterWizard />
        </PrivateRoute>
        <Route exact path="/cowsay" component={Cowsay} />
        <PrivateRoute roles={[]} exact path="/resources">
          <ResourcesDashboard />
        </PrivateRoute>
        <PrivateRoute roles={['policy-owner']} exact path="/admin">
          <Cowsay />
        </PrivateRoute>
        <PrivateRoute roles={['policy-owner']} exact path="/admin_policy">
          <Policies />
        </PrivateRoute>
        <Route path="*" component={PageNotFound} />
      </Switch>
    </Page>
  );
};

export default MainScreen;
