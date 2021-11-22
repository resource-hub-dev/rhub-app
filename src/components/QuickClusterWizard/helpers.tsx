/* eslint-disable import/prefer-default-export */
export const appendObjects = (
  obj1: { [key: string]: any },
  obj2: { [key: string]: any }
) => {
  return {
    ...obj1,
    ...obj2,
  };
};
