import React, { useEffect, useImperativeHandle, useState, forwardRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { applyFilters, resetFilter } from '../../store/filters/actions';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

let action = () => null;

const AuthorPagination =  forwardRef((props, ref) => {
    const { pagination, fetchAction } = props;
    const filter = useSelector(state=> state.filters)
    const dispatch = useDispatch();
    action = fetchAction;
    const [prev, setPrev] = useState(false);
    const [next, setNext] = useState(false);
    let pages = 0;
    
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

    const setButtons = () => {
        if (pagination && pagination.page) {
            // Next
            if (pagination.limit <= pagination.total) {
                setNext(true);
            } else {
                setNext(false);
            }
            // Center pages
            pages = Math.ceil(pagination.count / pagination.limit);
            pages = Math.min(pages, 6);

            // Previous
            if (!pagination || pagination.page === 1) {
                setPrev(false);
            } else {
                setPrev(true);
            }
        }
    };

    useEffect(() => {
        setButtons();
    }, [pagination]);

    const paginate = (e, page) => {
        let data = {
            ['page']: page ? page : null,
        };
        dispatch(applyFilters({ filter: data }));
        e.preventDefault();
        dispatch(action);
        setButtons();
    };
    return (
                <div className="row gy-3 align-items-center mt-lg-5 pt-2 pt-md-3 pt-lg-0 mb-md-2 mb-xl-4">
                    <div className="col col-md-4 col-6 order-md-1 order-1">
                        <div className="d-flex align-items-center">
                            <span className="text-body-secondary fs-sm">Show</span>
                            <select value={filter?.limit ? filter?.limit : ''}
                                onChange={event => applyFilter("limit", event)} 
                                className="form-select form-select-flush w-auto"
                                name="organizerSingle" data-options='{"removeItemButton":true,"placeholder":true}'>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="40">40</option>
                                <option value="80">80</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                    </div>
                    <div className="col col-md-4 col-12 order-md-2 order-3 text-center">
                        
                    </div>
                    <div className="col col-md-4 col-6 order-md-3 order-2">
                        <nav aria-label="Page navigation">
                            <ul className="pagination pagination-sm justify-content-end">
                                <li className="page-item active" aria-current="page">
                                    <Link onClick={(e) => paginate(e, pagination.page - 1)} to="#" className={`page-link ${prev ? '' : 'disabled'}`}>
                                        <i className="ai-arrow-left fs-xl me-2"></i> Prev
                                    </Link>
                                </li>
                                <li className="page-item">
                                    <Link onClick={(e) => paginate(e, pagination.page + 1)} to  ="#" className={`page-link ${next ? '' : 'disabled'}`}>
                                        Next <i className="ai-arrow-right fs-xl ms-2"></i>
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>


    );
});

export default connect()(AuthorPagination);
