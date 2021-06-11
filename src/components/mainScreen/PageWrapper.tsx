import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Nav,
  NavList,
  Page,
  PageHeader,
  PageSidebar,
  PageHeaderTools,
  Button,
  NavExpandable,
  NavItem,
} from '@patternfly/react-core';
import { useKeycloak } from '@react-keycloak/web';

type Props = {
  children: React.ReactNode;
  isSideNavOpen: boolean;
  topNavActive: string | number;
  activeGroup: string | number;
  activeItem: string | number;
  onSideNavToggle: () => void;
  onTopNavSelect: (selectedItem: {
    groupId: number | string;
    itemId: number | string;
    to: string;
    event: React.FormEvent<HTMLInputElement>;
  }) => void;
  onSideNavSelect: (result: {
    groupId: number | string;
    itemId: number | string;
    to: string;
    event: React.FormEvent<HTMLInputElement>;
  }) => void;
  isAdmin?: boolean;
  isUser?: boolean;
  isPublic?: boolean;
};

const PageWrapper: React.FC<Props> = (props: Props) => {
  const { keycloak, initialized } = useKeycloak();
  const {
    isSideNavOpen,
    topNavActive,
    activeGroup,
    activeItem,
    onSideNavToggle,
    onTopNavSelect,
    onSideNavSelect,
    isAdmin,
    isUser,
    isPublic,
    children,
  } = props;

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

  const topNav = (
    <Nav onSelect={onTopNavSelect} variant="horizontal">
      <NavList>
        <NavItem key={1} itemId={1} isActive={topNavActive === 1}>
          <NavLink exact to="/resources" activeClassName="pf-m-current">
            Resources
          </NavLink>
        </NavItem>

        <NavItem key={2} itemId={2} isActive={topNavActive === 2}>
          <NavLink exact to="/admin" activeClassName="pf-m-current">
            Admin
          </NavLink>
        </NavItem>
      </NavList>
    </Nav>
  );
  const Header = (
    <PageHeader
      logo="Resource Hub"
      topNav={keycloak.authenticated && topNav}
      headerTools={Toolbar}
      showNavToggle={keycloak.authenticated}
      isNavOpen={isSideNavOpen}
      onNavToggle={onSideNavToggle}
    />
  );
  const devNavs = (
    <NavExpandable
      title="Link1"
      isActive={activeGroup === 'dev_itm-1'}
      groupId="dev_itm-1"
    >
      <NavItem
        preventDefault
        to="dev"
        groupId="dev_itm-1"
        itemId="dev_subitm-1"
        isActive={activeItem === 'dev_subitm-1'}
      >
        Dev Link 1
      </NavItem>
    </NavExpandable>
  );
  const adminNavs = (
    <NavExpandable
      title="Labs"
      isActive={activeGroup === 'lab_owner-1'}
      groupId="lab_owner-1"
    >
      <NavItem
        preventDefault
        to="admin"
        groupId="lab_owner-1"
        itemId="admin-1"
        isActive={activeItem === 'admin-1'}
      >
        Policy
      </NavItem>
    </NavExpandable>
  );
  const Navigation = (
    <Nav onSelect={onSideNavSelect} theme="dark">
      <NavList>{isAdmin ? adminNavs : devNavs}</NavList>
    </Nav>
  );
  const Sidebar = (
    <PageSidebar
      nav={Navigation}
      isNavOpen={isSideNavOpen}
      theme="dark"
      data-testid="sidebar"
    />
  );
  return (
    <Page
      header={Header}
      sidebar={keycloak.authenticated && !isPublic && Sidebar}
    >
      {children}
    </Page>
  );
};

export default PageWrapper;
