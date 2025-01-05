/* eslint-disable */
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import 'bootstrap-daterangepicker/daterangepicker.css';
//import DateRangePicker from 'react-bootstrap-daterangepicker';


const DateRange = (props) => {
    const filter = useSelector((state) => state.filters);
    const [state, setState] = useState({ start: '', end: '' });
    const { getChildata } = props;
    const dateRangePickerRef = useRef();
    const maxDate = new Date();
    useEffect(() => {
        const date = new Date(); // use your date here
        const prevDate = new Date(date);
        prevDate.setDate(date.getDate() - 1);
        setState({ ...state, start: prevDate, end: date }); // setting current date in state
    }, []);

    useEffect(() => {
        if (state) {
            // setting current date in DateRangePicker
            dateRangePickerRef.current.setStartDate(state.start);
            dateRangePickerRef.current.setEndDate(state.end);
        }
    }, [state]);

    useEffect(() => {
        // if dateRange filter is not applied or not in filter object then set current date in Picker
        if (!('createdAt[gte]' in filter)) {
            dateRangePickerRef.current.setStartDate(state.start);
            dateRangePickerRef.current.setEndDate(state.end);
        }
    }, [filter]);

    const handleEvent = (event, picker) => { };

    const handleCallback = (start, end, label) => {

        const data = {
            'createdAt[gte]': new Date(start._d),
            'createdAt[lte]': new Date(end._d)
        };
        getChildata(data);
    };

    return (
        <>
            {/* <DateRangePicker ref={dateRangePickerRef} initialSettings={{ maxDate }}
                onEvent={handleEvent} onCallback={handleCallback}>
                <input type="text" className="form-control input-group date-range-picker mt-3 ps-3 fs-6" />
            </DateRangePicker> */}
        </>
    );
};

export default DateRange;
