import React from 'react';
import TableRow from './TableRow';
import TableHeadItem from './TableHead';
import EmptyTable from './EmptyTable';

const Table = ({ theadData, tbodyData, customClass }) => {
    return (
        <table className={customClass}>
            <thead>
                <tr>
                    {theadData.map((h, index) => {
                        return <TableHeadItem index={index} key={h} item={h} />;
                    })}
                </tr>
            </thead>
            <tbody>
                {tbodyData.length !== 0 ? (
                    tbodyData.map((item) => {
                        return <TableRow key={item.id} data={item.items} event={item.event} eventId={item.event_id} />;
                    })
                ) : (
                    <EmptyTable />
                )}
            </tbody>
        </table>
    );
};

export default Table;
