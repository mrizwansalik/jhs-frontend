/* eslint-disable */
import React from 'react';

const DeleteAccount = () => {
  return (
    <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4">
      <div className="card-body">
        <div className="d-flex align-items-center pb-4 mt-sm-n1 mb-0 mb-lg-1 mb-xl-3"><i className="ai-trash text-primary lead pe-1 me-2" />
          <h2 className="h4 mb-0">Delete account</h2>
        </div>
        <div className="alert alert-warning d-flex mb-4"><i className="ai-triangle-alert fs-xl me-2" />
          <p className="mb-0">When you delete your account, your public profile will be deactivated immediately. If you change your mind before the 14 days are up, sign in with your email and password, and we'll send a link to reactivate account.</p>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="confirm" />
          <label className="form-check-label text-dark fw-medium" htmlFor="confirm">Yes, I want to delete my account</label>
        </div>
        <div className="d-flex flex-column flex-sm-row justify-content-end pt-4 mt-sm-2 mt-md-3">
          <button className="btn btn-danger" type="button"><i className="ai-trash ms-n1 me-2" />Delete account</button>
        </div>
      </div>
    </section>
  );
};

export default DeleteAccount;