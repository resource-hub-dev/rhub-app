import { Button, GridItem, TextInput } from '@patternfly/react-core';
import React, { Fragment } from 'react';
import { FieldArrayWithId, useFormContext } from 'react-hook-form';
import { PolicyFormData } from '../PolicyForm';

interface Props {
  watchTagEnabled: boolean;
  tag: FieldArrayWithId<PolicyFormData, 'tag', 'id'>;
  index: number;
  handleLimitRemove: (index: number) => void;
}
const Tag: React.FC<Props> = ({
  watchTagEnabled,
  tag,
  index,
  handleLimitRemove,
}: Props) => {
  const { register } = useFormContext();
  return (
    <Fragment key={tag.id}>
      <GridItem span={5}>
        <TextInput
          {...register(`tag.${index}.key` as const, {
            disabled: !watchTagEnabled,
          })}
          isDisabled={!watchTagEnabled}
          type="text"
          aria-label={`tag-${index}`}
          onChange={() => undefined}
          placeholder="Specification type (e.g. O.S, Hardware model)"
        />
      </GridItem>
      <GridItem span={5}>
        <TextInput
          {...register(`tag.${index}.value` as const, {
            disabled: !watchTagEnabled,
          })}
          isDisabled={!watchTagEnabled}
          type="text"
          aria-label={`tag-${index}`}
          onChange={() => undefined}
          placeholder="Value"
        />
      </GridItem>
      <GridItem span={2}>
        <Button
          isDisabled={!watchTagEnabled}
          type="button"
          aria-label={`tag-${index}-remove-btn`}
          variant="danger"
          onClick={() => handleLimitRemove(index)}
        >
          Remove
        </Button>
      </GridItem>
    </Fragment>
  );
};

export default Tag;
