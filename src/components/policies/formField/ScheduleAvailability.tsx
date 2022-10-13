import { Grid, GridItem, TextInput } from '@patternfly/react-core';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { stringStore } from '../helpers';
import ControlledField from './ControlledField';

interface Props {
  watchSchedAvailEnabled: boolean;
  currentDate: string;
}
const ScheduledAvailability: React.FC<Props> = ({
  watchSchedAvailEnabled,
  currentDate,
}: Props) => {
  const { register } = useFormContext();
  return (
    <ControlledField
      label="Scheduled Availability"
      switchId="sched-avail-switch"
      controllerName="constraintsEnabled.schedAvail"
      fieldId="sched-avail"
      tooltip={stringStore.scheduledAvailability}
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
    </ControlledField>
  );
};

export default ScheduledAvailability;
