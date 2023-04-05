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

export const productsWithStaticNodes: Record<string, any> = {
  openshift4upi: {
    parameters: [
      {
        variable: 'num_bootstrap_nodes',
        default: 1,
      },
      {
        variable: 'num_upi_nodes',
        default: 1,
      },
    ],
    flavor: {
      bootstrap_nodes: {
        num_vcpus: 4,
        num_volumes: 1,
        ram_mb: 16384,
        volumes_gb: 30,
      },
    },
  },
  ceph: {
    parameters: [
      {
        variable: 'num_mgmt_nodes',
        default: 1,
      },
    ],
    flavor: {
      mgmt_nodes: {
        num_vcpus: 2,
        num_volumes: 1,
        ram_mb: 4096,
        volumes_gb: 40,
      },
    },
  },
};
