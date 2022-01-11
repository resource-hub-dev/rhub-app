import React, { ReactNode, useEffect, useState, FormEvent } from 'react';
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

interface Props {
  productId: number;
  addWizardValues: (newValues: Record<string, number>) => void;
}

const Region: React.FC<Props> = ({ productId, addWizardValues }: Props) => {
  const dispatch = useDispatch();

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
    const regionRadio = (
      <div>
        <Tooltip content={region.description}>
          <Radio
            isChecked={selected === region.id}
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
      if (!regionsByLocation[location]) {
        // Initiate if non-exist
        regionsByLocation[location] = [regionRadio];
      } else {
        regionsByLocation[location] = [
          ...regionsByLocation[location],
          regionRadio,
        ];
      }
    }
  });

  const locations = Object.keys(regionsByLocation);
  return (
    <Grid hasGutter md={6} lg={3}>
      {locations.map((location: string) => {
        return (
          <Card>
            <CardTitle>{location}</CardTitle>
            <CardBody>{regionsByLocation[location]}</CardBody>
          </Card>
        );
      })}
    </Grid>
  );
};

export default Region;
