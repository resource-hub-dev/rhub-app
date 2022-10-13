import { Grid, GridItem, TextInput } from '@patternfly/react-core';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { stringStore } from '../helpers';
import ControlledField from './ControlledField';

interface Props {
  watchCostEnabled: boolean;
}
const Cost: React.FC<Props> = ({ watchCostEnabled }: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <ControlledField
      label="Cost"
      switchId="cost-switch"
      controllerName="constraintsEnabled.cost"
      fieldId="cost"
      validated={errors.cost ? 'error' : 'default'}
      helperTextInvalid={errors.cost && errors.cost.message}
      tooltip={stringStore.cost}
    >
      <TextInput
        {...register('cost', {
          min: { value: 0, message: 'Cannot be negative' },
          valueAsNumber: true,
          disabled: !watchCostEnabled,
        })}
        isDisabled={!watchCostEnabled}
        type="number"
        defaultValue={0}
        aria-labelledby="cost"
        validated={errors.cost ? 'error' : 'default'}
        onChange={() => undefined}
      />
    </ControlledField>
  );
};

export default Cost;
