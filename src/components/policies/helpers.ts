/* eslint-disable import/prefer-default-export */

import { LabPolicyData, SubmitPolicyData } from '@ducks/lab/policy/types';
import { Control, useWatch } from 'react-hook-form';
import { PolicyFormData } from './PolicyForm';

export const getDefaultFormValues = (
  currentPolicy: LabPolicyData
): PolicyFormData => {
  return {
    name: currentPolicy.name,
    department: currentPolicy.department,
    schedAvailFrom: currentPolicy.constraint.sched_avail
      ? currentPolicy.constraint.sched_avail[0]
      : null,
    schedAvailTo: currentPolicy.constraint.sched_avail
      ? currentPolicy.constraint.sched_avail[1]
      : null,
    servAvail: Number(currentPolicy.constraint.serv_avail),
    limit: currentPolicy.constraint.limit
      ? Object.keys(currentPolicy.constraint.limit).map((key: string) => ({
          key,
          value: Object(currentPolicy.constraint.limit)[key],
        }))
      : null,
    density: currentPolicy.constraint.density,
    tag: currentPolicy.constraint.tag
      ? currentPolicy.constraint.tag.map((value: string) => ({ value }))
      : null,
    cost: Number(currentPolicy.constraint.cost),
    location: currentPolicy.constraint.location
      ? currentPolicy.constraint.location.id
      : null,
    constraintsEnabled: {
      schedAvail: currentPolicy.constraint.sched_avail !== null,
      servAvail: currentPolicy.constraint.serv_avail !== null,
      limit: currentPolicy.constraint.limit !== null,
      density: currentPolicy.constraint.density !== null,
      tag: currentPolicy.constraint.tag !== null,
      cost: currentPolicy.constraint.cost !== null,
      location_id: currentPolicy.constraint.location_id !== null,
    },
  };
};

export const getSubmitData = (formData: PolicyFormData): SubmitPolicyData => {
  return {
    name: formData.name,
    department: formData.department,
    constraint: {
      sched_avail:
        formData.constraintsEnabled.schedAvail &&
        formData.schedAvailFrom &&
        formData.schedAvailTo
          ? [formData.schedAvailFrom, formData.schedAvailTo]
          : null,
      serv_avail: formData.constraintsEnabled.servAvail
        ? formData.servAvail
        : null,
      limit:
        formData.constraintsEnabled.limit && formData.limit
          ? formData.limit.reduce(
              (result, current) => ({
                ...result,
                [current.key]: current.value,
              }),
              {}
            )
          : null,
      density: formData.constraintsEnabled.density ? formData.density : null,
      tag:
        formData.constraintsEnabled.tag && formData.tag
          ? formData.tag?.map((item) => item.value)
          : null,
      cost: formData.constraintsEnabled.cost ? formData.cost : null,
      location_id: formData.constraintsEnabled.location_id
        ? Number(formData.location)
        : null,
    },
  };
};

export const stringStore = {
  name: 'Name of Policy',
  department:
    'Group of users in this department will be affected by this policy',
  scheduledAvailability: 'Time period in which users can reserve resources',
  quota: 'Resource limit',
  tag: 'Name of Specific hardware/software, could be used to filter',
  cost: 'Cost of / Budget for resources',
  location: 'Resource location',
};
