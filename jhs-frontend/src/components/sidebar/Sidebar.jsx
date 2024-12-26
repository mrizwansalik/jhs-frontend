/* eslint-disable */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="col-md-3 col-2-2">
            <div className="offcanvas offcanvas-start desktop-canvas" tabIndex={-1} id="offcanvasExample">
                <div className="side_menu_container broadslist">
                    <div className="offcanvas-header">
                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close">
                            <img src="assets/images/white-cross-icon.svg" alt="" className="img-fluid" />
                        </button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="responsivefootnav" id="responsivefootnav">
                            <li className={`items ${location.pathname == '/system' ? 'active' : ''}`}>
                                <Link to="/main/dashboard" className="links">
                                    <img src="assets/images/dashboard-icon.svg" alt="" className="menu-icon" />
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
