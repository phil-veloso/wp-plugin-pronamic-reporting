// Stats.jsx
import styled from "styled-components";
import PropTypes from "prop-types";

Stat.propTypes = {
  value: PropTypes.string,
  definition: PropTypes.string,
};

const Styles = styled.div`
  .stat-box {
    text-align: center;
    border: 1px solid #c3c4c7;
    background-color: #f6f7f7;
    padding: 1.5rem;
    box-shadow: 0 1px 1px rgb(0 0 0 / 4%);
  }
  .stat-value {
    display: block;
    font-size: 32px;
    line-height: 32px;
  }
  .stat-text {
    display: block;
    font-size: 16px;
    margin-top: 0.5rem;
  }
`;

export default function Stat({ value, definition }) {
	
  return (
    <>
      <Styles>
        <div className="stat-box">
          <span className="stat-value">{value}</span>
          <span className="stat-text">{definition}</span>
        </div>
      </Styles>
    </>
  );
}
