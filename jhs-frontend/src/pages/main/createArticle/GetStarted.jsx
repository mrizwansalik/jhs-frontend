/* eslint-disable */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStarted } from '../../../store/main/articles/actions'

const GetStarted = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.profile.profile);

    const getStartedHandler = () => {
        dispatch(
            getStarted({
                body: {},
                options: { btnLoader: true, __module: 'article', showToast: true },
            }));
    }

    return (
        <div className="card col-lg-12 mt-4">
            <div className="card-header text-center">
                <h2 className='mb-0'>Hi, {user?.full_name}</h2>
            </div>
            <div className="card-body">
                <div className="card-title">
                    <a
                        className="d-inline-block flex-shrink-0 bg-secondary rounded-1 p-md-2 p-lg-3"
                        href="#"
                    >
                        <img
                            src="/assets/img/articleFlow/publishing-infographic.png"
                            width={"100%"}
                            alt="User icon"
                        />
                    </a>
                </div>
                <div className="step-content">
                    <p>
                        <strong>IMPORTANT! Please read before moving forward!</strong>
                    </p>
                    <ol>
                        <li>
                            <strong >
                                Have you read our{" "}
                                <a
                                    target="_blank"
                                    href="/author_guide#!/author-instructions/submitting-an-article"
                                >
                                    Author Instructions
                                </a>
                                ?
                            </strong>
                            <p>
                                Please ensure you have read these instructions before starting your
                                submission! We expect all submissions to studiously adhere to our
                                formatting requirements. Articles with too many errors will either be
                                rejected or require the purchase of our Preferred Editing service.
                            </p>
                        </li>
                        <li>
                            <strong>Do not write your article on the Journal of Healthcare Sciences website!</strong>
                            <p>
                                Please write and format your article offline before starting your
                                submission.
                            </p>
                        </li>
                        <li>
                            <strong>Know your responsibilities as the submitting author:</strong>
                            <ul style={{ fontWeight: "normal" }}>
                                <li style={{ listStyle: "outside" }}>
                                    Authors cannot be added after article submission.
                                </li>
                                <li style={{ listStyle: "outside" }}>
                                    Only the submitting author can edit the article, author names and
                                    affiliations.
                                </li>
                                <li style={{ listStyle: "outside" }}>
                                    <p>
                                        If you are submitting on behalf of an author you must sign in with
                                        the author’s account before continuing.
                                    </p>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>We do not accept the following article submissions:</strong>
                            <ul style={{ fontWeight: "normal" }}>
                                <li style={{ listStyle: "outside" }}>
                                    Surveys of medical students or residents
                                </li>
                                <li style={{ listStyle: "outside" }}>
                                    Articles on medical student, resident or physician burnout
                                </li>
                                <li style={{ listStyle: "outside" }}>
                                    Mini-reviews (Only comprehensive reviews will be considered.)
                                </li>
                            </ul>
                        </li>
                    </ol>
                    <p />
                    <p>Thanks for choosing to publish with Journal of Healthcare Sciences!</p>
                </div>
            </div>
            <div className="card-footer fs-sm text-muted">
                <div className="d-flex align-items-center mb-0 ">
                    <Link
                        className="btn btn-outline-primary w-100 w-md-auto"
                        to={"/main/dashboard"}
                    >
                        <i className="ai-cross me-2 ms-n1" />
                        Cancel
                    </Link>
                    <button onClick={getStartedHandler} className="btn btn-primary ms-auto">
                        <i className="ai-pencil me-2 ms-n1" />
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GetStarted;