import React, { FormEvent, useContext, useMemo, useState } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Grid,
  Radio,
} from '@patternfly/react-core';

import { LabProductData } from '@ducks/lab/product/types';
import { wizardContext } from '../QuickClusterWizard';
import { StepHeader } from '../helpers';
import '../QuickClusterWizard.css';

// Requirements for images in Product selection:
// Under assets/images, you must provide images with the same names as the products
// For example, if a product name is 'abc', the image name must be 'abc.svg';

interface Props {
  /** Products Available for QuickCluster */
  products: { [key: string]: LabProductData };
  /** Handler when the user selects a Product */
  addWizardValues: (newValues: Record<string, number>) => void;
}

const Products: React.FC<Props> = ({ products, addWizardValues }: Props) => {
  const [, , values] = useContext(wizardContext);
  const [selected, setSelected] = useState<number | string>('');
  const productList: LabProductData[] = useMemo(() => {
    return Object.values(products);
  }, [products]);

  const update = (value: string) => {
    setSelected(value);
    addWizardValues({ product_id: Number(value) });
  };

  const onSelect = (checked: boolean, e: FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    update(value);
  };
  return (
    <>
      <StepHeader text="Select a Product" />
      <Grid hasGutter md={6} lg={3}>
        {productList.map((prod) => {
          const filePath = `assets/images/${prod.name
            .replace(/\s/g, '')
            .toLowerCase()}.png`;
          const prevSelection = values.product_id;
          if (prod.enabled) {
            const selection = selected || prevSelection;
            return (
              <Card
                id={String(prod.id)}
                className={`center select-card ${
                  Number(selection) === prod.id ? ' selected-card' : ''
                }`}
                onClick={(e) => {
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  update(e.currentTarget.getAttribute('id')!);
                }}
                value={prod.id}
                key={`product-${prod.id}`}
              >
                <CardTitle>
                  <img
                    src={filePath}
                    alt={prod.name}
                    className="prod-img"
                    onError={(e) => {
                      e.currentTarget.src = `assets/images/default.png`;
                    }}
                  />
                  <div>{prod.name}</div>
                </CardTitle>
                <CardBody>{prod.description}</CardBody>
                <CardFooter>
                  <Radio
                    aria-label={`${prod.id}`}
                    isChecked={Number(selection) === prod.id}
                    name={prod.name}
                    onChange={onSelect}
                    id="radio-controlled"
                    value={prod.id}
                  />
                </CardFooter>
              </Card>
            );
          }
          return null;
        })}
      </Grid>
    </>
  );
};

export default Products;
