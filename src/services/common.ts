/* eslint-disable import/prefer-default-export */
export const round = (value: number, precision: number) => {
  const multiplier = precision ? 10 ** precision : 1; // Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

export function isAnError(data: any): data is Error {
  return 'message' in data && 'name' in data;
}

export const stringStore = {
  supportLink:
    'https://redhat.service-now.com/help?id=sc_cat_item&sys_id=86aa3d1d1b0f4c10ebbe43f8bc4bcbe6&appID=c28af8f18747bc90892464250cbb35ba',
  contactLink: 'https://source.redhat.com/groups/public/resource_hub',
  guideLink:
    'https://source.redhat.com/groups/public/resource_hub/documentation',
  privacyPolicyLink:
    'https://source.redhat.com/departments/legal/globallegalcompliance/compliance_folder/employee_personal_information_privacy_statement_pdfpdf',
  dataRententionLink:
    'https://source.redhat.com/groups/public/resource_hub/user_documentation/data_retention_policy_for_resourcehub',
  releaseLink:
    'https://source.redhat.com/groups/public/resource_hub/release_history',
};
