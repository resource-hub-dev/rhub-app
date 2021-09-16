import React from 'react';

import { Button, Card, CardTitle, CardBody } from '@patternfly/react-core';

import '../ClusterDetails.css';

export interface Props {
  description: string;
}

const ClusterInfo: React.FC<Props> = ({ description }: Props) => {
  const markup = { __html: description };
  return (
    <Card>
      <CardTitle>Cluster Information</CardTitle>
      <CardBody>
        <div dangerouslySetInnerHTML={markup} /> {/* eslint-disable-line */}
        <div>
          If SSH access to hosts in your cluster is needed, please download this
          key. See{' '}
          <a
            href="https://gitlab.cee.redhat.com/cee_ops/quicklab/-/wikis/access#accessing-the-cluster-hosts-via-ssh"
            rel="noreferrer"
            target="_blank"
          >
            here
          </a>{' '}
          for how to use this key.
          <br />
          <a
            href="https://gitlab.cee.redhat.com/cee_ops/quicklab/raw/master/docs/quicklab.key"
            download
            rel="noreferrer"
            target="_blank"
          >
            <Button title="Click to download key">quicklab.key</Button>
          </a>
        </div>
      </CardBody>
    </Card>
  );
};

export default ClusterInfo;
