/* eslint-disable  */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ErrResponse = ({ time = 4000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const err = useSelector((state) => state.general);
  useEffect(() => {
    if (err.errprResponse) {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, time);
    }
  }, [err.errprResponse]);
  const message = err?.errprResponse?.message || 'Something went wrong, try refreshing the page';

  return (
    <>
      {isVisible && message && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <span className="fw-semibold">Error!:</span>{message}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          />
        </div>
      )}
    </>
  );
};

export default ErrResponse;
