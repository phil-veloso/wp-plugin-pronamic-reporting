// DateRange.jsx
// https://www.npmjs.com/package/react-datepicker

import DatePicker from "react-datepicker";
import styled from "styled-components";
import PropTypes from "prop-types";

import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";

const Styles = styled.div`
  .c-daterange {
    display: flex;
  }
  .c-daterange-title {
    margin-left: 2rem;
    margin-right: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .react-datepicker-wrapper {
    display: block;
    width: initial;
  }
`;

DateRange.propTypes = {
  data: PropTypes.array,
  setFilter: PropTypes.func,
};

export default function DateRange({ data, setFilter }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Define uppper and lower boundries for dates from global dataset.
  const [maxDate, setMaxDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());

  //
  useEffect(() => {
    setMaxDateRange(data);
  }, []);

  // Set uppper and lower boundries for dates from global dataset.
  const setMaxDateRange = () => {
    let dates = data.map((x) => x.date);
    dates.sort();
    let start = new Date(dates.at(0));
    let end = new Date(dates.at(-1));

    // Data set min / max
    setMinDate(start);
    setMaxDate(end);
    setStartDate(start);
    setEndDate(end);
  };

  const updateStartDate = (date) => {
    setStartDate(date);
    filterDates();
  };

  const updateEndDate = (date) => {
    setEndDate(date);
    filterDates();
  };

  const filterDates = () => {
    if (startDate == null || endDate == null) {
      return;
    }

    const addDays = function (days) {
      const date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };

    let start = startDate;
    let end = addDays.call(endDate, 1);

    let dates = [];
    let currentDate = start;

    while (currentDate <= end) {
      dates.push(currentDate.toISOString().slice(0, 10));
      currentDate = addDays.call(currentDate, 1);
    }
    setFilter("date", dates);
  };

  return (
    <>
      <Styles>
        <div className="c-daterange">
          <div className="c-daterange-title">Date Range :</div>
          <DatePicker
            selectsStart
            dateFormat="yyyy/MM/dd"
            selected={startDate}
            onPaste={(date) => updateStartDate(date)}
            onChange={(date) => updateStartDate(date)}
            startDate={startDate}
            minDate={minDate}
            maxDate={maxDate}
          />
          <DatePicker
            selectsEnd
            dateFormat="yyyy/MM/dd"
            selected={endDate}
            onPaste={(date) => updateEndDate(date)}
            onChange={(date) => updateEndDate(date)}
            startDate={endDate}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      </Styles>
    </>
  );
}
