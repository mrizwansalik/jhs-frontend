/* eslint-disable */
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const ViewSingleAuthorStats = () => {

  const author = useSelector((state) => state.homeAuthor.single);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <section className="card border-0 shadow py-1 p-md-2 p-xl-3 p-xxl-4 mb-4 my-3">
      <div className="card-body">
        <div className="d-flex align-items-center mt-sm-n1 pb-1 mb-0 mb-lg-1 mb-xl-3">
          <i className="ai-circle-info text-primary lead pe-1 me-2" />
          <h2 className="h4 mb-0">Stats</h2>
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
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
                      {author?.userReport?.articles?.published_count}
                    </div>
                  </div>
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
                      {author?.userReport?.articles?.collaboration_count}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Total Published Articles */}
          <div className="col">
            <div className="card h-100 rounded-3 p-3 p-sm-4">
              <div className="d-flex align-items-center pb-2 mb-1">
                <h3 className="h6 text-nowrap text-truncate mb-0">
                  Reviewed Article
                </h3>
              </div>
              <div className="d-flex align-items-center">
                <div className="text-center mb-2">
                  <div className="bg-secondary rounded-1 p-4">
                    <div className="h2 fw-normal mb-0 mx-1">
                      {author?.userReport?.articles?.completed_reviewed_count}
                    </div>
                  </div>
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
                      {author?.userReport?.articles?.rejected_count}
                    </div>
                  </div>
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
                      {author?.userReport?.articles?.revision_count}
                    </div>
                  </div>
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
                      {author?.userReport?.total_citations}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewSingleAuthorStats;
