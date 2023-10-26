import React from "react";
import PropTypes from "prop-types";


// Define a default UI for filtering
Pagination.propTypes = {
  preGlobalFilteredRows: PropTypes.array,
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func,
  setFilteredData: PropTypes.func,
  canPreviousPage: PropTypes.bool,
  canNextPage: PropTypes.bool,
  pageOptions: PropTypes.array,
  pageCount: PropTypes.number,
  gotoPage: PropTypes.func,
  nextPage: PropTypes.func,
  previousPage: PropTypes.func,
  setPageSize: PropTypes.func,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
};


export default function Pagination({
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  pageIndex,
  pageSize,
}) {
  return (
    <>
      <div className="tablenav-pages">
        <button
          className="first-page button"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <span aria-hidden="true">«</span>
        </button>{" "}
        <button
          className="prev-page button"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <span aria-hidden="true">‹</span>
        </button>{" "}
        <button
          className="next-page button"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <span aria-hidden="true">›</span>
        </button>{" "}
        <button
          className="last-page button"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <span aria-hidden="true">»</span>
        </button>{" "}
        <span className="pagin-input">
          <input
            className="current-page"
            type="number"
            min="0"
            value={pageIndex + 1}
            // defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "45px" }}
          />
          <span className="tablenav-paging-text">
            {" "}
            of <span className="total-pages">{pageOptions.length}</span>
          </span>
        </span>
        <span></span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[25, 50, 100, 500, 1000].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
