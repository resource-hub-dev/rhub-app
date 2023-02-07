import React from 'react';
import {
  LoginFooterItem,
  LoginForm,
  LoginPage,
  ListItem,
  ListVariant,
  Button,
  Card,
} from '@patternfly/react-core';
import config from '@services/config';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

import './login.css';

const RhubLoginPage: React.FC = () => {
  const [showHelperText, setShowHelperText] = React.useState(false);
  const [showLoginForm, setShowLoginForm] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [isValidUsername, setIsValidUsername] = React.useState(true);
  const [password, setPassword] = React.useState('');
  const [isValidPassword, setIsValidPassword] = React.useState(true);

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const onLoginButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setIsValidUsername(!!username);
    setIsValidPassword(!!password);
    setShowHelperText(!username || !password);
  };

  const listItem = (
    <>
      <ListItem>
        <LoginFooterItem href="#">Help</LoginFooterItem>
      </ListItem>
    </>
  );

  const loginForm = (
    <>
      <Button
        component="a"
        href={config.rhubSsoEndpoint}
        variant="secondary"
        className="login-menu-btn"
      >
        Red Hat SSO (recommended)
      </Button>
      <Button
        onClick={toggleLoginForm}
        variant="secondary"
        className="login-menu-btn"
      >
        Resource Hub Login
      </Button>
      {showLoginForm ? (
        <Card className="login-card">
          <LoginForm
            className="login-form"
            showHelperText={showHelperText}
            helperText="Invalid login credentials."
            helperTextIcon={<ExclamationCircleIcon />}
            usernameLabel="Username"
            usernameValue={username}
            onChangeUsername={handleUsernameChange}
            isValidUsername={isValidUsername}
            passwordLabel="Password"
            passwordValue={password}
            onChangePassword={handlePasswordChange}
            isValidPassword={isValidPassword}
            onLoginButtonClick={onLoginButtonClick}
            loginButtonLabel="Log in"
          />
        </Card>
      ) : null}
    </>
  );

  const images = {
    lg: '/assets/images/pfbg_1200.jpg',
    sm: '/assets/images/pfbg_768.jpg',
    sm2x: '/assets/images/pfbg_768@2x.jpg',
    xs: '/assets/images/pfbg_576.jpg',
    xs2x: '/assets/images/pfbg_576@2x.jpg',
  };

  return (
    <LoginPage
      footerListVariants={ListVariant.inline}
      backgroundImgSrc={images}
      footerListItems={listItem}
      loginTitle="Log in to your account"
      loginSubtitle="Please select Red Hat SSO or Resource Hub LDAP"
    >
      {loginForm}
    </LoginPage>
  );
};

export default RhubLoginPage;
