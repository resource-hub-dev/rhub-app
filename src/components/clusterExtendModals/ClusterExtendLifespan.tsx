import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Form,
  FormGroup,
  TextInput,
  ActionGroup,
  Button,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';

import { AppState } from '@store';

import { updateRequest } from '@ducks/lab/cluster/actions';

interface Props {
  id: number;
  isOpen: boolean;
  prevExpDate: Date | null;
  onClose: () => void;
}

const ClusterExtendLifespan: React.FC<Props> = ({
  id,
  isOpen,
  prevExpDate,
  onClose,
}: Props) => {
  const dispatch = useDispatch();
  const [expDate, setExpDate] = useState(
    prevExpDate !== null
      ? prevExpDate.toISOString().split('T')[0]
      : '9999-12-31'
  );

  const isLoading = useSelector((state: AppState) => state.cluster.loading);

  if (id <= 0) {
    return <></>;
  }
  const today = new Date();
  today.setTime(today.valueOf() + 86400000);
  today.setUTCHours(0, 0, 0, 0);

  const handleExtend = (value: string) => {
    setExpDate(value);
  };

  const submitClick = () => {
    const savePayload = {
      lifespan_expiration:
        expDate !== '9999-12-31' ? new Date(expDate).toISOString() : null,
    };
    dispatch(updateRequest(id, savePayload));
  };

  return (
    <Modal
      title="Lifespan extension"
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form>
        <FormGroup
          label="Enter the new date for the Cluster Lifespan expiration (use 12/31/9999 for no expiration):"
          isRequired
          fieldId="cluster-Lifespan-extension"
          helperText="Please select lifespan expiration date"
        >
          <TextInput
            isRequired
            id="extend-amount"
            name="extend-amount"
            aria-describedby="extend-amount-helper"
            data-testid="extendAmountInput"
            value={expDate}
            isDisabled={isLoading}
            onChange={handleExtend}
            type="date"
          />
        </FormGroup>
        <ActionGroup>
          <Button variant="primary" onClick={submitClick}>
            Save
          </Button>
          <Button variant="link" onClick={onClose}>
            Cancel
          </Button>
        </ActionGroup>
      </Form>
    </Modal>
  );
};

export default ClusterExtendLifespan;
