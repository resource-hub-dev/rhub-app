import { Wizard } from '@patternfly/react-core';
import { AppState } from '@store';
import { loadRequest as loadProducts } from '@ducks/lab/product/actions';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Products from './steps/Products';

interface Props {
  isInfoValid: boolean;
  isErr: boolean;
  isOpen: boolean;
  onFinish: () => void;
  onClose: () => void;
}

const QuickClusterWizard: React.FC<Props> = ({
  isInfoValid,
  isErr,
  isOpen,
  onFinish,
  onClose,
}: Props) => {
  const dispatch = useDispatch();
  const [isFormValid, setIsFormValid] = useState(false);
  const [values, setValues] = useState<Record<string, any>>({});
  const token = useSelector((state: AppState) => state.user.current.token);
  const products = useSelector((state: AppState) => state.labProduct.data);
  const isLoading = useSelector((state: AppState) => state.labProduct.loading);

  useEffect(() => {
    dispatch(loadProducts('all'));
  }, [dispatch, token]);

  const title = 'Create a QuickCluster';
  const steps = [
    {
      name: 'Product',
      enableNext: isFormValid,
      component: (
        <Products
          products={products}
          handleProdSel={(
            valid: boolean,
            value: {
              [key: string]: any;
            }
          ) => {
            setIsFormValid(valid);
            Object.keys(value).forEach((key: string) => {
              const updatedValues = { ...values };
              updatedValues.product = value[key];
              setValues(updatedValues);
            });
          }}
        />
      ),
    },
    {
      name: 'Region',
      component: <p>Step 2 content</p>,
      enableNext: isFormValid,
    },
    { name: 'Cluster Configuration', component: <p>Step 3 content</p> },
    { name: 'Advanced Option', component: <p>Step 4 content</p> },
    {
      name: 'Review',
      component: <p>Review step content</p>,
      nextButtonText: 'Finish',
    },
  ];
  if (isLoading) {
    return <>Loading....</>;
  }
  return (
    <Wizard
      title={title}
      description="Simple Wizard Description"
      steps={steps}
      onClose={onClose}
      isOpen={isOpen}
    />
  );
};

export default QuickClusterWizard;
