import React, { ReactElement, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useForm, Controller } from 'react-hook-form';
import {
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
  Tooltip,
} from '@patternfly/react-core';
import { AppState } from '@store';
import { LabProductParams } from '@ducks/lab/product/types';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { Quota } from '@ducks/lab/types';
import { loadRequest as checkNameExists } from '@ducks/lab/cluster/actions';

import {
  addWizardErrors,
  genDefaultValues,
  genGraphValues,
  removeWizardErrors,
  WizardValues,
  rsvpOpts,
} from '../helpers';
import { wizardContext } from '../QuickClusterWizard';

interface Props {
  /** Handles dynamic values for Utilization Charts in Step 3 */
  updateUsage?: (requiredResources: Quota) => void;
  /** Parameters from Product Region */
  parameters: LabProductParams[];
  /** Handles data once user hits submit */
  onSubmit: (data: WizardValues) => void;
  /** Determines which step the user is on */
  stepId: number;
}

const Questionnaire: React.FC<Props> = ({
  updateUsage,
  parameters,
  onSubmit,
  stepId,
}: Props) => {
  const dispatch = useDispatch();
  const [wizardErrors, setWizardErrors, values] = useContext(wizardContext);
  const productId = Number(values?.product_id);
  const regionId = Number(values.region_id);
  // Step 3 includes parameters that are not in advanced step
  const product = useSelector(
    (state: AppState) => state.labProduct.data[productId]
  );
  const clusterExists = useSelector(
    (state: AppState) => state.cluster.clusterExists
  );

  const region = useSelector(
    (state: AppState) =>
      state.labRegion.product_regions.find(
        (value) => value.region.id === regionId
      )?.region
  );

  const defaultValues = genDefaultValues(parameters, values);

  const components: ReactElement[] = [];
  const {
    handleSubmit,
    control,
    register,
    setValue,
    setError,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    if (!isValid) {
      addWizardErrors(wizardErrors, setWizardErrors, `step-${stepId}-valid`);
    } else {
      removeWizardErrors(wizardErrors, setWizardErrors, `step-${stepId}-valid`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, isDirty, stepId, setWizardErrors]);

  useEffect(() => {
    if (clusterExists !== undefined) {
      if (clusterExists === true) {
        const message =
          'A cluster with this name exists. Please choose another';
        setError('name', {
          type: 'value',
          message,
        });
        addWizardErrors(wizardErrors, setWizardErrors, `step-${stepId}-name`);
      } else
        removeWizardErrors(
          wizardErrors,
          setWizardErrors,
          `step-${stepId}-name`
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusterExists, isValid, setError, setWizardErrors]);

  if (parameters) {
    for (const question of parameters) {
      const key = question.variable;
      if (question.type === 'string' && !question.enum) {
        const minLength = question.minLength || 0;
        const maxLength = question.maxLength || 20;
        components.push(
          <Tooltip key={key} content={<div>{question.description}</div>}>
            <FormGroup
              label={question.name}
              fieldId={key}
              helperTextInvalid={errors[key] && errors[key].message}
              isRequired={question.required}
              helperTextInvalidIcon={<ExclamationCircleIcon />}
              validated={errors[key] ? 'error' : 'default'}
            >
              <TextInput
                {...register(key, {
                  minLength: {
                    value: minLength,
                    message: `Minimum ${question.minLength} characters required`,
                  },
                  required: question.required && `${question.name} is required`,
                  maxLength: {
                    value: maxLength,
                    message: `Maximum ${question.maxLength} characters allowed`,
                  },
                })}
                name={key}
                onBlur={(e) => {
                  const { value } = e.target;
                  if (
                    value.length >= minLength &&
                    value.length <= maxLength &&
                    key === 'name'
                  ) {
                    dispatch(
                      checkNameExists('all', { 'filter[name]': value }, true)
                    );
                  }
                  setValue(key, value, { shouldValidate: true });
                }}
                key={`${key}-input`}
                validated={errors[key] ? 'error' : 'default'}
                isRequired={question.required}
                aria-label={key}
                onChange={() => undefined}
              />
            </FormGroup>
          </Tooltip>
        );
      }
      // For Integer field
      if (question.type === 'integer' && !question.enum) {
        const isNodesNum =
          key.indexOf('_nodes') !== -1 && key.indexOf('num') !== -1;
        components.push(
          <Tooltip key={key} content={<div>{question.description}</div>}>
            <FormGroup
              label={question.name}
              fieldId={key}
              helperTextInvalid={errors[key] && errors[key].message}
              isRequired={question.required}
              helperTextInvalidIcon={<ExclamationCircleIcon />}
              validated={errors[key] ? 'error' : 'default'}
            >
              <TextInput
                {...register(key, {
                  min: question.min && {
                    value: question.min,
                    message: `Minimum ${question.min} required`,
                  },
                  max: question.max && {
                    value: question.max,
                    message: `Maximum ${question.max} allowed`,
                  },
                  required: question.required && `${question.name} is required`,
                })}
                name={key}
                key={`${key}-input`}
                validated={errors[key] ? 'error' : 'default'}
                isRequired={question.required}
                aria-label={key}
                type="number"
                onBlur={(event) => {
                  if (isNodesNum && updateUsage) {
                    // fire graph update if it's a node number variable (e.g. Master node, Infra node)
                    const usage = genGraphValues(
                      key,
                      Number(event.target.value),
                      product.flavors
                    );
                    updateUsage(usage);
                  }
                  setValue(key, event.target.value, { shouldValidate: true });
                }}
                onChange={() => undefined} // place holder function (required by PF)
              />
            </FormGroup>
          </Tooltip>
        );
      }
      // Convert params with enum (list) and boolean multiple choice select
      if (question.enum || question.type === 'boolean') {
        components.push(
          <Tooltip key={key} content={<div>{question.description}</div>}>
            <FormGroup label={question.name} fieldId={`${key}-form`}>
              <Controller
                name={key}
                control={control}
                render={({ field }) => (
                  <FormSelect
                    {...field}
                    isRequired={question.required}
                    aria-label={key}
                  >
                    {/* if an enum array exists */}
                    {question.enum &&
                      question.enum.map((value) => (
                        <FormSelectOption
                          key={value}
                          value={value}
                          label={value}
                        />
                      ))}
                    {/* if boolean, convert to yes/no options */}
                    {question.type === 'boolean' && [
                      <FormSelectOption key="Yes" value label="Yes" />,
                      <FormSelectOption key="No" value={false} label="No" />,
                    ]}
                  </FormSelect>
                )}
              />
            </FormGroup>
          </Tooltip>
        );
      }
    }
    return (
      <Form id={`step-${stepId}-form`} onSubmit={handleSubmit(onSubmit)}>
        {components}
        {stepId === 3 && region && region.reservations_enabled && (
          <FormGroup
            label="Days of Reservation"
            isRequired
            fieldId="rsvp-field"
          >
            <Controller
              control={control}
              name="rsvp"
              rules={{ required: true }}
              render={({ field }) => (
                <FormSelect {...field} isRequired aria-label="rsvp">
                  {rsvpOpts().map((option) => (
                    <FormSelectOption
                      key={option.value}
                      isDisabled={option.disabled}
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </FormSelect>
              )}
            />
          </FormGroup>
        )}
      </Form>
    );
  }
  return <p>Loading</p>;
};

export default Questionnaire;
