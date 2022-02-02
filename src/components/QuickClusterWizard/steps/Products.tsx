/* eslint-disable @typescript-eslint/no-var-requires */
import React, { FormEvent, useContext, useState } from 'react';
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
  let productList: LabProductData[] = [];
  if (Object.keys(products).length > 0) {
    productList = Object.values(products);
  }

  // Functions to check image file exists for products and return appropriate path
  const doesFileExist = (path: string) => {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', path, false);
    xhr.send();
    if (xhr.status === 404) {
      return false;
    } else {
      return true;
    }
  };

  const genImgSrc = (prodName: string) => {
    const svgExists = doesFileExist(`assets/images/${prodName}.svg`);
    const pngExists = doesFileExist(`assets/images/${prodName}.png`);
    const fileExists = svgExists || pngExists;
    if (fileExists) {
      if (svgExists) {
        return `assets/images/${prodName}.svg`;
      } else {
        return `assets/images/${prodName}.png`;
      }
    }
    return '';
  };

  const onSelect = (checked: boolean, e: FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setSelected(value);
    addWizardValues({ product_id: Number(value) });
  };

  return (
    <>
      <StepHeader text="Select a Product" />
      <Grid hasGutter md={6} lg={3}>
        {productList.map((prod) => {
          const filePath = genImgSrc(prod.name);
          const prevSelection = values.product_id;
          if (prod.enabled) {
            const selection = selected || prevSelection;
            return (
              <Card key={prod.id}>
                <CardTitle>
                  {filePath !== '' ? (
                    <img src={filePath} alt={prod.name} height="50px" />
                  ) : (
                    prod.name
                  )}
                </CardTitle>
                <CardBody>{prod.description}</CardBody>
                <CardFooter>
                  <Radio
                    isChecked={Number(selection) === prod.id}
                    name={prod.name}
                    onChange={onSelect}
                    label="Select"
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
