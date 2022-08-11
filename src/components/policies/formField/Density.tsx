import { TextInput } from '@patternfly/react-core';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import ControlledField from './ControlledField';

interface Props {
  watchDensityEnabled: boolean;
}
const Density: React.FC<Props> = ({ watchDensityEnabled }: Props) => {
  const { register } = useFormContext();
  return (
    <ControlledField
      label="Density"
      controllerName="constraintsEnabled.density"
      switchId="density-switch"
      fieldId="density"
    >
      <TextInput
        {...register('density', {
          disabled: !watchDensityEnabled,
        })}
        isDisabled={!watchDensityEnabled}
        type="text"
        aria-labelledby="density"
        onChange={() => undefined}
      />
    </ControlledField>
  );
};

export default Density;
