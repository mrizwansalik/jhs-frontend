/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Filter from 'components/Filter';
import Pagination from 'components/pagination/Pagination';
import { getPermissions } from 'store/admin/permissions/actions';
import { checkAdministration } from 'helpers/globalHelpers';

const Permissions = () => {

  const childCompRef = useRef();
  const dispatch = useDispatch();
  const [isFilter, setIsFilter] = useState(false);
  const permission = useSelector((state) => state.permissions);
  const filter = useSelector(state => state.filters)

  const filterVisibility = () => {
    isFilter === false ? setIsFilter(true) : setIsFilter(false);
  };

  const getPermissionsAction = getPermissions({
    body: {},
    options: { __module: 'permission', pagination: true },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    !checkAdministration() && navigate('/system');
    dispatch(getPermissionsAction);
  }, []);

  if (!permission) {
    return '';
  }

  return (
    <>
      <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
        {/* Basic info*/}
        <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
          <div className="card-body">
            <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-layer text-primary lead pe-1 me-2" />
              <h2 className="h4 mb-0">Permissions List</h2>
              <Link to='/system/permissions/create' className="btn btn-sm btn-secondary ms-auto">  <i className="ai-edit ms-n1 me-2" />Add Permission</Link>

              <button
                onClick={filterVisibility}
                className="btn btn-sm btn-secondary mx-2"
              >
                <i className="ai-filter lead pe-1 me-2"></i>Filter
              </button>
            </div>
            <Filter
              visibility={isFilter}
              ref={childCompRef}
              search={false}
              fetchAction={getPermissionsAction}
            >
              <div className="col-md-4 mb-2">
                <label className="form-label" htmlFor="name">
                  Name
                </label>
                <input
                  onChange={(event) =>
                    childCompRef.current.getAdditionalFilterData(
                      "name",
                      event
                    )
                  }
                  className="form-control form-control-sm"
                  type="text"
                  id="name"
                />
              </div>
              <div className='col-md-4 mb-2'>
                <label className=' form-label fs--2'>Order By</label>
                <select
                  value={filter?.sort ? filter?.sort : ''}
                  onChange={(event) =>
                    childCompRef.current.getAdditionalFilterData(
                      "sort",
                      event
                    )
                  } className="form-select form-select-sm"
                  id="sort" size="1" name="organizerSingle" data-options='{"removeItemButton":true,"placeholder":true}'>
                  <option value="">None</option>
                  <option value="full_name">Name - ASC</option>
                  <option value="createdAt">Created at - ASC</option>
                  <option value="-full_name">Name - DESC</option>
                  <option value="-createdAt">Created at - DESC</option>
                </select>
              </div>
            </Filter>
            <div className="table-responsive">
              <table className="table table-hover">
                <tbody><tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Features</th>
                  <th>Action</th>
                </tr>
                </tbody><tbody>
                  {permission && permission?.list?.map((data, index) => {
                    return (
                      <tr key={"tr-" + data._id}>
                        <th scope="row">{++index}</th>
                        <td>{data.name}</td>
                        <td>
                          {
                            (data.feature).map(function (feature, i) {
                              return <span className="badge text-nav fs-xs border mt-2" key={feature.slug} >{feature.name}</span>
                            })
                          }
                        </td>
                        <td>
                          <Link className="btn btn-primary btn-sm btn-icon mb-2 me-2" to={"/system/permissions/" + data._id + "/edit"}>
                            <i className="ai-edit"></i>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
                    fetchAction={getPermissionsAction}
                    extraParams={{ __module: "permission" }}
                    pagination={{
                    ...permission?.pagination,
                    total: permission?.list?.length,
                    }}
                />
          </div>
        </section>
      </div>
    </>
  );
};

export default Permissions;