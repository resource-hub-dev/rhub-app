/* eslint-disable import/prefer-default-export */
import React, { ReactNode } from 'react';
import { LabProductParams } from '@ducks/lab/product/types';
import { Quota } from '@ducks/lab/types';
import {
  List,
  ListItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';

import './QuickClusterWizard.css';

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
        [item.variable]:
          values[item.variable] !== undefined
            ? values[item.variable]
            : item.default,
      };
    },
    {}
  );
};

// Generate values for graphs and charts from user's input of number of nodes
export const genGraphValues = (
  key: string,
  numNodes: number,
  flavors: { [key: string]: Quota },
  selectedFlavor?: string
) => {
  let flavorKey = key.substring(key.indexOf('num_') + 4);
  const isMasterFlavor = key.indexOf('master') !== -1;

  // In order to accommodate master's flavor being dynamic based on the number
  // of nodes, we need to set flavorKey to different flavors if the keys
  // multi and single appear in flavors
  if (isMasterFlavor) {
    const flavorKeys = Object.keys(flavors);
    if (numNodes === 1) {
      flavorKey =
        flavorKeys.find((flavorName) => flavorName.indexOf('single') !== -1) ||
        flavorKey;
    } else {
      flavorKey =
        flavorKeys.find((flavorName) => flavorName.indexOf('multi') !== -1) ||
        flavorKey;
    }
  }
  if (selectedFlavor) {
    return {
      num_vcpus: numNodes * flavors[selectedFlavor].num_vcpus,
      ram_mb: numNodes * flavors[selectedFlavor].ram_mb,
      volumes_gb: numNodes * flavors[selectedFlavor].volumes_gb,
      num_volumes: numNodes * flavors[selectedFlavor].num_volumes,
    };
  }
  return {
    num_vcpus: numNodes * flavors[flavorKey].num_vcpus,
    ram_mb: numNodes * flavors[flavorKey].ram_mb,
    volumes_gb: numNodes * flavors[flavorKey].volumes_gb,
    num_volumes: numNodes * flavors[flavorKey].num_volumes,
  };
};

// Generate total usage of cluster
export const genTotalUsage = (
  parameters: LabProductParams[],
  regionUsage: Quota,
  flavors: { [key: string]: Quota },
  values: WizardValues,
  nodeCountMap?: { [key: string]: number }, // this argument is for used when a node count changes
  selectedFlavor?: string
) => {
  const nodeParams = parameters.filter(
    (param) =>
      param.variable.indexOf('_nodes') !== -1 &&
      param.variable.indexOf('num') !== -1
  );

  // Special case for Generic clusters, which doesn't have specific types of nodes
  // and instead allows the user to select the flavor
  let genericFlavor: string | undefined;
  if (nodeParams[0].variable === 'num_nodes') {
    if (values.node_flavor) {
      genericFlavor = String(values.node_flavor);
    } else if (selectedFlavor) {
      genericFlavor = selectedFlavor;
    } else {
      genericFlavor = String(
        parameters.find((value) => value.variable === 'node_flavor')?.default
      );
    }
  }

  const defaultUsage = nodeParams.reduce(
    (data: Quota, currentParam: LabProductParams) => {
      // If selection exists, generate graph values based on this value instead of default value
      const prevSelection = values[currentParam.variable];
      let nodeCount = Number(currentParam.default);
      if (
        nodeCountMap &&
        nodeCountMap[currentParam.variable] !== null &&
        nodeCountMap[currentParam.variable] !== undefined
      ) {
        nodeCount = nodeCountMap[currentParam.variable];
      } else if (prevSelection !== null && prevSelection !== undefined) {
        nodeCount = Number(prevSelection);
      }

      const thisUsage = genGraphValues(
        currentParam.variable,
        nodeCount,
        flavors,
        genericFlavor
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
  return defaultUsage;
};
// Generate error message if user exceeded their quota
export const genQuotaExceededError = (usage: Quota, regionQuota: Quota) => {
  const keys = Object.keys(usage);
  for (const key of keys) {
    const percentUsed = (usage as any)[key] / (regionQuota as any)[key];
    if (percentUsed > 1)
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
  if (wizardErrors.indexOf(key) < 0)
    setWizardErrors((wizardErrs) => [...wizardErrs, key]);
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

// Convert exp days to Date String
export const convertToDateString = (expDays: number) => {
  const midnight = new Date();
  midnight.setTime(midnight.getTime() + 86400000);
  midnight.setUTCHours(0, 0, 0, 0);
  const timeStr = new Date(
    midnight.getTime() + Number(expDays) * 86400000
  ).toString();
  return timeStr;
};

export const validateConditions = (
  expr: any[],
  values: WizardValues,
  addErrors: (errorMsg: string, isValidationErr?: boolean) => void
): any => {
  // Evaluate condition expression.
  // ["not", <expr>]
  // ["and", <expr...>]
  // ["or", <expr...>]
  // ["param_eq", <param-name>, <value>]
  // ["param_ne", <param-name>, <value>]
  // ["param_lt", <param-name>, <value>]
  // ["param_gt", <param-name>, <value>]
  const op = expr[0];
  if (op === 'not') return !validateConditions(expr[1], values, addErrors);
  else if (op === 'and') {
    const mapped = expr
      .slice(1)
      .map((value) => validateConditions(value, values, addErrors));
    return mapped.every(Boolean);
  } else if (op === 'or') {
    const mapped = expr
      .slice(1)
      .map((value) => validateConditions(value, values, addErrors));
    return mapped.some(Boolean);
  }
  if (op === 'param_eq') {
    const val = values[expr[1]] === expr[2];
    return val;
  } else if (op === 'param_ne') {
    const val = values[expr[1]] !== expr[2];
    return val;
  } else if (op === 'param_lt') {
    const val = expr[1] in values && values[expr[1]] < expr[2];
    return val;
  } else if (op === 'param_gt') {
    const val = expr[1] in values && values[expr[1]] > expr[2];
    return val;
  }
  return false;
};

// Generate Options for Expiration Reservation Days
export const rsvpOpts = () => {
  return [
    {
      value: 1,
      label: `1 - Will expire on: ${convertToDateString(1)}`,
      disabled: false,
    },
    {
      value: 4,
      label: `4 - Will expire on: ${convertToDateString(4)}`,
      disabled: false,
    },
    {
      value: 7,
      label: `7 - Will expire on: ${convertToDateString(7)}`,
      disabled: false,
    },
  ];
};

// StepHeader is a mini header for each step in Wizard
interface StepHeaderProps {
  /** Header text */
  text: string;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  text,
}: StepHeaderProps) => {
  return (
    <TextContent className="step-header">
      <Text component={TextVariants.h3}>{text}</Text>
    </TextContent>
  );
};
