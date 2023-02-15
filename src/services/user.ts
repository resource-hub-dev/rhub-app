/* eslint-disable import/prefer-default-export  */

import { AppState } from '@store';
import { useSelector } from 'react-redux';

export const AuthorizedFunction = (requiredRoles: string[]) => {
  const userRoles = useSelector((state: AppState) => state.user.current.roles);
  if (requiredRoles.length === 0) return true;
  else if (requiredRoles && userRoles) {
    return requiredRoles.some((r) => userRoles.indexOf(r) !== -1);
  }
  return false;
};
