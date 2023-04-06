import React, { ReactNode, useContext } from 'react';
import { useSelector } from 'react-redux';
import {
  AlertGroup,
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

import GraphsUtilization from './Graphs';
import { wizardContext } from '../QuickClusterWizard';
import { StepHeader } from '../helpers';

interface Props {
  /** Total Quota Usage after QuickCluster is Created */
  totalUsage: Quota;
  /** Array of Error Components */
  errors: React.ReactNode[];
}

const Review: React.FC<Props> = ({ totalUsage, errors }: Props) => {
  const [, , values] = useContext(wizardContext);
  const productId = Number(values?.product_id);
  const regionId = Number(values.region_id);
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
    (state: AppState) => state.labRegion.usage?.[regionId].user_quota
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
      <DescriptionListGroup key={param.variable}>
        <DescriptionListTerm>{param.name}</DescriptionListTerm>
        <DescriptionListDescription>{userInput}</DescriptionListDescription>
      </DescriptionListGroup>
    );
  });
  return (
    <>
      <AlertGroup isToast isLiveRegion>
        {errors}
      </AlertGroup>
      <StepHeader text="Summary" />
      <div style={{ display: 'flex' }}>
        <Card>
          <CardTitle>Details</CardTitle>
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
                <DescriptionListTerm>
                  Reservation Expires in
                </DescriptionListTerm>
                <DescriptionListDescription>
                  {`${values.reservation_expiration} days`}
                </DescriptionListDescription>
              </DescriptionListGroup>
              {rows}
            </DescriptionList>
          </CardBody>
        </Card>
        {quota && (
          <div
            style={{ padding: '16px' }}
            className="resource-summary-container"
          >
            <GraphsUtilization
              regionId={regionId}
              vCPUCoreUsed={totalUsage?.num_vcpus}
              ramMbUsed={totalUsage?.ram_mb}
              volumesGbUsed={totalUsage?.volumes_gb}
              vCPUCoreQuota={quota.num_vcpus}
              ramMbQuota={quota.ram_mb}
              volumesGbQuota={quota.volumes_gb}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Review;
