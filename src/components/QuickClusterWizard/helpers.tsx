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

// Generate an object with variable as key and default value as value
export const genDefaultValues = (
  parameters: LabProductParams[],
  values: WizardValues
) => {
  return parameters.reduce(
    (
      data: Record<string, number | boolean | string | null>,
      item: LabProductParams
    ) => {
      return {
        ...data,
        [item.variable]: values[item.variable]
          ? values[item.variable]
          : item.default,
      };
    },
    { rsvp: values.rsvp || 1 }
  );
};

// Generate values for graphs and charts from user's input of number of nodes
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

// Generate error message if user exceeded their quota
export const genQuotaExceededError = (usage: Quota, regionQuota: Quota) => {
  const keys = Object.keys(usage);
  for (const key of keys) {
    const percentUsed = (usage as any)[key] / (regionQuota as any)[key];
    if (percentUsed >= 1)
      return 'Quota Exceeded: Please resize your QuickCluster';
  }
  return undefined;
};

// Add error message to the top-level WizardErrors
export const addWizardErrors = (
  wizardErrors: string[],
  setWizardErrors: React.Dispatch<React.SetStateAction<string[]>>,
  key: string
) => {
  if (wizardErrors.indexOf(key) < 0) setWizardErrors([...wizardErrors, key]);
};

// Remove error message from the top-level WizardErrors
export const removeWizardErrors = (
  wizardErrors: string[],
  setWizardErrors: React.Dispatch<React.SetStateAction<string[]>>,
  key: string
) => {
  const keyExistsInError = wizardErrors.indexOf(key) >= 0;
  const newWizardErrors = wizardErrors.filter((value: string) => value !== key);
  if (keyExistsInError) setWizardErrors(newWizardErrors);
};

// Generate Options for Expiration Reservation Days
export const rsvpOpts = () => {
  const getDateString = (delta: number) => {
    const midnight = new Date();
    midnight.setTime(midnight.getTime() + 86400000);
    midnight.setUTCHours(0, 0, 0, 0);
    const timeStr = new Date(midnight.getTime() + delta * 86400000).toString();
    return `${delta} - Will expire on: ${timeStr}`;
  };
  return [
    {
      value: 1,
      label: getDateString(1),
      disabled: false,
    },
    {
      value: 2,
      label: getDateString(4),
      disabled: false,
    },
    {
      value: 3,
      label: getDateString(7),
      disabled: false,
    },
  ];
};
