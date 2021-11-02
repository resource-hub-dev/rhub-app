/* eslint-disable import/prefer-default-export  */

import { useKeycloak } from '@react-keycloak/web';

export const AuthorizedFunction = (roles: string[]) => {
  const { keycloak } = useKeycloak();
  if (roles.length === 0) return true;
  else if (keycloak && roles) {
    return roles.some((r) => {
      const realm = keycloak.hasRealmRole(r);
      const resource = keycloak.hasResourceRole(r);
      return realm || resource;
    });
  }
  return false;
};
