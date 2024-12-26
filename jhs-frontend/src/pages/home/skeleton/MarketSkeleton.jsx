/* eslint-disable */
import React from 'react';

const MarketSkeleton = () => {
    return (
        <tr>
            <td className="pair-name bar_placeholder anim"></td>
            <td className="bar_placeholder anim">
                <div className="d-flex align-items-center">
                    <div className="chart" id="graph" data-percent="10"></div>

                    <span className="green-color"></span>
                </div>
            </td>

            <td className="bar_placeholder anim"></td>

            <td className="bar_placeholder anim"></td>
            <td className="bar_placeholder anim"></td>
            <td className="bar_placeholder anim"></td>
            <td className="bar_placeholder anim"></td>
            <td className="bar_placeholder anim">
                <button className="btn btn-secondary border-0 rounded-pill fs-5 fw-bold"></button>
            </td>
        </tr>
    );
}

export default MarketSkeleton;