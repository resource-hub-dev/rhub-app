import { NavExpandable, NavItem } from '@patternfly/react-core';
import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavProps {
  activeGroup: string;
  activeItem: string;
}

export const AdminNav: React.FC<NavProps> = ({
  activeGroup,
  activeItem,
}: NavProps) => {
  return (
    <NavExpandable
      title="Labs"
      isActive={activeGroup === 'lab_owner-1'}
      groupId="lab_owner-1"
    >
      <NavItem
        groupId="lab_owner-1"
        itemId="admin-1"
        key="admin-1"
        isActive={activeItem === 'admin-1'}
      >
        <NavLink exact to="/admin_policy" activeClassName="pf-m-current">
          Policy
        </NavLink>
      </NavItem>
    </NavExpandable>
  );
};

export const UserNav: React.FC<NavProps> = ({
  activeGroup,
  activeItem,
}: NavProps) => {
  return (
    <NavExpandable
      title="QuickCluster"
      isActive={activeGroup === 'dev_itm-1'}
      groupId="dev_itm-1"
    >
      {/* <NavItem
        groupId="dev_itm-1"
        itemId="dev_subitm-1"
        key="dev_subitm-1"
        isActive={activeItem === 'dev_subitm-1'}
      >
        <NavLink
          exact
          to="/resources/quickcluster/shared"
          activeClassName="pf-m-current"
        >
          Shared Clusters
        </NavLink>
      </NavItem> */}
      <NavItem
        groupId="dev_itm-2"
        itemId="dev_subitm-2"
        key="dev_subitm-2"
        isActive={activeItem === 'dev_subitm-2'}
      >
        <NavLink
          exact
          to="/resources/quickcluster/clusters"
          activeClassName="pf-m-current"
        >
          My Clusters
        </NavLink>
      </NavItem>
      <NavItem
        groupId="dev_itm-3"
        itemId="dev_subitm-3"
        key="dev_subitm-3"
        isActive={activeItem === 'dev_subitm-3'}
      >
        <NavLink
          exact
          to="/resources/quickcluster/activity"
          activeClassName="pf-m-current"
        >
          My Activity
        </NavLink>
      </NavItem>
    </NavExpandable>
  );
};
