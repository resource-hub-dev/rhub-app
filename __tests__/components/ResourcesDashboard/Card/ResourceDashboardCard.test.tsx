import React from 'react';

import { connectedRender } from '@tests/testUtils';

import ResourcesDashboardCard from '@components/ResourcesDashboard/Card/ResourcesDashboardCard';

describe('<ResourcesDashboardCard />', () => {
  test('Renders with title', async () => {
    const { result } = connectedRender(
      <ResourcesDashboardCard
        title="title"
        logoLink="logo-link"
        logoAlt="logo-alt"
        body={<div>body</div>}
        footerLinks={[
          {
            link: 'footer-link',
            title: 'footer-title',
          },
        ]}
      />
    );

    expect(result.queryByText('title')).toBeInTheDocument();
    expect(result.queryByText('body')).toBeInTheDocument();

    const footerLink = result.getByText('footer-title').parentElement;
    expect(footerLink).toHaveAttribute('href', 'footer-link');
  });

  test('Renders without title', async () => {
    const { result } = connectedRender(
      <ResourcesDashboardCard
        logoLink="logo-link"
        logoAlt="logo-alt"
        body={<div>body</div>}
        footerLinks={[
          {
            link: 'footer-link',
            title: 'footer-title',
          },
        ]}
      />
    );

    expect(result.queryByText('body')).toBeInTheDocument();

    const footerLink = result.getByText('footer-title').parentElement;
    expect(footerLink).toHaveAttribute('href', 'footer-link');
  });
});
