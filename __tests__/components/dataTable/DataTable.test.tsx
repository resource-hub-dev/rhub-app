import React from 'react';

import DataTable from '@components/dataTable/DataTable';

import { connectedRender, fireEvent } from '@tests/testUtils';

import * as mocks from '@mocks/dataTable';

describe('<DataTable />', () => {
  test('Renders loading', async () => {
    const { result } = connectedRender(
      <DataTable columns={[]} rowPairs={[]} loading />
    );

    expect(result.queryByText(/Loading/)).toBeInTheDocument();
  });

  test('Renders empty table', async () => {
    const { result } = connectedRender(
      <DataTable columns={[]} rowPairs={[]} />
    );

    expect(result.queryByText(/Nothing to show/)).toBeInTheDocument();
    expect(
      result.queryByText(/No results match the provided query\./)
    ).toBeInTheDocument();
  });

  test('Renders table with string columns', async () => {
    const { result } = connectedRender(
      <DataTable
        columns={mocks.stringColumns}
        rowPairs={mocks.stringRowsPairs}
      />
    );

    expect(result.queryByText(`${mocks.stringColumns[0]}`)).toBeInTheDocument();
    expect(result.queryByText(`${mocks.stringColumns[1]}`)).toBeInTheDocument();

    expect(
      result.queryByText(`${mocks.stringRowsPairs[0].parent[0]}`)
    ).toBeInTheDocument();
    expect(
      result.queryByText(`${mocks.stringRowsPairs[0].parent[1]}`)
    ).toBeInTheDocument();

    expect(
      result.queryByText(`${mocks.stringRowsPairs[1].parent[0]}`)
    ).toBeInTheDocument();
    expect(
      result.queryByText(`${mocks.stringRowsPairs[1].parent[1]}`)
    ).toBeInTheDocument();
  });

  test('Renders table with ICell columns', async () => {
    const { result } = connectedRender(
      <DataTable
        columns={mocks.ICellColumns}
        rowPairs={mocks.stringRowsPairs}
      />
    );

    expect(
      result.queryByText(`${mocks.ICellColumns[0].title}`)
    ).toBeInTheDocument();

    expect(
      result.queryByText(`${mocks.stringRowsPairs[0].parent[0]}`)
    ).toBeInTheDocument();
    expect(
      result.queryByText(`${mocks.stringRowsPairs[0].parent[1]}`)
    ).toBeInTheDocument();

    expect(
      result.queryByText(`${mocks.stringRowsPairs[1].parent[0]}`)
    ).toBeInTheDocument();
    expect(
      result.queryByText(`${mocks.stringRowsPairs[1].parent[1]}`)
    ).toBeInTheDocument();
  });

  test('Sorts the rows with string values', async () => {
    const { result } = connectedRender(
      <DataTable
        columns={mocks.stringColumns}
        rowPairs={mocks.stringRowsPairs}
      />
    );

    const colABtn = result.getByText(/column A/);
    const colBBtn = result.getByText(/column B/);

    // Initially unsorted
    expect(colABtn.closest('th')).toHaveAttribute('aria-sort', 'none');
    expect(colBBtn.closest('th')).toHaveAttribute('aria-sort', 'none');

    // Sort ascending by col A
    fireEvent.click(colABtn);
    expect(colABtn.closest('th')).toHaveAttribute('aria-sort', 'ascending');
    expect(colBBtn.closest('th')).toHaveAttribute('aria-sort', 'none');

    // Sort descending by col A
    fireEvent.click(colABtn);
    expect(colABtn.closest('th')).toHaveAttribute('aria-sort', 'descending');
    expect(colBBtn.closest('th')).toHaveAttribute('aria-sort', 'none');

    // Sort ascending by col B
    fireEvent.click(colBBtn);
    expect(colABtn.closest('th')).toHaveAttribute('aria-sort', 'none');
    expect(colBBtn.closest('th')).toHaveAttribute('aria-sort', 'ascending');
  });

  test('Sorts the rows with number values', async () => {
    const { result } = connectedRender(
      <DataTable
        columns={mocks.stringColumns}
        rowPairs={mocks.numberRowsPairs}
      />
    );

    const colABtn = result.getByText(/column A/);
    const colBBtn = result.getByText(/column B/);

    // Initially unsorted
    expect(colABtn.closest('th')).toHaveAttribute('aria-sort', 'none');
    expect(colBBtn.closest('th')).toHaveAttribute('aria-sort', 'none');

    // Sort ascending by col A
    fireEvent.click(colABtn);
    expect(colABtn.closest('th')).toHaveAttribute('aria-sort', 'ascending');
    expect(colBBtn.closest('th')).toHaveAttribute('aria-sort', 'none');

    // Sort descending by col A
    fireEvent.click(colABtn);
    expect(colABtn.closest('th')).toHaveAttribute('aria-sort', 'descending');
    expect(colBBtn.closest('th')).toHaveAttribute('aria-sort', 'none');

    // Sort ascending by col B
    fireEvent.click(colBBtn);
    expect(colABtn.closest('th')).toHaveAttribute('aria-sort', 'none');
    expect(colBBtn.closest('th')).toHaveAttribute('aria-sort', 'ascending');
  });

  test('Handles row expansion', async () => {
    const { result } = connectedRender(
      <DataTable
        columns={mocks.singleColumn}
        rowPairs={mocks.expandableRowsPairs}
      />
    );

    // Get the expansion toggle button
    let toggleCol = result.getByText(/^expandable row$/).previousSibling;
    expect(toggleCol).toBeInTheDocument();
    toggleCol = toggleCol as ChildNode;

    const toggleBtn = toggleCol.firstChild as ChildNode;
    expect(toggleBtn).toBeInTheDocument();

    // Non expandable rows don't have the expand button
    expect(
      result.getByText(/^non expandable row$/).previousSibling
    ).not.toHaveClass('pf-c-table__toggle');

    // Row should not be expanded
    expect(result.queryByText(/^child cell$/)).not.toBeVisible();

    // Expand the row
    fireEvent.click(toggleBtn);
    expect(result.queryByText(/^child cell$/)).toBeVisible();
  });

  test('Renders already open rows', async () => {
    const { result } = connectedRender(
      <DataTable columns={mocks.singleColumn} rowPairs={mocks.openedRowsPair} />
    );

    // Get the expansion toggle button
    let toggleCol = result.getByText(/^expandable row$/).previousSibling;
    expect(toggleCol).toBeInTheDocument();
    toggleCol = toggleCol as ChildNode;

    const toggleBtn = toggleCol.firstChild as ChildNode;
    expect(toggleBtn).toBeInTheDocument();

    // Row should be expanded
    expect(result.queryByText(/^child cell$/)).toBeVisible();

    // Hide the row
    fireEvent.click(toggleBtn);
    expect(result.queryByText(/^child cell$/)).not.toBeVisible();
  });

  test('Handle page switching', async () => {
    const { result } = connectedRender(
      <DataTable
        columns={mocks.singleColumn}
        rowPairs={mocks.paginationRowsPair}
      />
    );

    expect(result.queryAllByText(/first page row/).length).toBe(10);
    expect(result.queryByText(/second page row/)).not.toBeInTheDocument();

    // Switch to the next page
    const nextPageBtn = result.getByLabelText(/Go to next page/);
    fireEvent.click(nextPageBtn);

    expect(result.queryByText(/first page row/)).not.toBeInTheDocument();
    expect(result.queryByText(/second page row/)).toBeInTheDocument();

    // Switch to the previous page
    const prevPageBtn = result.getByLabelText(/Go to previous page/);
    fireEvent.click(prevPageBtn);

    expect(result.queryAllByText(/first page row/).length).toBe(10);
    expect(result.queryByText(/second page row/)).not.toBeInTheDocument();
  });

  test('Handles setting page size', async () => {
    const { result } = connectedRender(
      <DataTable
        columns={mocks.singleColumn}
        rowPairs={mocks.paginationRowsPair}
      />
    );

    // Initially only 10 items are shown
    expect(result.queryAllByText(/first page row/).length).toBe(10);
    expect(result.queryByText(/second page row/)).not.toBeInTheDocument();

    // Change items per page
    const perPageBtn = result.getByLabelText(/Items per page/);
    fireEvent.click(perPageBtn);

    const optBtn = result.getByText(/20 per page/);
    fireEvent.click(optBtn);

    expect(result.queryAllByText(/first page row/).length).toBe(10);
    expect(result.queryByText(/second page row/)).toBeInTheDocument();
  });

  test('Renders child cells with full width', async () => {
    const { result } = connectedRender(
      <DataTable
        columns={mocks.singleColumn}
        rowPairs={mocks.fullwidthRowsPairs}
      />
    );

    expect(result.getByText(/child cell/).closest('td')).toHaveAttribute(
      'colspan',
      '2'
    );
  });
});
