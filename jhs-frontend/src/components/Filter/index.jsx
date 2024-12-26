import React, { forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { applyFilters, resetFilter } from "../../store/filters/actions";
import { Outlet } from "react-router-dom";
import DateRange from "./dateRange";
// let { search } = window.location;
// let params = new URLSearchParams(window.location.search);

const Filter =forwardRef((props,ref) => {
    const { fetchAction } = props;
    const dispatch = useDispatch();
    const dynamicContent = props.children;
    
    const filter = useSelector(state=> state.filters)
    
    useImperativeHandle(ref, () => ({   // getting additional filters data (from where componenet is being called) and passed to applyfilter,
        getAdditionalFilterData(key,event) {
            applyFilter(key,event);
        },
      }))

    const applyFilter = (key, event) => {
       
        let  data = {
            [key]: event.target.value ? event.target.value : null,
        }
        const queryParams = new URLSearchParams(window.location.search);

        queryParams.set(key,event.target.value);
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
            <div className="row flex-between-end py-2">
                <div className="col-auto align-self-center">
                </div>
            </div>
            {
                props.visibility === true ?
                    <div className="card mb-3">
                        <div className="card-header p-3 m-3">
                            <div className="row flex-between-end">
                                <div className="col-auto align-self-center">
                                    <h5 className="mb-0" data-anchor="data-anchor"> <i className="ai-filter lead pe-1 me-2"></i> Set Filters</h5>
                                </div>
                            </div>
                        </div>
                        <div className="card-body m-3 p-3">
                            <div className='row'>
                            <div className='col-md-4 mb-2'>   
                                    <label className=' form-label fs--2'>Per Page</label>
                                    <select 
                                     value={filter?.limit ? filter?.limit : ''}
                                     onChange={event => applyFilter("limit", event)} className="form-select form-select-sm" 
                                     size="1" name="organizerSingle" data-options='{"removeItemButton":true,"placeholder":true}'>
                                        <option value="10">Per Page</option>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="40">40</option>
                                        <option value="80">80</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                                {
                                    dynamicContent ? dynamicContent : null // additional fields 
                                }
                                {props.search ?
                                    <div className='col-md-12 mb-2'>
                                        <input  className="form-control form-control-sm" type="text" placeholder="Search..." />
                                    </div> : ""}
                                {props.status ?
                                <div className='col-md-4 mb-2'>
                                    <label className=' form-label fs--2'>Status</label>
                                    <select 
                                    value={filter?.status ? filter?.status: ''}
                                    onChange={event => applyFilter("status", event)} className="form-select form-select-sm " 
                                    id="organizerSingle" size="1" name="organizerSingle" data-options='{"removeItemButton":true,"placeholder":true}'>
                                        <option value=""> Status</option>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                </div> : ""}

                                {/* <div className='col-md-4'>
                                    <label className=' form-label fs--2'>Order By</label>
                                    <select 
                                    value={filter?.sort ? filter?.sort: ''}
                                    onChange={event => applyFilter("sort", event)} className="form-select form-select-sm" 
                                    id="organizerSingle" size="1" name="organizerSingle" data-options='{"removeItemButton":true,"placeholder":true}'>
                                        <option value="">Order By</option>
                                        <option value="createdAt">Asc</option>
                                        <option value="-createdAt">Desc</option>
                                    </select>
                                </div> */}
                                {/* <div className='col-md-3'>
                                  
                                    <label className=' form-label fs--2'>Date Range</label>
                                      <DateRange getChildata={getChildata} /> 
                                </div> */}
                            </div>
                        </div>
                        <div className="card-footer bg-light d-flex justify-content-end m-3 p-3">
                            <div className="col-auto align-content-end">
                                <button onClick={removeFilter} className="btn btn-secondary btn-sm mx-2 session-by-country-map-reset" type="button">
                                    <span className="fas fa-sync-alt fs--1"></span>
                                    <span className="d-none d-sm-inline-block ms-1">Reset</span>
                                </button>
                            </div>
                            <div className="col-auto align-content-end">
                                <button className="btn btn-sm btn-primary" type="button">
                                    <span className="d-none d-sm-inline-block ms-1">Apply</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    : ''
            }

            <Outlet></Outlet>
        </>
    )
})

export default Filter