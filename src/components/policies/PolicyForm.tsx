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
  useWatch,
} from 'react-hook-form';
import './PolicyForm.css';

interface ConstraintsEnabled {
  schedAvail: boolean;
  servAvail: boolean;
  limit: boolean;
  density: boolean;
  tag: boolean;
  cost: boolean;
  location: boolean;
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
  location: string | null;
  constraintsEnabled: ConstraintsEnabled;
}

interface Props {
  onSubmit: (data: PolicyFormData) => void;
  type: 'create' | 'edit';
  defaultValues?: PolicyFormData;
}

const PolicyForm: React.FC<Props> = ({
  onSubmit,
  type,
  defaultValues,
}: Props) => {
  const {
    register,
    setValue,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues,
  });
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
    setValue('constraintsEnabled.schedAvail', false);
    setValue('constraintsEnabled.servAvail', false);
    setValue('constraintsEnabled.limit', false);
    setValue('constraintsEnabled.density', false);
    setValue('constraintsEnabled.tag', false);
    setValue('constraintsEnabled.cost', false);
    setValue('constraintsEnabled.location', false);
  };

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const currentDate = `${year}-${month < 10 ? '0' : ''}${month}-${
    day < 10 ? '0' : ''
  }${day}`;

  const locationOptions = [
    { value: 'AMS2', label: 'Amsterdam' },
    { value: 'PEK2', label: 'Beijing' },
    { value: 'BNE', label: 'Brisbane' },
    { value: 'BRQ', label: 'Brno' },
    { value: 'FAB', label: 'Farnborough' },
    { value: 'PHX2', label: 'Phoenix' },
    { value: 'PNQ2', label: 'Pune' },
    { value: 'RDU2', label: 'Raleigh' },
    { value: 'GRU2', label: 'São Paulo' },
    { value: 'SIN2', label: 'Singapore' },
    { value: 'TLV', label: 'Tel Aviv' },
    { value: 'NRT', label: 'Tokyo' },
  ];

  const ConstraintsExpandable: React.FC<{ control: Control<PolicyFormData> }> =
    ({ control }) => {
      const watchSchedAvailEnabled = useWatch({
        control,
        name: 'constraintsEnabled.schedAvail',
        defaultValue: false,
      });

      const watchServAvailEnabled = useWatch({
        control,
        name: 'constraintsEnabled.servAvail',
        defaultValue: false,
      });

      const watchLimitEnabled = useWatch({
        control,
        name: 'constraintsEnabled.limit',
        defaultValue: false,
      });

      const watchDensityEnabled = useWatch({
        control,
        name: 'constraintsEnabled.density',
        defaultValue: false,
      });

      const watchTagEnabled = useWatch({
        control,
        name: 'constraintsEnabled.tag',
        defaultValue: false,
      });

      const watchCostEnabled = useWatch({
        control,
        name: 'constraintsEnabled.cost',
        defaultValue: false,
      });

      const watchLocationEnabled = useWatch({
        control,
        name: 'constraintsEnabled.location',
        defaultValue: false,
      });

      return (
        <FormFieldGroupExpandable
          toggleAriaLabel="constraints"
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
          <FormGroup
            label="Scheduled Availability"
            labelInfo={
              <Controller
                name="constraintsEnabled.schedAvail"
                control={control}
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    isChecked={value}
                    onChange={onChange}
                    id="sched-avail-switch"
                    label="Enabled"
                    labelOff="Disabled"
                  />
                )}
              />
            }
            fieldId="sched-avail"
          >
            <Grid hasGutter md={6} sm={12}>
              <GridItem>
                <div>From</div>
                <TextInput
                  {...register('schedAvailFrom', {
                    disabled: !watchSchedAvailEnabled,
                  })}
                  isDisabled={!watchSchedAvailEnabled}
                  type="date"
                  aria-label="sched-avail-from"
                  defaultValue={currentDate}
                  onChange={() => undefined}
                />
              </GridItem>
              <GridItem>
                <div>To</div>
                <TextInput
                  {...register('schedAvailTo', {
                    disabled: !watchSchedAvailEnabled,
                  })}
                  isDisabled={!watchSchedAvailEnabled}
                  type="date"
                  aria-label="sched-avail-to"
                  defaultValue={currentDate}
                  onChange={() => undefined}
                />
              </GridItem>
            </Grid>
          </FormGroup>
          <FormGroup
            label="Service Availability"
            labelInfo={
              <Controller
                name="constraintsEnabled.servAvail"
                control={control}
                defaultValue={false}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    id="serv-avail-switch"
                    label="Enabled"
                    labelOff="Disabled"
                    isChecked={value}
                    onChange={onChange}
                  />
                )}
              />
            }
            fieldId="serv-avail"
            validated={errors.servAvail ? 'error' : 'default'}
            helperTextInvalid={errors.servAvail && errors.servAvail.message}
          >
            <TextInput
              {...register('servAvail', {
                min: { value: 0, message: 'Cannot be negative' },
                valueAsNumber: true,
                disabled: !watchServAvailEnabled,
              })}
              isDisabled={!watchServAvailEnabled}
              type="number"
              defaultValue={0}
              aria-labelledby="serv-avail"
              validated={errors.servAvail ? 'error' : 'default'}
              onChange={() => undefined}
            />
          </FormGroup>
          <FormGroup
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
    <Form id={`${type}-policy-form`} onSubmit={handleSubmit(onSubmit)}>
      <FormGroup
        isRequired
        label="Name"
        fieldId="name"
        validated={errors.name ? 'error' : 'default'}
        helperTextInvalid={errors.name && errors.name.message}
      >
        <TextInput
          {...register('name', { required: 'Name is required' })}
          isRequired
          type="text"
          aria-labelledby="name"
          validated={errors.name ? 'error' : 'default'}
          onChange={() => undefined}
        />
      </FormGroup>
      <FormGroup
        isRequired
        label="Department"
        fieldId="department"
        validated={errors.department ? 'error' : 'default'}
        helperTextInvalid={errors.department && errors.department.message}
      >
        <TextInput
          {...register('department', { required: 'Department is required' })}
          isRequired
          type="text"
          aria-labelledby="department"
          validated={errors.department ? 'error' : 'default'}
          onChange={() => undefined}
        />
      </FormGroup>
      <ConstraintsExpandable control={control} />
    </Form>
  );
};

export default PolicyForm;
