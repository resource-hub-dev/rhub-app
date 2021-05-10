import React, { useEffect, useState } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
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
import { useKeycloak } from '@react-keycloak/web';
import { useDispatch } from 'react-redux';
import { loginRequest } from '../../store/ducks/user/actions';

import Cowsay from '../cowsay/Cowsay';
import LandingPage from '../landingPage/LandingPage';
import PageNotFound from '../pageNotFound/PageNotFound';
import { UserData } from '../../store/ducks/user/types';

const MainScreen: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const { keycloak, initialized } = useKeycloak();
  const dispatch = useDispatch();
  const onNavToggle = (): void => setIsNavOpen(!isNavOpen);
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

  const Header = (
    <PageHeader
      logo="Resource Hub"
      headerTools={Toolbar}
      showNavToggle={keycloak.authenticated}
      isNavOpen={isNavOpen}
      onNavToggle={onNavToggle}
    />
  );
  const Navigation = (
    <Nav id="nav-primary-simple" theme="dark">
      <NavList id="nav-list-simple">
        <NavItem>
          <NavLink exact to="/cowsay" activeClassName="pf-m-current">
            Cowsay
          </NavLink>
        </NavItem>
      </NavList>
    </Nav>
  );

  const Sidebar = (
    <PageSidebar
      nav={Navigation}
      isNavOpen={isNavOpen}
      theme="dark"
      data-testid="sidebar"
    />
  );
  if (!initialized) {
    return <h3>Loading ... !!!</h3>;
  }

  return (
    <Page header={Header} sidebar={keycloak.authenticated && Sidebar}>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/cowsay" component={Cowsay} />
        <Route path="*" component={PageNotFound} />
      </Switch>
    </Page>
  );
};

export default MainScreen;
