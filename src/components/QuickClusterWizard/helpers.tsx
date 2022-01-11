/* eslint-disable import/prefer-default-export */
import { LabProductParams } from '@ducks/lab/product/types';
import { Quota } from '@ducks/lab/types';
import { Flavors as flavors } from '@facts/flavors';

import React from 'react';

export const addWizardValues = (
  values: { [key: string]: any },
  newValues: { [key: string]: any },
  setValues: React.Dispatch<React.SetStateAction<Record<string, any>>>
) => {
  setValues({
    ...values,
    ...newValues,
  });
};

// generate an object with variable as key and default value as value
export const genDefaultValues = (parameters: LabProductParams[]) => {
  return parameters.reduce(
    (
      data: Record<string, number | boolean | string | null>,
      item: LabProductParams
    ) => {
      return {
        ...data,
        [item.variable]: item.default,
      };
    },
    {}
  );
};

export const genGraphValues = (
  key: string,
  productName: string,
  numNodes: number
) => {
  const productFlavor = flavors[productName];
  const flavor_key = key.substring(key.indexOf('num_') + 4);
  return {
    num_vcpus: numNodes * productFlavor[flavor_key].num_vcpus,
    ram_mb: numNodes * productFlavor[flavor_key].ram_mb,
    volumes_gb: numNodes * productFlavor[flavor_key].volumes_gb,
    num_volumes: numNodes * productFlavor[flavor_key].num_volumes,
  };
};

export const genQuotaExceededError = (usage: Quota, regionQuota: Quota) => {
  const keys = Object.keys(usage);
  for (const key of keys) {
    const percentUsed = (usage as any)[key] / (regionQuota as any)[key];
    if (percentUsed >= 1)
      return 'Quota Exceeded: Check the graphs for more details';
  }
  return undefined;
};
