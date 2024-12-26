/* eslint-disable */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Overview = () => {

  const currUser = useSelector((state) => state.profile.profile);

  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
        {/* Basic info*/}
        <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
          <div className="card-body">
            <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-user text-primary lead pe-1 me-2" />
              <h2 className="h4 mb-0">Basic info</h2>
              <Link to='/system/settings' className="btn btn-sm btn-secondary ms-auto">  <i className="ai-edit ms-n1 me-2" />Edit info</Link>
            </div>
            <div className="d-md-flex align-items-center">
              <div className="d-sm-flex align-items-center">
                <div className="rounded-circle bg-size-cover bg-position-center flex-shrink-0" style={{ width: '80px', height: '80px', backgroundImage: `url(${(currUser?.file) ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${currUser?.file}`:'/assets/img/avatar/user.png'})` }} />
                <div className="pt-3 pt-sm-0 ps-sm-3">
                  <h3 className="h5 mb-2">{currUser?.full_name ? currUser.full_name : 'No Name'}<i className="ai-circle-check-filled fs-base text-success ms-2" /></h3>
                  <div className="text-muted fw-medium d-flex flex-wrap flex-sm-nowrap align-items-center">
                    <div className="d-flex align-items-center me-3"><i className="ai-mail me-1" />{currUser?.email}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row py-4 mb-2 mb-sm-3">
              <div className="col-md-6 mb-4 mb-md-0">
                <table className="table mb-0">
                  <tbody>
                    <tr>
                      <td className="border-0 text-muted py-1 px-0">Language</td>
                      <td className="border-0 text-dark fw-medium py-1 ps-3">{currUser?.language}</td>
                    </tr>
                    <tr>
                      <td className="border-0 text-muted py-1 px-0">Position</td>
                      <td className="border-0 text-dark fw-medium py-1 ps-3 text-capitalize">{currUser?.position}</td>
                    </tr>
                    <tr>
                      <td className="border-0 text-muted py-1 px-0">Role</td>
                      <td className="border-0 text-dark fw-medium py-1 ps-3 text-capitalize">{currUser?.role}</td>
                    </tr>
                  </tbody></table>
              </div>
            </div>
            <div className="alert alert-info d-flex mb-0" role="alert"><i className="ai-circle-info fs-xl" />
              <div className="ps-2">Fill in the information to receive more updates.<Link className="alert-link ms-1" to="/system/settings">Go to settings!</Link></div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default Overview;