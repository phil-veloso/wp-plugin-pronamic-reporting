// Table.jsx

// https://codesandbox.io/s/github/tannerlinsley/react-table/tree/v7/examples/filtering?file=/src/App.js
// https://react-table-v7.tanstack.com/docs/api/useFilters

import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import {
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
} from "react-table";

import GlobalFilter from "./GlobalFilter";
import Pagination from "./Pagination";
import StatsOverview from "./StatsOverview";
import DateRange from "./DateRange";

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
};

const Styles = styled.div`
  .order-column {
    float: right;
  }
`;

export default function Table({ columns, data }) {
  // Use the useTable Hook to send the columns and data to build the table
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    page, // Instead of using 'rows', we'll use page, which has only the rows for the active page
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    //* Filter Options
    setFilter,
    setGlobalFilter, // The useGlobalFilter, filtering based upon data that may be in any column in a given row.
    //* Pagination Options
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    state,
    previousPage,
    setPageSize,
    preGlobalFilteredRows,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 50,
        sortBy: columns.map((one) => {
          return {
            desc: true,
            id: one.id,
          };
        }),
      },
    },
    useFilters, // useFilters!
    useGlobalFilter, // Adding the useGlobalFilter Hook to the table
    useSortBy,
    usePagination
  );

  
  /* 
    Render table
  */
  return (
    <>
      <Styles>
        <StatsOverview data={rows} />
        <div className="tablenav top">
          <div className="alignleft">
            <GlobalFilter
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
              preGlobalFilteredRows={preGlobalFilteredRows}
            />
          </div>
          <div className="alignleft">
            <DateRange
              data={data}
              setFilter={setFilter}
            />
          </div>
          <div className="alignright">
            <Pagination
              canPreviousPage={canPreviousPage}
              canNextPage={canNextPage}
              pageOptions={pageOptions}
              pageCount={pageCount}
              gotoPage={gotoPage}
              nextPage={nextPage}
              previousPage={previousPage}
              setPageSize={setPageSize}
              pageIndex={pageIndex}
              pageSize={pageSize}
            />
          </div>
        </div>
        <table
          className="wp-list-table widefat fixed striped table-view-list posts"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                key={headerGroup.getHeaderGroupProps().key}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.uniqueId}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={ 
                      column.isSorted
                        ? column.isSortedDesc
                          ? "sort-desc"
                          : "sort-asc"
                        : ""
                    }
                  >
                    {column.render("Header")}
                    {/* Add a sort direction indicator */}
                    <span className="order-column">
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " ↓"
                          : " ↑"
                        : " ⇅"}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr key={row.uniqueId} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td key={cell.uniqueId} {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      </Styles>
    </>
  );
}
