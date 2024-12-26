/* eslint-disable */
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import React from 'react';
import { useDispatch } from 'react-redux';

import { resetPassword } from '../../store/auth/actions';

const ForgetPassword = () => {
  const dispatch = useDispatch();
  // Data

  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({ mode: 'onChange' });

  const resetPasswordHandle = (formData) => {
    let data = {
      email: formData.email,
    }
    dispatch(
      resetPassword({
        body: { ...data },
        options: { __module: 'auth', btnLoader: true },
      })
    );
  }
  return (
    <>
      <main className="page-wrapper">
        {/* Page content*/}
        <div className="d-flex flex-column align-items-center position-relative px-3 pt-5" style={{ height: '100vh' }}>
          {/* Home button*/}
          <Link className="text-nav btn btn-icon bg-light border rounded-circle position-absolute top-0 end-0 zindex-2 p-0 mt-3 me-3 mt-sm-4 me-sm-4" to="/" data-bs-toggle="tooltip" data-bs-placement="left" title="Back to home"><i className="ai-home" /></Link>
          {/* Content*/}
          <div className="mt-auto" style={{ maxWidth: '700px' }}>
            <h1 className="pt-3 pb-2 pb-lg-3">Forgot your password?</h1>
            <p className="pb-2">Change your password in three easy steps. This helps to keep your new password secure.</p>
            <ul className="list-unstyled pb-2 pb-lg-0 mb-4 mb-lg-5">
              <li className="d-flex mb-2"><span className="text-primary fw-semibold me-2">1.</span>Fill in your email address below.</li>
              <li className="d-flex mb-2"><span className="text-primary fw-semibold me-2">2.</span>We'll email you a temporary code.</li>
              <li className="d-flex mb-2"><span className="text-primary fw-semibold me-2">3.</span>Use the code to change your password on our secure website.</li>
            </ul>
            <div className="card dark-mode border-0 bg-primary">
              <form className="card-body needs-validation" onSubmit={handleSubmit(resetPasswordHandle)} >
                <div className="mb-4">
                  <div className="position-relative"><i className="ai-mail fs-lg position-absolute top-50 start-0 translate-middle-y ms-3" />
                    <input className={`form-control form-control-lg ps-5 ${errors.email ? 'is-invalid' : ''}`}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: 'Please enter a valid email',
                        },
                      })}
                      type="email"
                      placeholder="Email address" required />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                  </div>
                </div>
                <button className="btn btn-light" type="submit">Get new password</button>
              </form>
            </div>
          </div>
          {/* Copyright*/}
          <p className="w-100 fs-sm pt-5 mt-auto mb-5" style={{ maxWidth: '700px' }}><span className="text-muted">© All rights reserved. Made by</span><a className="nav-link d-inline-block p-0 ms-1" href="https://onnmed.com/" target="_blank" rel="noopener">ONNMED LLC</a></p>

        </div>
      </main >
    </>
  );
};

export default ForgetPassword;
