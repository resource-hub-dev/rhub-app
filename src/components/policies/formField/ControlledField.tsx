import React from 'react';
import { FormGroup, Switch } from '@patternfly/react-core';
import { Controller, useFormContext } from 'react-hook-form';

interface Props {
  children: React.ReactNode;
  label: string;
  controllerName: string;
  switchId: string;
  fieldId: string;
  validated?: 'error' | 'default' | 'warning' | 'success';
  helperTextInvalid?: React.ReactNode;
}

const ControlledField: React.FC<Props> = ({
  children,
  label,
  controllerName,
  switchId,
  fieldId,
  validated,
  helperTextInvalid,
}: Props) => {
  const { control } = useFormContext();
  return (
    <FormGroup
      label={label}
      labelInfo={
        <Controller
          name={controllerName}
          control={control}
          defaultValue={false}
          render={({ field: { onChange, value } }) => (
            <Switch
              isChecked={value}
              onChange={onChange}
              id={switchId}
              label="Enabled"
              labelOff="Disabled"
            />
          )}
        />
      }
      fieldId={fieldId}
      validated={validated}
      helperTextInvalid={helperTextInvalid}
    >
      {children}
    </FormGroup>
  );
};

export default ControlledField;
