// Table.jsx

// https://codesandbox.io/s/github/tannerlinsley/react-table/tree/v7/examples/filtering?file=/src/App.js
// https://react-table-v7.tanstack.com/docs/api/useFilters

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Stat from "./Stat";

const Styles = styled.div`
  .stat-container > * {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .stat-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-left: -0.5rem;
    margin-right: -0.5rem;
  }
`;

StatsOverview.propTypes = {
  data: PropTypes.array,
};

export default function StatsOverview({ data }) {
  useEffect(() => {
    calculateStats();
  }, [data]);

  const [stats, setStats] = useState({});

  const calculateStats = () => {
    let results = data;

    let stats = {
      total: "-",
      count: "-",
      average: "-",
      median: "-",
    };

    if (results !== undefined || results.length > 0) {
      let total = 0;
      let count = results.length;
      let median_values = [];
      results.forEach((element) => {
        total += parseInt(element.original.amount);
        median_values.push(element.original.amount);
      });
      if (median_values.length > 0) {
        let average = total / count;
        let median = calculate_median(median_values);

        stats.total = total;
        stats.count = count;
        stats.average = parseFloat(average).toFixed(2);
        stats.median = median;
      }
    }

    setStats(stats);
  };

  const calculate_median = (values) => {
    if (values.length === 0) throw new Error("No inputs");
    values.sort(function (a, b) {
      return a - b;
    });
    var half = Math.floor(values.length / 2);
    if (values.length % 2) return values[half];
    return (values[half - 1] + values[half]) / 2.0;
  };

  return (
    <>
      <Styles>
        <div className="stat-container">
          <Stat value={`${stats.count}`} definition={`Payments`} />
          <Stat value={`€${stats.total}`} definition={`Total Revenue`} />
          <Stat value={`€${stats.average}`} definition={`Average Value`} />
          <Stat value={`€${stats.median}`} definition={`Median Value`} />
        </div>
      </Styles>
    </>
  );
}
