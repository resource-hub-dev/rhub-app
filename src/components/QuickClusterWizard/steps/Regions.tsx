import React, { useEffect, useState, useContext } from 'react';
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
import PageError from '@components/pageError/pageError';

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
  const error = useSelector((state: AppState) => state.labRegion.error);

  const loading = useSelector((state: AppState) => state.labRegion.loading);
  useEffect(() => {
    if (productId !== 0) dispatch(loadProductRegionsRequest(productId));
  }, [productId, dispatch]);

  if (error) {
    return <PageError />;
  }
  if (!productRegions || !productRegions.length) {
    return (
      <>
        <PageError msg="No region is available for the selected product." />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Spinner /> ...Loading
      </>
    );
  }

  const onSelect = (value: string) => {
    setSelected(Number(value));
    addWizardValues({ region_id: Number(value) });
  };
  return (
    <>
      <StepHeader text="Select a Region" />
      <Grid hasGutter md={6} lg={3}>
        {productRegions.map((productRegion) => {
          const { region, enabled } = productRegion;
          const locationName =
            region.location !== null ? region.location.name : '';
          const prevSelection = values.region_id;
          const selection = selected || prevSelection;
          return (
            <Card
              id={String(region.id)}
              key={locationName}
              className={`center${enabled ? ' select-card' : ''}${
                Number(selection) === region.id && enabled
                  ? ' selected-card'
                  : ''
              }`}
              onClick={(e) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                if (enabled) onSelect(e.currentTarget.getAttribute('id')!);
              }}
            >
              <CardTitle>{locationName}</CardTitle>
              <CardBody>
                <div key={region.id}>
                  <Tooltip content={region.description}>
                    <Radio
                      isChecked={Number(selection) === region.id}
                      isDisabled={!enabled}
                      name={region.name}
                      label={region.name}
                      id={`radio-controlled-${region.id}`}
                      value={region.id}
                    />
                  </Tooltip>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </Grid>
    </>
  );
};

export default Region;
