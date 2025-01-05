/* eslint-disable */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getRoles } from '../../../store/admin/roles/actions';
import { checkAdministration } from 'helpers/globalHelpers';

const Roles = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.roles.list);

  useEffect(() => {
    window.scrollTo(0, 0);
            !checkAdministration() && navigate('/system');
    dispatch(
      getRoles({
        body: {},
        options: { __module: 'role' },
      }));
  }, [dispatch]);

  if (!role) {
    return '';
  }

  return (
    <>
      <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
        {/* Basic info*/}
        <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
          <div className="card-body">
            <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-award text-primary lead pe-1 me-2" />
              <h2 className="h4 mb-0">Role List</h2>
              <Link to='/system/roles/create' className="btn btn-sm btn-secondary ms-auto"><i className="ai-edit ms-n1 me-2" />Add Role</Link>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <tbody><tr>
                  <th>#</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
                </tbody><tbody>
                  {role && role.map((data, index) => {
                    return (
                      <tr key={"tr-" + data._id}>
                        <th scope="row">{++index}</th>
                        <td>{data.name}</td>
                        <td>
                          <Link className="btn btn-primary btn-sm btn-icon mb-2 me-2" to={"/system/roles/" + data._id + "/edit"} data-bs-toggle="tooltip" aria-label="Edit">
                            <i className="ai-edit"></i>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Roles;