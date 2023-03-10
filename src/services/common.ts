/* eslint-disable import/prefer-default-export */
export const round = (value: number, precision: number) => {
  const multiplier = precision ? 10 ** precision : 1; // Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

export function isAnError(data: any): data is Error {
  return 'message' in data && 'name' in data;
}

export const stringStore = {
  supportLink: process.env.RHUB_SUPPORT_LINK || '',
  contactLink: process.env.RHUB_CONTACT_LINK || '',
  guideLink: process.env.RHUB_GUIDE_LINK || '',
  privacyPolicyLink: process.env.PRIVACY_POLICY_LINK || '',
  dataRententionLink: process.env.DATA_RETENTION_LINK || '',
  releaseLink: process.env.RELEASE_LINK || '',
};
