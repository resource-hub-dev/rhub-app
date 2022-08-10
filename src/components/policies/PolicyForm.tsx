import React, { Fragment } from 'react';
import {
  Button,
  Form,
  FormGroup,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
  Switch,
  TextInput,
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import {
  useForm,
  Controller,
  useFieldArray,
  Control,
  FormProvider,
  useWatch,
} from 'react-hook-form';
import './PolicyForm.css';
import { LabLocation } from '@ducks/lab/location/types';
import ScheduledAvailability from './formField/ScheduleAvailability';
import ServiceAvailability from './formField/ServiceAvailability';

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
            label="Limit"
            labelInfo={
              <Controller
                name="constraintsEnabled.limit"
                control={control}
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    id="limit-switch"
                    label="Enabled"
                    labelOff="Disabled"
                    isChecked={value}
                    onChange={onChange}
                  />
                )}
              />
            }
            fieldId="limit"
          >
            <Grid hasGutter className="list-grid">
              {limits.map((limit, index) => (
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
                      placeholder="Key"
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
          </FormGroup>
          <FormGroup
            label="Density"
            labelInfo={
              <Controller
                name="constraintsEnabled.density"
                control={control}
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    id="density-switch"
                    label="Enabled"
                    labelOff="Disabled"
                    isChecked={value}
                    onChange={onChange}
                  />
                )}
              />
            }
            fieldId="density"
          >
            <TextInput
              {...register('density', { disabled: !watchDensityEnabled })}
              isDisabled={!watchDensityEnabled}
              type="text"
              aria-labelledby="density"
              onChange={() => undefined}
            />
          </FormGroup>
          <FormGroup
            label="Tag"
            labelInfo={
              <Controller
                name="constraintsEnabled.tag"
                control={control}
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    id="tag-switch"
                    label="Enabled"
                    labelOff="Disabled"
                    isChecked={value}
                    onChange={onChange}
                  />
                )}
              />
            }
            fieldId="tag"
          >
            <Grid hasGutter className="list-grid">
              {tags.map((tag, index) => (
                <Fragment key={tag.id}>
                  <GridItem span={10}>
                    <TextInput
                      {...register(`tag.${index}.value` as const, {
                        disabled: !watchTagEnabled,
                      })}
                      isDisabled={!watchTagEnabled}
                      type="text"
                      aria-label={`tag-${index}`}
                      onChange={() => undefined}
                    />
                  </GridItem>
                  <GridItem span={2}>
                    <Button
                      isDisabled={!watchTagEnabled}
                      type="button"
                      aria-label={`tag-${index}-remove-btn`}
                      variant="danger"
                      onClick={() => handleTagRemove(index)}
                    >
                      Remove
                    </Button>
                  </GridItem>
                </Fragment>
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
          </FormGroup>
          <FormGroup
            label="Cost"
            labelInfo={
              <Controller
                name="constraintsEnabled.cost"
                control={control}
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    id="cost-switch"
                    label="Enabled"
                    labelOff="Disabled"
                    isChecked={value}
                    onChange={onChange}
                  />
                )}
              />
            }
            fieldId="cost"
            validated={errors.cost ? 'error' : 'default'}
            helperTextInvalid={errors.cost && errors.cost.message}
          >
            <TextInput
              {...register('cost', {
                min: { value: 0, message: 'Cannot be negative' },
                valueAsNumber: true,
                disabled: !watchCostEnabled,
              })}
              isDisabled={!watchCostEnabled}
              type="number"
              defaultValue={0}
              aria-labelledby="cost"
              validated={errors.cost ? 'error' : 'default'}
              onChange={() => undefined}
            />
          </FormGroup>
          <FormGroup
            label="Location"
            labelInfo={
              <Controller
                name="constraintsEnabled.location"
                control={control}
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    id="location-switch"
                    label="Enabled"
                    labelOff="Disabled"
                    isChecked={value}
                    onChange={onChange}
                  />
                )}
              />
            }
            fieldId="location"
          >
            <Controller
              name="location"
              control={control}
              defaultValue="AMS2"
              render={({ field }) => (
                <FormSelect
                  {...field}
                  isDisabled={!watchLocationEnabled}
                  id="location-select"
                >
                  {locationOptions.map((option) => (
                    <FormSelectOption
                      key={`location-${option.value}`}
                      value={option.value}
                      label={option.label}
                      isDisabled={!watchLocationEnabled}
                    />
                  ))}
                </FormSelect>
              )}
            />
          </FormGroup>
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
