import {
  Button,
  Wizard,
  WizardContextConsumer,
  WizardFooter,
} from '@patternfly/react-core';
import React, { useState } from 'react';

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
  const [stepIdReached, setStepIdReached] = useState(1);

  const CustomFooter = (
    <WizardFooter>
      <WizardContextConsumer>
        {({ activeStep, onNext, onBack }) => {
          if (activeStep.name !== 'Review') {
            return (
              <>
                <Button
                  variant="primary"
                  // type="submit"
                  onClick={() => {
                    setStepIdReached(2);
                    return onNext();
                  }}
                  isDisabled={!isInfoValid}
                >
                  Next
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
              <Button onClick={onFinish} isDisabled={!isInfoValid || isErr}>
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
  const title = 'Create a QuickCluster';
  const steps = [
    { name: 'Region', component: <p>Step 1 content</p> },
    { name: 'Product', componowent: <p>Step 2 content</p> },
    { name: 'Cluster Configuration', component: <p>Step 3 content</p> },
    { name: 'Advanced Option', component: <p>Step 4 content</p> },
    {
      name: 'Review',
      component: <p>Review step content</p>,
      nextButtonText: 'Finish',
    },
  ];
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
