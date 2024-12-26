import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { applyFilters } from '../../store/filters/actions';
import { Link } from 'react-router-dom';
let action = () => null;

const Pagination = (props) => {
    const { pagination, fetchAction, extraParams } = props;
    const dispatch = useDispatch();
    action = fetchAction;
    const [prev, setPrev] = useState(false);
    const [next, setNext] = useState(false);
    let pages = 0;

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

        <div className="d-flex align-items-center justify-content-between" >
            <div className="d-flex align-items-center">
                
            </div>
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className={`page-item ${prev ? '' : 'disabled'}`}>
                        <Link onClick={(e) => paginate(e, pagination.page - 1)} to="#" className={`page-link ${prev ? '' : 'disabled'}`}>
                            <i className="ai-arrow-left fs-xl me-2"></i> Prev
                        </Link>
                    </li>
                    <li className={`page-item ${next ? '' : 'disabled'}`}>
                        <Link onClick={(e) => paginate(e, pagination.page + 1)} to  ="#" className={`page-link ${next ? '' : 'disabled'}`}>
                            Next <i className="ai-arrow-right fs-xl ms-2"></i>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div >


    );
};

export default connect()(Pagination);
