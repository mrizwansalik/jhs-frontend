/* eslint-disable */
import React from 'react';

const TableRow = ({ data, event, eventId }) => {
    return (
        <tr className={`${event && 'pointer tr'}`} onClick={() => (event ? event(eventId) : '')}>
            {data.map((item, index) => {
                return (
                    <td className={index === 0 ? 'ps-4' : ''} key={index}>
                        {item}
                    </td>
                );
            })}
        </tr>
    );
};

export default TableRow;
