import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';

import { AppState } from '@store';
import { Quota } from '@ducks/lab/types';

import { WizardValues } from '../helpers';
import GraphsUtilization from './Graphs';

interface Props {
  values: WizardValues;
  productId: number;
  regionId: number;
  totalUsage: Quota;
}

const Review: React.FC<Props> = ({
  values,
  productId,
  totalUsage,
  regionId,
}: Props) => {
  const product = useSelector(
    (state: AppState) => state.labProduct.data[productId]
  );
  const region = useSelector(
    (state: AppState) =>
      state.labRegion.product_regions.find(
        (value) => value.region.id === regionId
      )?.region
  );

  const quota = useSelector(
    (state: AppState) => state.labRegion.usage?.user_quota
  );

  const basicParams = product.parameters.filter((param) => !param.advanced);
  const advancedParams = product.parameters.filter((param) => param.advanced);
  // combine all params and sort by basic first
  const allParams = [...basicParams, ...advancedParams];

  const rows: ReactNode[] = [];

  allParams.forEach((param) => {
    let userInput = values[param.variable];
    if (param.type === 'boolean') {
      userInput = userInput ? 'Yes' : 'No';
    }
    rows.push(
      <DescriptionListGroup>
        <DescriptionListTerm>{param.name}</DescriptionListTerm>
        <DescriptionListDescription>{userInput}</DescriptionListDescription>
      </DescriptionListGroup>
    );
  });
  return (
    <>
      <Card>
        <CardTitle>Details Summary</CardTitle>
        <CardBody>
          <DescriptionList
            columnModifier={{
              default: '2Col',
            }}
          >
            <DescriptionListGroup>
              <DescriptionListTerm>Product</DescriptionListTerm>
              <DescriptionListDescription>
                {product.name}
              </DescriptionListDescription>
            </DescriptionListGroup>
            {region && (
              <DescriptionListGroup>
                <DescriptionListTerm>Region</DescriptionListTerm>
                <DescriptionListDescription>
                  {region.name}
                </DescriptionListDescription>
              </DescriptionListGroup>
            )}
            <DescriptionListGroup>
              <DescriptionListTerm>Days of Reservation</DescriptionListTerm>
              <DescriptionListDescription>
                {values.rsvp}
              </DescriptionListDescription>
            </DescriptionListGroup>
            {rows}
          </DescriptionList>
        </CardBody>
      </Card>
      <br />
      {quota && (
        <Card className="resource-summary-container">
          <GraphsUtilization
            vCPUCoreUsed={totalUsage?.num_vcpus}
            ramMbUsed={totalUsage?.ram_mb}
            volumesGbUsed={totalUsage?.volumes_gb}
            vCPUCoreQuota={quota.num_vcpus}
            ramMbQuota={quota.ram_mb}
            volumesGbQuota={quota.volumes_gb}
          />
        </Card>
      )}
    </>
  );
};

export default Review;
