import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@store';

import Questionnaire from './Questionnaire';
import { WizardValues } from '../helpers';
import { wizardContext } from '../QuickClusterWizard';

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
      <Questionnaire parameters={parameters} onSubmit={onSubmit} stepId={4} />
    </>
  );
};

export default AdvancedConfiguration;
