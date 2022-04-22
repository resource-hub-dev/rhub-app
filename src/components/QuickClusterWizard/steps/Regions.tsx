import React, {
  ReactNode,
  useEffect,
  useState,
  useContext,
  FormEvent,
} from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Grid,
  Radio,
  Spinner,
  Tooltip,
} from '@patternfly/react-core';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '@store';
import { loadProductRegionsRequest } from '@ducks/lab/region/actions';
import { wizardContext } from '../QuickClusterWizard';
import { StepHeader } from '../helpers';

interface Props {
  /** ID of Selected Region */
  productId: number;
  /** Handler when the user selects a Product */
  addWizardValues: (newValues: Record<string, number>) => void;
}

const Region: React.FC<Props> = ({ productId, addWizardValues }: Props) => {
  const dispatch = useDispatch();
  const [, , values] = useContext(wizardContext);

  const productRegions = useSelector(
    (state: AppState) => state.labRegion.product_regions
  );

  const [selected, setSelected] = useState(0);

  const loading = useSelector((state: AppState) => state.labRegion.loading);
  useEffect(() => {
    if (productId !== 0) dispatch(loadProductRegionsRequest(productId));
  }, [productId, dispatch]);

  if (!productRegions || loading) {
    return (
      <>
        <Spinner /> ...Loading
      </>
    );
  }

  const onSelect = (checked: boolean, e: FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setSelected(Number(value));
    addWizardValues({ region_id: Number(value) });
  };

  // Group RHUB Regions based on their locations
  const regionsByLocation: Record<number | string, ReactNode[]> = {};
  productRegions.forEach((productRegion) => {
    const { region, enabled } = productRegion;
    const { location } = region;
    const prevSelection = values.region_id;
    const selection = selected || prevSelection;
    const regionRadio = (
      <div key={region.id}>
        <Tooltip content={region.description}>
          <Radio
            isChecked={Number(selection) === region.id}
            isDisabled={!enabled}
            name={region.name}
            onChange={onSelect}
            label={region.name}
            id={`radio-controlled-${region.id}`}
            value={region.id}
          />
        </Tooltip>
      </div>
    );
    if (location !== null) {
      if (!regionsByLocation[location.name]) {
        // Initiate if non-exist
        regionsByLocation[location.name] = [regionRadio];
      } else {
        regionsByLocation[location.name] = [
          ...regionsByLocation[location.name],
          regionRadio,
        ];
      }
    }
  });

  const locations = Object.keys(regionsByLocation);
  return (
    <>
      <StepHeader text="Select a Region" />
      <Grid hasGutter md={6} lg={3}>
        {locations.map((location: string) => {
          return (
            <Card key={location}>
              <CardTitle>{location}</CardTitle>
              <CardBody>{regionsByLocation[location]}</CardBody>
            </Card>
          );
        })}
      </Grid>
    </>
  );
};

export default Region;
