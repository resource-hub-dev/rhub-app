import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUsageRequest } from '@ducks/lab/region/actions';

import { AppState } from '@store';
import { Quota } from '@ducks/lab/types';
import { LabProductParams } from '@ducks/lab/product/types';
import { Alert, AlertGroup } from '@patternfly/react-core';

import Questionnaire from './Questionnaire';
import GraphsUtilization from './Graphs';
import {
  addWizardErrors,
  genGraphValues,
  genQuotaExceededError,
  removeWizardErrors,
} from '../helpers';
import { wizardContext } from '../QuickClusterWizard';

interface Props {
  /** ID of Selected Product in the Wizard */
  productId: number;
  /** ID of Selected Region in the Wizard */
  regionId: number;
  /** Function to handle submit */
  onSubmit: (data: any) => void;
}

const ClusterConfiguration: React.FC<Props> = ({
  productId,
  regionId,
  onSubmit,
}: Props) => {
  const dispatch = useDispatch();
  const [wizardErrors, setWizardErrors] = useContext(wizardContext);
  // Addditional errors in addition to validation errors on the fields
  const [error, setErrors] = useState<React.ReactNode[]>([]);
  // Usage is used for the donut graphs and to flag errors if quota is filled
  const [usage, setUsage] = useState<{
    num_vcpus: number;
    ram_mb: number;
    volumes_gb: number;
    num_volumes: number;
  }>({ num_vcpus: 0, ram_mb: 0, volumes_gb: 0, num_volumes: 0 });

  const quota = useSelector(
    (state: AppState) =>
      state.labRegion.product_regions.find(
        (value) => value.region.id === regionId
      )?.region.user_quota
  );
  const regionUsage = useSelector(
    (state: AppState) => state.labRegion.usage?.user_quota_usage
  );
  const product = useSelector(
    (state: AppState) => state.labProduct.data[productId]
  );
  const parameters = product.parameters.filter((param) => !param.advanced);
  const { flavors } = product;

  const addErrors = (errorMsg: string) => {
    setErrors([
      ...error,
      <Alert
        variant="danger"
        title={errorMsg}
        aria-live="polite"
        isInline
        timeout={5000}
      />,
    ]);
    addWizardErrors(wizardErrors, setWizardErrors, 'step3');
  };

  useEffect(() => {
    dispatch(loadUsageRequest(regionId));
  }, [dispatch, regionId]);

  useEffect(() => {
    if (regionUsage && parameters) {
      const nodeParams = parameters.filter(
        (param) =>
          param.variable.indexOf('_nodes') !== -1 &&
          param.variable.indexOf('num') !== -1
      );
      const defaultUsage = nodeParams.reduce(
        (data: Quota, currentParam: LabProductParams) => {
          const thisUsage = genGraphValues(
            currentParam.variable,
            Number(currentParam.default),
            flavors
          );
          return {
            num_vcpus: data.num_vcpus + thisUsage.num_vcpus,
            ram_mb: data.ram_mb + thisUsage.ram_mb,
            volumes_gb: data.volumes_gb + thisUsage.volumes_gb,
            num_volumes: data.num_volumes + thisUsage.num_volumes,
          };
        },
        regionUsage
      );
      setUsage(defaultUsage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters.length, regionUsage, product.name, quota]);

  useEffect(() => {
    if (usage && quota) {
      const errorMsg = genQuotaExceededError(usage, quota);
      if (errorMsg) {
        addErrors(errorMsg);
      } else {
        setErrors([]);
        removeWizardErrors(wizardErrors, setWizardErrors, 'step3');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quota, usage]);

  // updateUsage takes future resources consumption from user inputs in the form and update usage state
  const updateUsage = (requiredResources: Quota) => {
    if (regionUsage)
      setUsage({
        num_vcpus: regionUsage.num_vcpus + requiredResources.num_vcpus,
        ram_mb: regionUsage.ram_mb + requiredResources.ram_mb,
        volumes_gb: regionUsage.volumes_gb + requiredResources.volumes_gb,
        num_volumes: regionUsage.num_volumes + requiredResources.num_volumes,
      });
  };

  // Step 3 includes parameters that are not in advanced step
  return (
    <>
      {regionUsage && quota && flavors && (
        <>
          <AlertGroup>{error}</AlertGroup>
          <div className="configuration-step-border">
            <Questionnaire
              productId={productId}
              updateUsage={updateUsage}
              parameters={parameters}
              onSubmit={onSubmit}
              stepId={3}
            />
          </div>
          <GraphsUtilization
            num_vcpus={usage?.num_vcpus}
            ram_mb={usage?.ram_mb}
            volumes_gb={usage?.volumes_gb}
            cpuQuota={quota.num_vcpus}
            ramQuotaMb={quota.ram_mb}
            volumesMaxGb={quota.volumes_gb}
          />
        </>
      )}
    </>
  );
};

export default ClusterConfiguration;
