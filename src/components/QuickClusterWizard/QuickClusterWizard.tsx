import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Wizard,
  WizardContextConsumer,
  WizardFooter,
} from '@patternfly/react-core';
import { useHistory } from 'react-router';

import { AppState } from '@store';
import { loadRequest as loadProducts } from '@ducks/lab/product/actions';
import { Quota } from '@ducks/lab/types';

import Products from './steps/Products';
import Region from './steps/Regions';
import { addWizardValues } from './helpers';
import ClusterConfiguration from './steps/ClusterConfiguration';
import AdvancedConfiguration from './steps/AdvancedConfiguration';

type WizardContext = [string[], React.Dispatch<React.SetStateAction<string[]>>];

export const wizardContext = React.createContext<WizardContext>([
  [],
  () => null,
]);

const emptyQuota = {
  num_vcpus: 0,
  ram_mb: 0,
  volumes_gb: 0,
  num_volumes: 0,
};

const QuickClusterWizard: React.FC = () => {
  const dispatch = useDispatch();
  const [wizardErrors, setWizardErrors] = useState<string[]>([]);
  const [isWizardValid, setIsWizardValid] = useState(false);
  const [stepIdReached, setStepIdReached] = useState(1);
  const [totalUsage, setTotalUsage] = useState<Quota>(emptyQuota);

  const token = useSelector((state: AppState) => state.user.current.token);
  const products = useSelector((state: AppState) => state.labProduct.data);
  const isLoading = useSelector((state: AppState) => state.labProduct.loading);

  const history = useHistory();

  useEffect(() => {
    dispatch(loadProducts('all'));
  }, [dispatch, token]);

  useEffect(() => {
    setIsWizardValid(wizardErrors.length === 0);
  }, [wizardErrors]);
  const title = 'Create a QuickCluster';
  const addWizardValuesWrapper = (newValues: { [key: string]: any }) => {
    setIsWizardValid(Object.keys(wizardErrors).length === 0);
    addWizardValues(values, newValues, setValues);
  };

  const onSubmit = (data: any) => {
    addWizardValuesWrapper(data);
  };

  const onClose = () => {
    history.goBack();
  };

  const onFinish = () => {
    // TODO
  };

  const resetValidator = () => setIsWizardValid(false);
  const CustomFooter = (
    <WizardFooter>
      <WizardContextConsumer>
        {({ activeStep, onNext, onBack }) => {
          if (activeStep.id !== 5) {
            return (
              <>
                <Button
                  // variant="primary"
                  type="submit"
                  form={activeStep.id === 3 ? 'form-id' : ''}
                  onClick={() => {
                    setStepIdReached(stepIdReached + 1);
                    resetValidator();
                    if (activeStep.id === 3 || activeStep.id === 4) {
                      const form = document.getElementById(
                        `step-${activeStep.id}-form`
                      );
                      if (form !== null)
                        form.dispatchEvent(new Event('submit'));
                    }
                    return onNext();
                  }}
                  isDisabled={!isWizardValid}
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
              <Button onClick={onFinish} isDisabled={!isWizardValid}>
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
      component: (
        <ClusterConfiguration
          regionId={values.region_id}
          productId={values.product_id}
          onSubmit={onSubmit}
          setTotalUsage={setTotalUsage}
        />
      ),
      canJumpTo: stepIdReached >= 3,
    },
    {
      id: 4,
      name: 'Advanced Option',
      component: (
        <AdvancedConfiguration
          productId={values.product_id}
          onSubmit={onSubmit}
        />
      ),
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
    <wizardContext.Provider value={[wizardErrors, setWizardErrors]}>
      <Wizard
        navAriaLabel={`${title} steps`}
        mainAriaLabel={`${title} content`}
        title={title}
        hideClose
        isOpen
        steps={steps}
        footer={CustomFooter}
      />
    </wizardContext.Provider>
  );
};

export default QuickClusterWizard;
