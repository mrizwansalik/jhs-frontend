/* eslint-disable */
import React from 'react';

const NotificationsSetting = () => {
  return (
    <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
      <div className="card-body">
        <div className="d-flex align-items-center pb-4 mt-sm-n1 mb-0 mb-lg-1 mb-xl-3"><i className="ai-bell text-primary lead pe-1 me-2" />
          <h2 className="h4 mb-0">Notifications</h2>
          <button className="btn btn-sm btn-outline-secondary ms-auto" type="button" data-bs-toggle="checkbox" data-bs-target="#checkboxList">Toggle all</button>
        </div>
        <div id="checkboxList">
          <div className="form-check form-switch d-flex pb-md-2 mb-4">
            <input className="form-check-input flex-shrink-0" type="checkbox" defaultChecked id="article-published" />
            <label className="form-check-label ps-3 ps-sm-4" htmlFor="article-published"><span className="h6 d-block mb-2">Article complete notifications</span><span className="fs-sm text-muted">Send an email when my article is get published</span></label>
          </div>
          <div className="form-check form-switch d-flex pb-md-2 mb-4">
            <input className="form-check-input flex-shrink-0" type="checkbox" defaultChecked id="article-update" />
            <label className="form-check-label ps-3 ps-sm-4" htmlFor="article-update"><span className="h6 d-block mb-2">Article update notifications</span><span className="fs-sm text-muted">Send an email when my article is updated</span></label>
          </div>
          <div className="form-check form-switch d-flex pb-md-2 mb-4">
            <input className="form-check-input flex-shrink-0" type="checkbox" id="article-comment" />
            <label className="form-check-label ps-3 ps-sm-4" htmlFor="article-comment"><span className="h6 d-block mb-2">Article comment notifications</span><span className="fs-sm text-muted">Send an email when someone comments on one of my articles</span></label>
          </div>
          <div className="form-check form-switch d-flex pb-md-2 mb-4">
            <input className="form-check-input flex-shrink-0" type="checkbox" defaultChecked id="article-review" />
            <label className="form-check-label ps-3 ps-sm-4" htmlFor="article-review"><span className="h6 d-block mb-2">Product review notifications</span><span className="fs-sm text-muted">Send an email when someone leaves a review with his/her rating</span></label>
          </div>
        </div>
        <div className="form-check form-switch d-flex">
          <input className="form-check-input flex-shrink-0" type="checkbox" disabled id="daily-summary" />
          <label className="form-check-label opacity-100 ps-3 ps-sm-4" htmlFor="daily-summary"><span className="h6 text-muted d-block mb-2">Daily summary emails<span className="badge bg-faded-danger text-danger ms-3">Only for premium</span></span><span className="fs-sm text-muted">Send an email when someone leaves a review with his/her rating</span></label>
        </div>
      </div>
    </section>
  );
};

export default NotificationsSetting;