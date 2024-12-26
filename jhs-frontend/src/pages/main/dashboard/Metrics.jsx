/* eslint-disable */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getProfileReport } from 'store/profile/actions';

const Metrics = () => {

    const dispatch = useDispatch();

    const auth = JSON.parse(localStorage.getItem('auth'));
    const userReport = useSelector((state) => state.profile.report);

    useEffect(() => {
        if (auth) {
            dispatch(
                getProfileReport({
                    body: {},
                    options: { __module: 'profile' },
                }))
        }
    }, []);


    return (
        <section className="card border-0 shadow py-1 p-md-2 p-xl-3 p-xxl-4 mb-4 my-3">
            <div className="card-body">
                <div className="d-flex align-items-center mt-sm-n1 pb-1 mb-0 mb-lg-1 mb-xl-3">
                    <i className="ai-circle-info text-primary lead pe-1 me-2" />
                    <h2 className="h4 mb-0">Overall Metrics</h2>
                </div>
                <div className="alert alert-primary d-flex mb-4">
                    <i className="ai-circle-info fs-xl me-2" />
                    <p className="mb-0">
                        See how you measure up against the rest of the Journal of healthcare sciences community with your JHS totals and individual article metrics along with corresponding JHS user rank. Data may be delayed up to one hour.
                    </p>
                </div>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4">
                    {/* Total Published Articles */}
                    <div className="col">
                        <div className="card h-100 rounded-3 p-3 p-sm-4">
                            <div className="d-flex align-items-center pb-2 mb-1">
                                <h3 className="h6 text-nowrap text-truncate mb-0">
                                    Total Published Articles
                                </h3>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="text-center mb-2">
                                    <div className="bg-secondary rounded-1 p-4">
                                        <div className="h2 fw-normal mb-0 mx-1">
                                            {userReport?.articles?.published_count}
                                        </div>
                                    </div>
                                </div>
                                <div className="ps-3 fs-sm">
                                    <div className="text-dark">asdaskdhal sd</div>
                                    <div className="text-muted">asdasd</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Total Article Views */}
                    <div className="col">
                        <div className="card h-100 rounded-3 p-3 p-sm-4">
                            <div className="d-flex align-items-center pb-2 mb-1">
                                <h3 className="h6 text-nowrap text-truncate mb-0">
                                    Total Coloration
                                </h3>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="text-center mb-2">
                                    <div className="bg-secondary rounded-1 p-4">
                                        <div className="h2 fw-normal mb-0 mx-1">
                                            {userReport?.articles?.collaboration_count}
                                        </div>
                                    </div>
                                </div>
                                <div className="ps-3 fs-sm">
                                    <div className="text-dark">asdaskdhal sd</div>
                                    <div className="text-muted">asdasd</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Total Published Articles */}
                    <div className="col">
                        <div className="card h-100 rounded-3 p-3 p-sm-4">
                            <div className="d-flex align-items-center pb-2 mb-1">
                                <h3 className="h6 text-nowrap text-truncate mb-0">
                                    Pending Article
                                </h3>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="text-center mb-2">
                                    <div className="bg-secondary rounded-1 p-4">
                                        <div className="h2 fw-normal mb-0 mx-1">
                                        {userReport?.articles?.pending_count}
                                        </div>
                                    </div>
                                </div>
                                <div className="ps-3 fs-sm">
                                    <div className="text-dark">asdaskdhal sd</div>
                                    <div className="text-muted">asdasd</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Peer Review Contributions */}
                    <div className="col">
                        <div className="card h-100 rounded-3 p-3 p-sm-4">
                            <div className="d-flex align-items-center pb-2 mb-1">
                                <h3 className="h6 text-nowrap text-truncate mb-0">
                                    Total Rejected
                                </h3>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="text-center mb-2">
                                    <div className="bg-secondary rounded-1 p-4">
                                        <div className="h2 fw-normal mb-0 mx-1">
                                        {userReport?.articles?.rejected_count}
                                        </div>
                                    </div>
                                </div>
                                <div className="ps-3 fs-sm">
                                    <div className="text-dark">asdaskdhal sd</div>
                                    <div className="text-muted">asdasd</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* SIQ Contributions */}
                    <div className="col">
                        <div className="card h-100 rounded-3 p-3 p-sm-4">
                            <div className="d-flex align-items-center pb-2 mb-1">
                                <h3 className="h6 text-nowrap text-truncate mb-0">
                                    Total Revision
                                </h3>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="text-center mb-2">
                                    <div className="bg-secondary rounded-1 p-4">
                                        <div className="h2 fw-normal mb-0 mx-1">
                                        {userReport?.articles?.revision_count}
                                        </div>
                                    </div>
                                </div>
                                <div className="ps-3 fs-sm">
                                    <div className="text-dark">asdaskdhal sd</div>
                                    <div className="text-muted">asdasd</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Total Citations */}
                    <div className="col">
                        <div className="card h-100 rounded-3 p-3 p-sm-4">
                            <div className="d-flex align-items-center pb-2 mb-1">
                                <h3 className="h6 text-nowrap text-truncate mb-0">
                                    Total Citations
                                </h3>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="text-center mb-2">
                                    <div className="bg-secondary rounded-1 p-4">
                                        <div className="h2 fw-normal mb-0 mx-1">
                                        {userReport?.total_citations}
                                        </div>
                                    </div>
                                </div>
                                <div className="ps-3 fs-sm">
                                    <div className="text-dark">asdaskdhal sd</div>
                                    <div className="text-muted">asdasd</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Metrics;