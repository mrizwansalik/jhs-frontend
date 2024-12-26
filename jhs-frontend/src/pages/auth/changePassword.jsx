/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { changePassword } from '../../store/auth/actions';

const ChangePassword = () => {

  const dispatch = useDispatch();
  const { userId, token } = useParams();

  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({ mode: 'onChange' });

  const changePasswordHandle = (formData) => {
    let data = {
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      userId,
      token
    }
    dispatch(
      changePassword({
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
          {/* Home button*/}<Link className="text-nav btn btn-icon bg-light border rounded-circle position-absolute top-0 end-0 zindex-2 p-0 mt-3 me-3 mt-sm-4 me-sm-4" to="/" data-bs-toggle="tooltip" data-bs-placement="left" title="Back to home"><i className="ai-home" /></Link>
          {/* Content*/}
          <div className="mt-auto" style={{ maxWidth: '700px' }}>
            <h1 className="pt-3 pb-2 pb-lg-3">Create New Password</h1>
            <p className="pb-2">Change your password in three easy steps. This helps to keep your new password secure.</p>

            <div className="card dark-mode border-0 bg-primary">
              <form className="card-body needs-validation" onSubmit={handleSubmit(changePasswordHandle)}>
                <div className="mb-4">
                  <div className="position-relative">
                    <i className="ai-lock-closed fs-lg position-absolute top-50 start-0 translate-middle-y ms-3" />
                    <div className="password-toggle">
                      <input className={`form-control form-control-lg ps-5 ${errors.password ? 'is-invalid' : ''}`}
                        {...register('password', {
                          required: 'Password is required',
                        })}
                        type="password"
                        placeholder="Password" required />
                      <div className="invalid-feedback">{errors.password?.message}</div>
                      <label className="password-toggle-btn" aria-label="Show/hide password">
                        <input className="password-toggle-check" type="checkbox" /><span className="password-toggle-indicator" />
                      </label>
                    </div>
                  </div>
                </div>
                <div className='mb-4'>
                  <div className="position-relative">
                    <i className="ai-lock-closed fs-lg position-absolute top-50 start-0 translate-middle-y ms-3" />
                    <div className="password-toggle">
                      <input className={`form-control form-control-lg ps-5 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        {...register('confirmPassword', {
                          required: 'Confirm password is required',
                        })}
                        type="password"
                        placeholder="Confirm Password" required />
                      <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                      <label className="password-toggle-btn" aria-label="Show/hide password">
                        <input className="password-toggle-check" type="checkbox" /><span className="password-toggle-indicator" />
                      </label>
                    </div>
                  </div>
                </div>
                <button className="btn btn-light" type="submit">Change Password</button>
              </form>
            </div>
          </div>
          {/* Copyright*/}
          <p className="w-100 fs-sm pt-5 mt-auto mb-5" style={{ maxWidth: '700px' }}><span className="text-muted">© All rights reserved. Made by</span><a className="nav-link d-inline-block p-0 ms-1" href="https://onnmed.com/" target="_blank" rel="noreferrer">ONNMED LLC</a></p>
        </div>
      </main>
    </>
  );
};

export default ChangePassword;