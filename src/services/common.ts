/* eslint-disable import/prefer-default-export */
export const round = (value: number, precision: number) => {
  const multiplier = precision ? 10 ** precision : 1; // Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};
