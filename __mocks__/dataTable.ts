import { RowPair } from '@components/dataTable/DataTable';

import { ICell } from '@patternfly/react-table';

export const stringColumns: string[] = ['column A', 'column B'];

export const ICellColumns: ICell[] = [
  {
    title: 'column A',
  },
  {},
];

export const singleColumn: string[] = ['column'];

export const stringRowsPairs: RowPair[] = [
  {
    parent: ['r1c1', 'r1c2'],
    child: null,
    isOpen: false,
  },
  {
    parent: ['r2c1', 'r2c2'],
    child: null,
    isOpen: false,
  },
];

export const numberRowsPairs: RowPair[] = [
  {
    parent: [1, 1],
    child: null,
    isOpen: false,
  },
  {
    parent: [2, 2],
    child: null,
    isOpen: false,
  },
];

export const expandableRowsPairs: RowPair[] = [
  {
    parent: ['expandable row'],
    child: ['child cell'],
    isOpen: false,
  },
  {
    parent: ['non expandable row'],
    child: null,
    isOpen: false,
  },
];

export const fullwidthRowsPairs: RowPair[] = [
  {
    parent: ['expandable row'],
    child: ['child cell'],
    isOpen: true,
    fullWidth: true,
  },
];

export const openedRowsPair: RowPair[] = [
  {
    parent: ['expandable row'],
    child: ['child cell'],
    isOpen: true,
  },
  {
    parent: ['non expandable row'],
    child: null,
    isOpen: false,
  },
];

export const paginationRowsPair: RowPair[] = [
  {
    parent: ['first page row'],
    child: null,
    isOpen: false,
  },
  {
    parent: ['first page row'],
    child: null,
    isOpen: false,
  },
  {
    parent: ['first page row'],
    child: null,
    isOpen: false,
  },
  {
    parent: ['first page row'],
    child: null,
    isOpen: false,
  },
  {
    parent: ['first page row'],
    child: null,
    isOpen: false,
  },
  {
    parent: ['first page row'],
    child: null,
    isOpen: false,
  },
  {
    parent: ['first page row'],
    child: null,
    isOpen: false,
  },
  {
    parent: ['first page row'],
    child: null,
    isOpen: false,
  },
  {
    parent: ['first page row'],
    child: null,
    isOpen: false,
  },
  {
    parent: ['first page row'],
    child: null,
    isOpen: false,
  },
  {
    parent: ['second page row'],
    child: null,
    isOpen: false,
  },
];
