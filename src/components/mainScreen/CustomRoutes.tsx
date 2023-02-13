/* eslint-disable react/jsx-props-no-spreading, import/prefer-default-export, no-nested-ternary, react/jsx-curly-newline  */

import { useKeycloak } from '@react-keycloak/web';
import { AuthorizedFunction } from '@services/user';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  roles?: string[];
}

export const PublicRoute: React.FC<Props & Record<string, any>> = ({
  children,
  ...rest
}: Props) => {
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

  return (
    <Route {...rest}>
      {roles && keycloak.authenticated && AuthorizedFunction(roles) ? (
        children
      ) : !keycloak.authenticated ? (
        <Redirect to={{ pathname: '/login' }} />
      ) : (
        <Redirect to={{ pathname: '/' }} />
      )}
    </Route>
  );
};
