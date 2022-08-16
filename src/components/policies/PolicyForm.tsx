import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
  TextInput,
  Grid,
} from '@patternfly/react-core';
import {
  useForm,
  useFieldArray,
  Control,
  FormProvider,
  useWatch,
} from 'react-hook-form';
import './PolicyForm.css';
import { LabLocation } from '@ducks/lab/location/types';
import ScheduledAvailability from './formField/ScheduleAvailability';
import ServiceAvailability from './formField/ServiceAvailability';
import Cost from './formField/Cost';
import Location from './formField/Location';
import Limit from './formField/Limit';
import ControlledField from './formField/ControlledField';
import Tag from './formField/Tag';
import Density from './formField/Density';

interface ConstraintsEnabled {
  schedAvail: boolean;
  servAvail: boolean;
  limit: boolean;
  density: boolean;
  tag: boolean;
  cost: boolean;
  location_id: boolean;
}

export interface PolicyFormData {
  name: string;
  department: string;
  schedAvailFrom: string | null;
  schedAvailTo: string | null;
  servAvail: number | null;
  limit: { key: string; value: string }[] | null;
  density: string | null;
  tag: { value: string }[] | null;
  cost: number | null;
  location: string | number | null;
  constraintsEnabled: ConstraintsEnabled;
}

interface Props {
  onSubmit: (data: PolicyFormData) => void;
  type: 'create' | 'edit';
  defaultValues?: PolicyFormData;
  locations: { [key: string]: LabLocation };
}

const PolicyForm: React.FC<Props> = ({
  onSubmit,
  type,
  defaultValues,
  locations,
}: Props) => {
  const methods = useForm({
    mode: 'onSubmit',
    defaultValues,
  });
  const { control } = methods;
  const {
    fields: limits,
    append: addLimit,
    remove: removeLimit,
  } = useFieldArray({ control, name: 'limit' });
  const {
    fields: tags,
    append: addTag,
    remove: removeTag,
  } = useFieldArray({ control, name: 'tag' });

  const handleLimitAdd = () => {
    addLimit({ key: '', value: '' });
  };

  const handleLimitRemove = (index: number) => {
    removeLimit(index);
  };

  const handleTagAdd = () => {
    addTag({ value: '' });
  };

  const handleTagRemove = (index: number) => {
    removeTag(index);
  };

  const onDisableAllClick = () => {
    methods.setValue('constraintsEnabled.schedAvail', false);
    methods.setValue('constraintsEnabled.servAvail', false);
    methods.setValue('constraintsEnabled.limit', false);
    methods.setValue('constraintsEnabled.density', false);
    methods.setValue('constraintsEnabled.tag', false);
    methods.setValue('constraintsEnabled.cost', false);
    methods.setValue('constraintsEnabled.location_id', false);
  };

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const currentDate = `${year}-${month < 10 ? '0' : ''}${month}-${
    day < 10 ? '0' : ''
  }${day}`;

  const locationOptions = Object.values(locations).map((value: LabLocation) => {
    return {
      value: value.id,
      label: value.description,
    };
  });

  const ConstraintsExpandable: React.FC<{ control: Control<PolicyFormData> }> =
    ({ control }) => {
      const useWatchFieldWrapper = (name: string) => {
        return useWatch({
          control,
          name: name as any,
        });
      };
      const watchSchedAvailEnabled = useWatchFieldWrapper(
        'constraintsEnabled.schedAvail'
      );
      const watchServAvailEnabled = useWatchFieldWrapper(
        'constraintsEnabled.servAvail'
      );
      const watchLimitEnabled = useWatchFieldWrapper(
        'constraintsEnabled.limit'
      );
      const watchDensityEnabled = useWatchFieldWrapper(
        'constraintsEnabled.density'
      );
      const watchTagEnabled = useWatchFieldWrapper('constraintsEnabled.tag');
      const watchCostEnabled = useWatchFieldWrapper('constraintsEnabled.cost');
      const watchLocationEnabled = useWatchFieldWrapper(
        'constraintsEnabled.location_id'
      );

      return (
        <FormFieldGroupExpandable
          toggleAriaLabel="constraints"
          isExpanded
          header={
            <FormFieldGroupHeader
              titleText={{
                text: 'Constraints',
                id: 'constraints',
              }}
              actions={
                <Button
                  variant="secondary"
                  isDisabled={
                    !watchSchedAvailEnabled &&
                    !watchServAvailEnabled &&
                    !watchLimitEnabled &&
                    !watchDensityEnabled &&
                    !watchTagEnabled &&
                    !watchCostEnabled &&
                    !watchLocationEnabled
                  }
                  onClick={onDisableAllClick}
                >
                  Disable All
                </Button>
              }
            />
          }
        >
          <ScheduledAvailability
            watchSchedAvailEnabled={watchSchedAvailEnabled}
            currentDate={currentDate}
          />
          <ServiceAvailability watchServAvailEnabled={watchServAvailEnabled} />
          <ControlledField
            label="Limit"
            controllerName="constraintsEnabled.limit"
            switchId="limit-switch"
            fieldId="limit"
          >
            <Grid hasGutter className="list-grid">
              {limits.map((limit, index) => (
                <Limit
                  watchLimitEnabled={watchLimitEnabled}
                  limit={limit}
                  index={index}
                  handleLimitRemove={handleLimitRemove}
                />
              ))}
            </Grid>
            <Button
              isDisabled={!watchLimitEnabled}
              type="button"
              aria-label="add-limit-button"
              onClick={handleLimitAdd}
            >
              Add
            </Button>
          </ControlledField>
          <Density watchDensityEnabled={watchDensityEnabled} />
          <ControlledField
            label="Tag"
            controllerName="constraintsEnabled.tag"
            switchId="tag-switch"
            fieldId="tag"
          >
            <Grid hasGutter className="list-grid">
              {tags.map((tag, index) => (
                <Tag
                  watchTagEnabled={watchTagEnabled}
                  tag={tag}
                  index={index}
                  handleLimitRemove={handleTagRemove}
                />
              ))}
            </Grid>
            <Button
              isDisabled={!watchTagEnabled}
              type="button"
              aria-label="add-tag-button"
              onClick={handleTagAdd}
            >
              Add
            </Button>
          </ControlledField>
          <Cost watchCostEnabled={watchCostEnabled} />
          <Location
            watchLocationEnabled={watchLocationEnabled}
            locationOptions={locationOptions}
          />
        </FormFieldGroupExpandable>
      );
    };

  return (
    <FormProvider {...methods}>
      <Form
        id={`${type}-policy-form`}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <FormGroup
          isRequired
          label="Name"
          fieldId="name"
          validated={methods.formState.errors.name ? 'error' : 'default'}
          helperTextInvalid={
            methods.formState.errors.name &&
            methods.formState.errors.name.message
          }
        >
          <TextInput
            {...methods.register('name', { required: 'Name is required' })}
            isRequired
            type="text"
            aria-labelledby="name"
            validated={methods.formState.errors.name ? 'error' : 'default'}
            onChange={() => undefined}
          />
        </FormGroup>
        <FormGroup
          isRequired
          label="Department"
          fieldId="department"
          validated={methods.formState.errors.department ? 'error' : 'default'}
          helperTextInvalid={
            methods.formState.errors.department &&
            methods.formState.errors.department.message
          }
        >
          <TextInput
            {...methods.register('department', {
              required: 'Department is required',
            })}
            isRequired
            type="text"
            aria-labelledby="department"
            validated={
              methods.formState.errors.department ? 'error' : 'default'
            }
            onChange={() => undefined}
          />
        </FormGroup>
        <ConstraintsExpandable control={methods.control} />
      </Form>
    </FormProvider>
  );
};

export default PolicyForm;
