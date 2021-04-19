import Keycloak from 'keycloak-js';
import config from './config';

const keycloak: Keycloak.KeycloakInstance = Keycloak({
  realm: config.keycloakRealm,
  url: config.authUrl,
  clientId: config.keycloakClient,
});

export default keycloak;
