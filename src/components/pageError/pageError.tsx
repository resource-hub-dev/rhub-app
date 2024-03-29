import React from 'react';
import {
  Title,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { OutlinedMehIcon } from '@patternfly/react-icons';

interface Props {
  msg?: string;
}

const PageError: React.FC<Props> = ({ msg }) => {
  return (
    <EmptyState>
      <EmptyStateIcon icon={OutlinedMehIcon} />
      <Title size="lg" headingLevel="h1">
        {msg || 'Oops. An error has occured'}
      </Title>
      <EmptyStateBody>
        Please refresh the page. If the issue persists, please contact our team
      </EmptyStateBody>
    </EmptyState>
  );
};

export default PageError;
