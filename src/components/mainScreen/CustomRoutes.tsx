/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable  import/prefer-default-export */

import { StrikethroughIconConfig } from '@patternfly/react-icons';
import { useKeycloak } from '@react-keycloak/web';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  roles?: string[];
}

export const Login: React.FC = () => {
  // dummy component for keycloak login
  const { keycloak } = useKeycloak();

  keycloak.login();
  return (<></>);
};

export const PublicRoute: React.FC<Props & Record<string, any>> = ({
  children,
  isAuthenticated,
  ...rest
}) => {
  const { keycloak } = useKeycloak();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !keycloak.authenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export const PrivateRoute: React.FC<Props & Record<string, any>> = ({
  children,
  roles,
  ...rest
}: Props) => {
  const { keycloak } = useKeycloak();

  const isAuthorized = (roleList: string[]) => {
    if (roleList.length === 0) return true;
    if (keycloak && roleList) {
      return roleList.some((r) => {
        const realm = keycloak.hasRealmRole(r);
        const resource = keycloak.hasResourceRole(r);
        return realm || resource;
      });
    }
    return false;
  };

  return (
    <Route {...rest}>
      {roles && keycloak.authenticated && isAuthorized(roles) ? (
        children
      ) : !keycloak.authenticated ? (
        <Redirect to={{ pathname: '/login' }} />
      ): <Redirect to={{ pathname: '/' }} />}
    </Route>
  );
};
