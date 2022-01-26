import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@store';

import Questionnaire from './Questionnaire';
import { WizardValues } from '../helpers';

interface Props {
  /** ID of Selected Product in the Wizard */
  productId: number;
  /** Function to handle submit */
  onSubmit: (data: WizardValues) => void;
}

const AdvancedConfiguration: React.FC<Props> = ({
  productId,
  onSubmit,
}: Props) => {
  const product = useSelector(
    (state: AppState) => state.labProduct.data[productId]
  );
  const parameters = product.parameters.filter((param) => param.advanced);

  return (
    <>
      <Questionnaire
        productId={productId}
        parameters={parameters}
        onSubmit={onSubmit}
        stepId={4}
      />
    </>
  );
};

export default AdvancedConfiguration;
