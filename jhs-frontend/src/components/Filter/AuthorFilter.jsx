import React, { forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { applyFilters, resetFilter } from "../../store/filters/actions";
import { Outlet } from "react-router-dom";
import DateRange from "./dateRange";
// let { search } = window.location;
// let params = new URLSearchParams(window.location.search);

const AuthorFilter = forwardRef((props, ref) => {
    const { fetchAction } = props;
    const dispatch = useDispatch();
    const dynamicContent = props.children;

    const filter = useSelector(state => state.filters)

    useImperativeHandle(ref, () => ({   // getting additional filters data (from where componenet is being called) and passed to applyfilter,
        getAdditionalFilterData(key, event) {
            applyFilter(key, event);
        },
    }))

    const applyFilter = (key, event) => {

        let data = {
            [key]: event.target.value ? event.target.value : null,
        }
        const queryParams = new URLSearchParams(window.location.search);

        queryParams.set(key, event.target.value);
        window.history.pushState({}, '', `${window.location.pathname}?${queryParams}`);
        dispatch(applyFilters({ filter: data }));
        dispatch(fetchAction);
    }

    const removeFilter = () => {
        window.history.pushState({}, '', `${window.location.pathname}`);
        dispatch(resetFilter())
        dispatch(fetchAction);
    }

    const getChildata = (data) => {
        // applyFilter(null,null, data)
        dispatch(applyFilters({ filter: data }));
        dispatch(fetchAction);
    }

    return (
        <>
                {
                    dynamicContent ? dynamicContent : null // additional fields 
                }
                <div className='col-lg-1 col-sm-7'>
                    {
                        props.search ?
                            <div className='col-md-12 mb-2'>
                                <input className="form-control" type="text" placeholder="Search..." />
                            </div> : ""
                    }
                    <button onClick={removeFilter} className="btn btn-secondary mx-2 session-by-country-map-reset" type="button">
                        <span className="fas fa-sync-alt fs--1"></span>
                        <span className="d-none d-sm-inline-block ms-1">Reset</span>
                    </button>
                </div>
            
        </>
    )
});

export default AuthorFilter