/* eslint-disable */
import React from 'react';

const EmptyTable = () => {
    return (
        <tr className="position-absolute start-45 tab-pane fade active show">
            <td className="text-center pt-5 pb-5">
                <img className="w-70px" src="assets/images/no-data-icon.svg" alt="no data" />
                <p className="mt-4 color-light-gray fs-5 fw-bold">No data</p>
            </td>
        </tr>
    );
};

export default EmptyTable;
