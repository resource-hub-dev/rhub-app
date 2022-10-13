import { Button, GridItem, TextInput } from '@patternfly/react-core';
import React, { Fragment } from 'react';
import { FieldArrayWithId, useFormContext } from 'react-hook-form';
import { PolicyFormData } from '../PolicyForm';

interface Props {
  watchLimitEnabled: boolean;
  limit: FieldArrayWithId<PolicyFormData, 'limit', 'id'>;
  index: number;
  handleLimitRemove: (index: number) => void;
}
const Limit: React.FC<Props> = ({
  watchLimitEnabled,
  limit,
  index,
  handleLimitRemove,
}: Props) => {
  const { register } = useFormContext();
  return (
    <Fragment key={limit.id}>
      <GridItem span={5}>
        <TextInput
          {...register(`limit.${index}.key` as const, {
            disabled: !watchLimitEnabled,
          })}
          isDisabled={!watchLimitEnabled}
          type="text"
          aria-label={`limit-${index}`}
          onChange={() => undefined}
          placeholder="Resource (e.g. CPU, RAM, Storage)"
        />
      </GridItem>
      <GridItem span={5}>
        <TextInput
          {...register(`limit.${index}.value` as const, {
            disabled: !watchLimitEnabled,
          })}
          isDisabled={!watchLimitEnabled}
          type="text"
          aria-label={`limit-${index}`}
          onChange={() => undefined}
          placeholder="Value"
        />
      </GridItem>
      <GridItem span={2}>
        <Button
          isDisabled={!watchLimitEnabled}
          type="button"
          aria-label={`limit-${index}-remove-btn`}
          variant="danger"
          onClick={() => handleLimitRemove(index)}
        >
          Remove
        </Button>
      </GridItem>
    </Fragment>
  );
};

export default Limit;
