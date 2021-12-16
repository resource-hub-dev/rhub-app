/* eslint-disable import/prefer-default-export */
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
