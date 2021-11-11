import {
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Text,
  Button,
} from '@patternfly/react-core';
import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  title?: string;
  logoLink: string;
  logoAlt: string;
  body: React.ReactNode;
  footerLinks: {
    link: string;
    title: string;
  }[];
}

const ResourcesDashboardCard: React.FC<Props> = ({
  title,
  logoLink,
  logoAlt,
  body,
  footerLinks,
}: Props) => {
  const customFooter = footerLinks.map((footerLink) => (
    <Link
      to={{
        pathname: footerLink.link,
        // eslint-disable-next-line no-restricted-globals
        state: { prevPath: location.pathname },
      }}
    >
      <Button variant="link">{footerLink.title}</Button>
    </Link>
  ));
  return (
    <Card>
      <CardTitle>
        <img src={logoLink} alt={logoAlt} height="50px" />
        {title && <Text component="p">{title}</Text>}
      </CardTitle>
      <CardBody>{body}</CardBody>
      <CardFooter>{customFooter}</CardFooter>
    </Card>
  );
};

export default ResourcesDashboardCard;
