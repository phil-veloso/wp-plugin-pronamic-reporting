// https://react-table-v7.tanstack.com/docs/api/useGlobalFilter#instance-properties

import { useState, useMemo, useEffect } from "react";

import axios from "redaxios";
import Table from "./Table";

function Loading() {
  return <p className="loading">Loading, please wait</p>;
}

/* Custom filter function */
function multiSelectFilter(rows, columnIds, filterValue) {
  // Filters only if filters are selected
  return filterValue.length === 0
    ? rows
    : rows.filter((row) => filterValue.includes(String(row.original.date)));
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const columnsPayments = useMemo(
    () => [
      {
        Header: "Payment ID",
        accessor: "payment",
        Cell: (e) => (
          <a
            target="_blank"
            rel="noreferrer"
            href={`/wp-admin/post.php?post=${e.value}&action=edit`}
          >
            {e.value}
          </a>
        ),
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: (e) => `€${e.value}`,
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Date",
        accessor: "date",
        filter: multiSelectFilter,
      },
      {
        Header: "Method",
        accessor: "method",
      },
      {
        Header: "Source",
        accessor: "source",
      },
    ],
    []
  );

  const columnsSubscirptions = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "subscriber",
        size: 20,
        Cell: (e) => (
          <a
            target="_blank"
            rel="noreferrer"
            href={`/wp-admin/post.php?post=${e.value}&action=edit`}
          >
            {e.value}
          </a>
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: (e) => `€${e.value}`,
      },
      {
        Header: "Period",
        accessor: "period",
      },
      {
        Header: "Next",
        accessor: "next",
      },
      {
        Header: "Total",
        accessor: "total",
        Cell: (e) => `€${e.value}`,
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Source",
        accessor: "source",
      },
    ],
    []
  );

  const pathname = window.location.search;
  const getMethod = (pathname) => {
    switch (pathname) {
      case "?page=pronamic-reporting-payments":
        return "get_payments";
      case "?page=pronamic-reporting-subscriptions":
        return "get_subscriptions";
      default:
        return "get_overview";
    }
  };
  const method = getMethod(pathname);

  const getColumns = (pathname) => {
    switch (pathname) {
      case "?page=pronamic-reporting-payments":
        return columnsPayments;
      case "?page=pronamic-reporting-subscriptions":
        return columnsSubscirptions;
      default:
        return "get_overview";
    }
  };
  const columns = getColumns(pathname);

  // Using useEffect to call the API once mounted and set the data
  useEffect(() => {
    axios
      .get(`${ajaxurl}?action=${method}`)
      .then(({ data }) => {
        console.log(data);
        setData(data.results);
      })
      .catch(() => {
        console.log("Failed to call API, maybe you are disconnected!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Finance Reporting</h1>
      {loading ? <Loading /> : <Table columns={columns} data={data} />}
    </div>
  );
}
