/* eslint-disable import/prefer-default-export */
import { LabProductParams } from '@ducks/lab/product/types';
import { Quota } from '@ducks/lab/types';

import React from 'react';

export type WizardValues = { [key: string]: string | number | boolean };

export const addWizardValues = (
  values: WizardValues,
  newValues: WizardValues,
  setValues: React.Dispatch<React.SetStateAction<WizardValues>>
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
  numNodes: number,
  flavors: { [key: string]: Quota }
) => {
  const flavor_key = key.substring(key.indexOf('num_') + 4);
  return {
    num_vcpus: numNodes * flavors[flavor_key].num_vcpus,
    ram_mb: numNodes * flavors[flavor_key].ram_mb,
    volumes_gb: numNodes * flavors[flavor_key].volumes_gb,
    num_volumes: numNodes * flavors[flavor_key].num_volumes,
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

export const addWizardErrors = (
  wizardErrors: string[],
  setWizardErrors: React.Dispatch<React.SetStateAction<string[]>>,
  key: string
) => {
  if (wizardErrors.indexOf(key) < 0) setWizardErrors([...wizardErrors, key]);
};

export const removeWizardErrors = (
  wizardErrors: string[],
  setWizardErrors: React.Dispatch<React.SetStateAction<string[]>>,
  key: string
) => {
  const keyExistsInError = wizardErrors.indexOf(key) >= 0;
  const newWizardErrors = wizardErrors.filter((value: string) => value !== key);
  if (keyExistsInError) setWizardErrors(newWizardErrors);
};
