import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useDispatch } from 'react-redux';

import { loginRequest, updateToken } from '@ducks/user/actions';
import { UserData } from '@ducks/user/types';

import PageWrapper from './PageWrapper';
import Cowsay from '../cowsay/Cowsay';
import Policies from '../policies/Policies';
import LandingPage from '../landingPage/LandingPage';
import PageNotFound from '../pageNotFound/PageNotFound';

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
  }) => setTopNavActive(selectedItem.itemId);
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

  // Generic function to generate component with all the handlers ready
  interface GenericProps {
    component: React.ReactNode;
    isPublic?: boolean;
    isUser?: boolean;
    isAdmin?: boolean;
  }
  const generatePage = ({
    component,
    isPublic,
    isUser,
    isAdmin,
  }: GenericProps) => {
    return (
      <PageWrapper
        isPublic={isPublic}
        isUser={isUser}
        isAdmin={isAdmin}
        isSideNavOpen={isSideNavOpen}
        topNavActive={topNavActive}
        activeGroup={activeGroup}
        activeItem={activeItem}
        onSideNavToggle={onSideNavToggle}
        onTopNavSelect={onTopNavSelect}
        onSideNavSelect={onSideNavSelect}
      >
        {component}
      </PageWrapper>
    );
  };

  return (
    <Switch>
      <Route exact path="/">
        {generatePage({ component: <LandingPage />, isPublic: true })}
      </Route>
      <Route exact path="/resources">
        {generatePage({ component: <Cowsay />, isUser: true })}
      </Route>
      <Route exact path="/admin">
        {generatePage({ component: <Cowsay />, isAdmin: true })}
      </Route>
      <Route exact path="/admin_policy">
        {generatePage({ component: <Policies />, isAdmin: true })}
      </Route>
      <Route path="*" component={PageNotFound} />
    </Switch>
  );
};

export default MainScreen;
