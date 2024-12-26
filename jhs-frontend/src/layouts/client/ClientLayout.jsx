/* eslint-disable */
import { Outlet, useLocation, Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import Header from '../../components/header/Header';
import Loading from '../../components/loading/Loading';
import Toasts from '../../components/Notification/Toasts';
import Footer from '../../components/footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/auth/actions';
import { checkFeaturePermission, checkAdministration } from 'helpers/globalHelpers';
import BackToTop from 'components/BackToTop/BackToTop';

const ClientLayout = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `${window.location.origin}/assets/js/theme.min.js`;
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const user = useSelector((state) => state.profile.profile);

    const handleLogout = () => {
        dispatch(logout());
    };

    if (!user) {
        // return null;
    }
    return (
        <>
            <Loading />
            <Header />
            <main className="page-wrapper">
                <div className="container py-5 mt-4 mt-lg-5 mb-lg-4 my-xl-5" style={{ minHeight: '100vh' }}>
                    <div className="row pt-sm-2 pt-lg-0">
                        <aside className="col-lg-3 pe-lg-4 pe-xl-5 mt-n3" >
                            <div className="position-lg-sticky top-0">
                                <div className="d-none d-lg-block" style={{ paddingTop: '105px' }} />
                                <div className="offcanvas-lg offcanvas-start" id="sidebarAccount">
                                    <button className="btn-close position-absolute top-0 end-0 mt-3 me-3 d-lg-none" type="button" data-bs-dismiss="offcanvas" data-bs-target="#sidebarAccount" />
                                    <div className="offcanvas-body">
                                        <div className="pb-2 pb-lg-0 mb-4 mb-lg-3">
                                            <img
                                                className="d-block rounded-circle mb-2"
                                                src={`${(user?.file) ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${user?.file}` : '/assets/img/avatar/user.png'}`}
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                }}
                                                alt={user?.full_name} />
                                            <h3 className="h5 mb-1">{user?.full_name}</h3>
                                            <p className="fs-sm text-muted mb-0">{user?.email}</p>
                                        </div>
                                        <nav className="nav flex-column pb-1 pb-lg-3 mb-1">
                                            <h4 className="fs-xs fw-medium text-muted text-uppercase pb-1 mb-2">MAIN</h4>
                                            <Link to='/system' className={`nav-link fw-semibold py-2 px-0 ${location.pathname === '/system' ? 'active' : ''}`} >
                                                <i className={`ai-bookmark fs-5 opacity-60 me-2`} />Overview</Link>
                                        </nav>
                                        <nav className="nav flex-column pb-1 pb-lg-3 mb-2">
                                            <h4 className="fs-xs fw-medium text-muted text-uppercase pb-1 mb-2">STAKEHOLDER</h4>

                                            {checkFeaturePermission('company-view') ? <Link to='/system/company' className={`nav-link fw-semibold py-2 px-0 ${(location.pathname === '/system/company' || location.pathname === '/system/company/update') ? 'active' : ''}`}><i className="ai-flag fs-5 opacity-60 me-2" />Company</Link> : ''}
                                            {checkFeaturePermission('journal-view') ? <Link to='/system/journal' className={`nav-link fw-semibold py-2 px-0 ${(location.pathname === '/system/journal' || location.pathname === '/system/journal/update') ? 'active' : ''}`}><i className="ai-open-book fs-5 opacity-60 me-2" />Journal</Link> : ''}
                                            {checkFeaturePermission('department-view') ? <Link to='/system/department' className={`nav-link fw-semibold py-2 px-0 ${location.pathname === '/system/department' || location.pathname === '/system/department/create' ? 'active' : ''}`}><i className="ai-briefcase fs-5 opacity-60 me-2" />Department</Link> : ''}
                                            
                                        </nav>
                                        <nav className="nav flex-column pb-1 pb-lg-3 mb-2">
                                            <h4 className="fs-xs fw-medium text-muted text-uppercase pb-1 mb-2">META INFORMATION</h4>
                                            {checkFeaturePermission('category-view') ? <Link to='/system/category' className={`nav-link fw-semibold py-2 px-0 ${location.pathname === '/system/category' || location.pathname === '/system/category/create' ? 'active' : ''}`}><i className="ai-tag fs-5 opacity-60 me-2" />Category</Link> : ''}
                                            {checkFeaturePermission('articletype-view') ? <Link to='/system/articleType' className={`nav-link fw-semibold py-2 px-0 ${location.pathname === '/system/articleType' ? 'active' : ''}`}><i className="ai-file fs-5 opacity-60 me-2" />Article Type</Link> : ''}
                                            {checkFeaturePermission('articlestatus-view') ? <Link to='/system/articleStatus' className={`nav-link fw-semibold py-2 px-0 ${location.pathname === '/system/articleStatus' ? 'active' : ''}`}><i className="ai-tag fs-5 opacity-60 me-2" />Article Status</Link> : ''}
                                            {checkFeaturePermission('articlemeta-view') ? <Link to='/system/articleMeta' className={`nav-link fw-semibold py-2 px-0 ${location.pathname === '/system/articleMeta' ? 'active' : ''}`}><i className="ai-tag fs-5 opacity-60 me-2" />Article Meta</Link> : ''}
                                            
                                            {checkFeaturePermission('services-view') ? <Link to='/system/services' className={`nav-link fw-semibold py-2 px-0 ${location.pathname === '/system/services' ? 'active' : ''}`}><i className="ai-tag fs-5 opacity-60 me-2" />Services</Link> : ''}
                                            {checkFeaturePermission('invoice-view') ? <Link to='/system/invoice' className={`nav-link fw-semibold py-2 px-0 ${location.pathname === '/system/invoice' ? 'active' : ''}`}><i className="ai-file-text fs-5 opacity-60 me-2" />Invoices</Link> : ''}

                                        </nav>
                                        <nav className="nav flex-column pb-1 pb-lg-3 mb-2">
                                            <h4 className="fs-xs fw-medium text-muted text-uppercase pb-1 mb-2">SYSTEM</h4>
                                            {checkFeaturePermission('user-view') ? <Link to='/system/users' className={`nav-link fw-semibold py-2 px-0 ${location.pathname === '/system/users' ? 'active' : ''}`}><i className="ai-user-group fs-5 opacity-60 me-2" />Users</Link> : ''}
                                            <Link to='/system/settings' className={`nav-link fw-semibold py-2 px-0 ${location.pathname === '/system/settings' ? 'active' : ''}`}><i className="ai-settings fs-5 opacity-60 me-2" />Settings</Link>
                                            {checkAdministration() ?
                                                <>
                                                    <Link to='/system/permissions' className={`nav-link fw-semibold py-2 px-0 ${location.pathname === '/system/permissions' || location.pathname === '/system/permissions/create' ? 'active' : ''}`}><i className="ai-layer fs-5 opacity-60 me-2" />Permissions</Link>
                                                    <Link to='/system/roles' className={`nav-link fw-semibold py-2 px-0 ${location.pathname === '/system/roles' || location.pathname === '/system/roles/create' || location.pathname === '/system/roles/{*}/edit' ? 'active' : ''}`}><i className="ai-award fs-5 opacity-60 me-2" />Roles</Link>
                                                </> : ""}
                                            <button className="nav-link fw-semibold py-2 px-0" onClick={handleLogout}><i className="ai-logout fs-5 opacity-60 me-2" />Sign out</button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </aside>
                        {/* Main Content goes here */}
                        <Outlet />
                    </div>
                </div>
                <button className="d-lg-none btn btn-sm fs-sm btn-primary w-100 rounded-0 fixed-bottom" data-bs-toggle="offcanvas" data-bs-target="#sidebarAccount"><i className="ai-menu me-2"></i>Menu</button>
            </main>
            <BackToTop />
            <Toasts />
            <Footer />
        </>
    );
};

export default ClientLayout;
