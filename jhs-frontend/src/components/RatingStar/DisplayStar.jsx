/* eslint-disable */
import React from "react";

const DisplayStar = ({ rating }) => {
  return (
    <section className="p-1 d-flex">
      <ul className="rating list-unstyled d-flex" style={{ gap: "10px" }}>
        {["Bad", "Poor", "OK", "Good", "Excellent"].map((tooltip, index) => (
          <li key={index}>
            <i
              className={`ai-star-filled ${index < rating ? "active" : ""}`}
              data-bs-toggle="tooltip"
              data-bs-title={tooltip}
              style={{
                fontSize: "1.5rem",
                color: index < rating ? "#ffc107" : "#ccc",
                transition: "color 0.3s ease",
              }}
            ></i>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DisplayStar;
