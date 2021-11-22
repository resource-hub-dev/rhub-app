/* eslint-disable @typescript-eslint/no-var-requires */
import { LabProductData } from '@ducks/lab/product/types';
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Grid,
  Radio,
} from '@patternfly/react-core';
import React, { FormEvent, useState } from 'react';

// Requirements for images in Product selection:
// Under assets/images, you must provide images with the same names as the products
// For example, if a product name is 'abc', the image name must be 'abc.svg';

interface Props {
  products: { [key: string]: LabProductData };
  handleProdSel: (valid: boolean, value: { [key: string]: any }) => void;
}

const Products: React.FC<Props> = ({ products, handleProdSel }: Props) => {
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
    handleProdSel(checked, { product_id: value });
  };

  return (
    <Grid hasGutter md={6} lg={3}>
      {productList.map((prod) => {
        const filePath = genImgSrc(prod.name);
        if (prod.enabled) {
          return (
            <Card>
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
                  isChecked={Number(selected) === prod.id}
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
  );
};

export default Products;
