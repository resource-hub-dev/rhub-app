/* eslint-disable import/prefer-default-export */
export const useKeycloak = () => {
  const token = 'A random string that is non zero length';
  const userProfile = {
    username: 'test',
    email: 'test@testdomain.com',
    firstName: 'Test',
    lastName: 'User',
  };
  const realmAccess = { roles: ['admin', 'auditor', 'user'] };
  let authenticated = false;

  const authClient = {
    authenticated,
    hasRealmRole(role: string) {
      return true;
    },
    hasResourceRole(role: string) {
      return true;
    },
    idToken: token,
    initialized: true,
    loadUserProfile() {
      return Promise.resolve({ userProfile });
    },
    login() {
      authenticated = true;
    },
    logout() {
      authenticated = false;
    },
    profile: userProfile,
    realm: 'DemoRealm',
    realmAccess,
    refreshToken: token,
    token,
  };
  return { initialized: true, keycloak: authClient };
};
