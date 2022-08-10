import { Grid, GridItem, TextInput } from '@patternfly/react-core';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import ControlledField from './ControlledField';

interface Props {
  watchServAvailEnabled: boolean;
}
const ServiceAvailability: React.FC<Props> = ({
  watchServAvailEnabled,
}: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <ControlledField
      label="Service Availability"
      controllerName="constraintsEnabled.servAvail"
      switchId="serv-avail-switch"
      fieldId="serv-avail"
    >
      <TextInput
        {...register('servAvail', {
          min: { value: 0, message: 'Cannot be negative' },
          valueAsNumber: true,
          disabled: !watchServAvailEnabled,
        })}
        isDisabled={!watchServAvailEnabled}
        type="number"
        defaultValue={0}
        aria-labelledby="serv-avail"
        validated={errors.servAvail ? 'error' : 'default'}
        onChange={() => undefined}
      />
    </ControlledField>
  );
};

export default ServiceAvailability;
