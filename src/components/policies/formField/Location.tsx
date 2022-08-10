import { FormSelect, FormSelectOption } from '@patternfly/react-core';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import ControlledField from './ControlledField';

interface Props {
  watchLocationEnabled: boolean;
  locationOptions: {
    value: number;
    label: string;
  }[];
}
const Location: React.FC<Props> = ({
  watchLocationEnabled,
  locationOptions,
}: Props) => {
  const { control } = useFormContext();
  return (
    <ControlledField
      label="Location"
      controllerName="constraintsEnabled.location_id"
      switchId="location-switch"
      fieldId="location"
    >
      <Controller
        name="location"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <FormSelect
            {...field}
            isDisabled={!watchLocationEnabled}
            id="location-select"
          >
            {locationOptions.map((option) => (
              <FormSelectOption
                key={`location-${option.value}`}
                value={option.value}
                label={option.label}
                isDisabled={!watchLocationEnabled}
              />
            ))}
          </FormSelect>
        )}
      />
    </ControlledField>
  );
};

export default Location;
