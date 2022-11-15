/* eslint-disable react/jsx-props-no-spreading */

import React, { useState } from 'react';
import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ExpandableRowContent,
  IRow,
  ICell,
} from '@patternfly/react-table';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Pagination,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

export interface RowPair {
  // interface for rows: parent-child pairs
  // example row:
  // {
  //   parent: ['parent 1', 'two', 'k', 'four', 'five'],
  //   child: ['single cell'],
  // },
  parent: IRow;
  child: IRow | null;
  isOpen?: boolean;
  fullWidth?: boolean;
  noPadding?: boolean;
}

interface Props {
  columns: (string | ICell)[];
  rowPairs: RowPair[];
  loading?: boolean;
}

const DataTable: React.FC<Props> = ({ columns, rowPairs, loading }: Props) => {
  const [tableRows, setTableRows] = useState(rowPairs.slice(0, 10));
  // index of the currently active column
  const [sortBy, setSortBy] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // Init all to false unless isOpen is specify
  const [expanded, setExpanded] = useState(
    Object.fromEntries(
      Object.entries(rowPairs).map(([k, v]) => {
        return [k, Boolean(v.child) && !!v.isOpen];
      })
    )
  );
  if (loading) {
    return (
      <EmptyState>
        <EmptyStateIcon variant="container" component={Spinner} />
        <Title size="lg" headingLevel="h4">
          Loading
        </Title>
      </EmptyState>
    );
  }
  if (!rowPairs.length) {
    return (
      <EmptyState>
        <EmptyStateIcon icon={SearchIcon} />
        <Title size="lg" headingLevel="h4">
          Nothing to show
        </Title>
        <EmptyStateBody>No results match the provided query.</EmptyStateBody>
      </EmptyState>
    );
  }
  const onSort = (
    _event: unknown,
    index: number,
    direction: 'desc' | 'asc' | undefined
  ) => {
    // sorts the rows
    const updatedRows = rowPairs.sort((a, b) => {
      if (typeof a.parent[index] === 'number') {
        // numeric sort
        if (direction === 'asc') {
          return a.parent[index] - b.parent[index];
        }
        return b.parent[index] - a.parent[index];
        // eslint-disable-next-line  no-else-return
      } else {
        // string sort
        const isLink = a.parent[index].type?.displayName === 'Link';
        if (direction === 'asc') {
          return isLink
            ? a.parent[index].props.children.localeCompare(
                b.parent[index].props.children
              )
            : a.parent[index].localeCompare(b.parent[index]);
        }
        return isLink
          ? b.parent[index].props.children.localeCompare(
              a.parent[index].props.children
            )
          : b.parent[index].localeCompare(a.parent[index]);
      }
    });
    setTableRows(updatedRows.slice(0, perPage));
    setSortBy({ index, direction });
    setCurrentPage(1);
  };

  const onSetCurrentPage = (
    _event: unknown,
    pageNumber: number,
    _perPage: unknown,
    startIdx?: number,
    endIdx?: number
  ) => {
    setCurrentPage(pageNumber);
    setTableRows(rowPairs.slice(startIdx, endIdx));
  };

  const onSetPerPage = (
    _event: unknown,
    itemsPerPage: number,
    _pageNumber: unknown,
    startIdx?: number,
    endIdx?: number
  ) => {
    setPerPage(itemsPerPage);
    setTableRows(rowPairs.slice(startIdx, endIdx));
  };

  const handleExpansionToggle = (_event: unknown, pairIndex: number) => {
    setExpanded({
      ...expanded,
      [pairIndex]: !expanded[pairIndex],
    });
  };
  let rowIndex = -1;
  let colIndex = -1;
  const numColumns = columns.length;

  const randomKey = () => Math.random().toString(36).slice(-8);
  return (
    <>
      <TableComposable aria-label="Expandable Table" variant="compact">
        <Thead>
          <Tr>
            <Th key="col-expandable" />
            {columns.map((col) => {
              colIndex += 1;
              const sortParams = {
                sort: {
                  sortBy,
                  onSort,
                  columnIndex: colIndex,
                },
              };
              return (
                <Th key={`col-${colIndex}`} {...sortParams}>
                  {typeof col === 'string' ? col : col.title || ''}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        {tableRows.map((pair, pairIndex) => {
          rowIndex += 1;
          const parentRow = (
            <Tr key={rowIndex}>
              <Td
                key={`${rowIndex}_0`}
                expand={
                  pair.child
                    ? {
                        rowIndex: pairIndex,
                        isExpanded: expanded[pairIndex],
                        onToggle: handleExpansionToggle,
                      }
                    : undefined
                }
              />
              {pair.parent.map((cell: IRow, cellIndex: number) => (
                <Td
                  key={`${rowIndex}_${cell}_${randomKey()}`}
                  dataLabel={columns[cellIndex].toString()}
                >
                  {cell}
                </Td>
              ))}
            </Tr>
          );
          if (pair.child) {
            rowIndex += 1;
          }
          const childRow = pair.child ? (
            <Tr key={rowIndex} isExpanded={expanded[pairIndex] === true}>
              {!tableRows[pairIndex].fullWidth && <Td key={`${rowIndex}_0`} />}
              {tableRows[pairIndex].child?.map(
                (cell: any, cellIndex: number) => {
                  const shift = tableRows[pairIndex].fullWidth ? 1 : 0;
                  const shiftedCellIndex = cell.toString() + shift;
                  return (
                    <Td
                      key={`${rowIndex}_${shiftedCellIndex}`}
                      dataLabel={columns[cellIndex].toString()}
                      noPadding={tableRows[pairIndex].noPadding}
                      colSpan={numColumns + shift}
                    >
                      <ExpandableRowContent>
                        {(cell as IRow).title || cell}
                      </ExpandableRowContent>
                    </Td>
                  );
                }
              )}
            </Tr>
          ) : null;
          return (
            <Tbody
              key={`${pair.parent.toString()}_${randomKey()}`}
              isExpanded={expanded[pairIndex] === true}
            >
              {parentRow}
              {childRow}
            </Tbody>
          );
        })}
      </TableComposable>
      <Pagination
        itemCount={rowPairs.length}
        perPage={perPage}
        page={currentPage}
        onSetPage={onSetCurrentPage}
        widgetId="pagination-options-menu-top"
        onPerPageSelect={onSetPerPage}
        isCompact
      />
    </>
  );
};

export default DataTable;
