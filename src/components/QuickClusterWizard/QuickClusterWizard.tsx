import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Wizard,
  WizardContextConsumer,
  WizardFooter,
} from '@patternfly/react-core';

import { AppState } from '@store';
import { loadRequest as loadProducts } from '@ducks/lab/product/actions';

import Products from './steps/Products';
import Region from './steps/Regions';
import { addWizardValues } from './helpers';

interface Props {
  isErr: boolean;
  isOpen: boolean;
  onFinish: () => void;
  onClose: () => void;
}

const QuickClusterWizard: React.FC<Props> = ({
  isErr,
  isOpen,
  onFinish,
  onClose,
}: Props) => {
  const dispatch = useDispatch();
  const [isFormValid, setIsFormValid] = useState(false);
  const [stepIdReached, setStepIdReached] = useState(1);
  const [values, setValues] = useState<Record<string, any>>({});

  const token = useSelector((state: AppState) => state.user.current.token);
  const products = useSelector((state: AppState) => state.labProduct.data);
  const isLoading = useSelector((state: AppState) => state.labProduct.loading);

  useEffect(() => {
    dispatch(loadProducts('all'));
  }, [dispatch, token]);

  const title = 'Create a QuickCluster';
  const addWizardValuesWrapper = (newValues: { [key: string]: any }) => {
    setIsFormValid(true);
    addWizardValues(values, newValues, setValues);
  };

  const resetValidator = () => setIsFormValid(false);

  const CustomFooter = (
    <WizardFooter>
      <WizardContextConsumer>
        {({ activeStep, onNext, onBack }) => {
          if (activeStep.id !== 5) {
            return (
              <>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={() => {
                    setStepIdReached(stepIdReached + 1);
                    resetValidator();
                    return onNext();
                  }}
                  isDisabled={!isFormValid}
                >
                  Next
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setStepIdReached(stepIdReached - 1);
                    resetValidator();
                    return onBack();
                  }}
                  isDisabled={activeStep.name === 'Product'}
                >
                  Back
                </Button>
                <Button variant="link" onClick={onClose}>
                  Cancel
                </Button>
              </>
            );
          }
          // Final step buttons
          return (
            <>
              <Button onClick={onFinish} isDisabled={!isFormValid || isErr}>
                Finish
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setStepIdReached(stepIdReached - 1);
                  return onBack();
                }}
              >
                Back
              </Button>
              <Button variant="link" onClick={onClose}>
                Cancel
              </Button>
            </>
          );
        }}
      </WizardContextConsumer>
    </WizardFooter>
  );

  const steps = [
    {
      name: 'Product',
      id: 1,
      component: (
        <Products
          products={products}
          addWizardValues={addWizardValuesWrapper}
        />
      ),
    },
    {
      name: 'Region',
      id: 2,
      component: (
        <Region
          productId={values.product_id ? values.product_id : 0}
          addWizardValues={addWizardValuesWrapper}
        />
      ),
      canJumpTo: stepIdReached >= 2,
    },
    {
      id: 3,
      name: 'Cluster Configuration',
      component: <p>Step 3 content</p>,
      canJumpTo: stepIdReached >= 3,
    },
    {
      id: 4,
      name: 'Advanced Option',
      component: <p>Step 4 content</p>,
      canJumpTo: stepIdReached >= 4,
    },
    {
      id: 5,
      name: 'Review',
      component: <p>Review step content</p>,
      nextButtonText: 'Finish',
      canJumpTo: stepIdReached >= 5,
    },
  ];
  if (isLoading) {
    return <>Loading....</>;
  }
  return (
    <Wizard
      title={title}
      footer={CustomFooter}
      description="Simple Wizard Description"
      steps={steps}
      onClose={onClose}
      isOpen={isOpen}
    />
  );
};

export default QuickClusterWizard;
