import React from 'react';

const TableHeadItem = ({ item, index }) => {
    return (
        <th className={index === 0 ? 'ps-4' : ''} title={item}>
            <span className="thead">
                {item}
                <img src="assets/images/arrow-table.png" alt="" className="img-fluid w-7px" />
            </span>
        </th>
    );
};

export default TableHeadItem;
