import React from "react";
import PropTypes from "prop-types";

import {
  useAsyncDebounce,
} from "react-table";

// Define a default UI for filtering
GlobalFilter.propTypes = {
  preGlobalFilteredRows: PropTypes.array,
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func,
  setFilteredData: PropTypes.func,
};

export default function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 1000);

  return (
    <span className="search-box">
      <input
        name="s"
        type="search"
        value={value || ""}
        onPaste={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </span>
  );
}
