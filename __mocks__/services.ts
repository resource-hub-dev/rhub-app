export const unauthenticated = () => {
  const token = 'A random string that is non zero length';
  const userProfile = {
    username: 'test',
    email: 'test@testdomain.com',
    firstName: 'Test',
    lastName: 'User',
    name: 'Test User',
    sub: '0012-232344abc-122',
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
    tokenParsed: userProfile,
  };
  return { initialized: true, keycloak: authClient };
};

export const authenticated = () => {
  return {
    initialized: true,
    keycloak: {
      ...unauthenticated().keycloak,
      authenticated: true,
    },
  };
};

export const subject = () => {
  return {
    initialized: true,
    keycloak: {
      ...authenticated().keycloak,
      subject: 1,
    },
  };
};
