import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Alert } from '@patternfly/react-core';

import { AppState } from '@store';

import Questionnaire from './Questionnaire';
import { StepHeader, WizardValues } from '../helpers';
import { wizardContext } from '../QuickClusterWizard';
import '../QuickClusterWizard.css';

interface Props {
  /** Function to handle submit */
  onSubmit: (data: WizardValues) => void;
}

const AdvancedConfiguration: React.FC<Props> = ({ onSubmit }: Props) => {
  const [, , values] = useContext(wizardContext);
  const productId = Number(values?.product_id);
  const product = useSelector(
    (state: AppState) => state.labProduct.data[productId]
  );
  const parameters = product.parameters.filter((param) => param.advanced);

  return (
    <>
      <StepHeader text="Advanced Configuration" />
      <Alert
        className="advanced-step-warning"
        variant="warning"
        title="Warning: Selections for advanced users"
      >
        <p>
          The options displayed here are intended for advanced QuickCluster
          users. Incorrect selections could result in a failed QuickCluster
          deployment. It is recommended to leave the default values unless you
          are an advanced user.
        </p>
      </Alert>
      <Questionnaire parameters={parameters} onSubmit={onSubmit} stepId={4} />
    </>
  );
};

export default AdvancedConfiguration;
