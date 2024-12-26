/* eslint-disable */
/* eslint-disable no-unused-expressions */
/* eslint-disable arrow-body-style */
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { register as registerUser } from '../../store/auth/actions';

const SignUp = () => {
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({ mode: 'onChange' });

  const registerHandle = (formData) => {
    let data = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirm_password,
      role: 'member',
    }
    dispatch(
      registerUser({
        body: { ...data },
        options: { __module: 'auth', btnLoader: true },
      })
    );
  }

  return (
    <>
      <main className="page-wrapper">
        {/* Page content*/}
        <div className="d-lg-flex position-relative" style={{ height: '100vh' }}>
          {/* Home button*/}
          <Link className="text-nav btn btn-icon bg-light border rounded-circle position-absolute top-0 end-0 p-0 mt-3 me-3 mt-sm-4 me-sm-4" to="/" title="Back to home"><i className="ai-home" /></Link>

          {/* Sign up form*/}
          <div className="d-flex flex-column align-items-center w-lg-50 px-3 px-lg-5 pt-5" style={{ height: '100vh' }}>
            <div className="w-100 mt-auto" style={{ maxWidth: '526px' }}>
              <h1>No account? Sign up</h1>
              <p className="pb-3 mb-3 mb-lg-4">Have an account already?&nbsp;&nbsp;<Link to='/login'>Sign in here!</Link></p>
              <form className="needs-validation" onSubmit={handleSubmit(registerHandle)}>
                <div className="row row-cols-1 row-cols-sm-2">
                  <div className="col mb-4">
                    <div className="position-relative"><i className="ai-user fs-lg position-absolute top-50 start-0 translate-middle-y ms-3" />
                      <input className={`form-control form-control-lg ps-5 ${errors.name ? 'is-invalid' : ''}`}
                        {...register('name', {
                          required: 'name is required',
                        })}
                        type="text"
                        placeholder="name" required />
                      <div className="invalid-feedback">{errors.name?.message}</div>
                    </div>
                  </div>
                  <div className="col mb-4">
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
                </div>
                <div className="password-toggle mb-4">
                  <div className="position-relative"><i className="ai-lock-closed fs-lg position-absolute top-50 start-0 translate-middle-y ms-3" />
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
                <div className="password-toggle mb-4">
                  <div className="position-relative"><i className="ai-lock-closed fs-lg position-absolute top-50 start-0 translate-middle-y ms-3" />
                    <div className="password-toggle">
                      <input className={`form-control form-control-lg ps-5 ${errors.confirm_password ? 'is-invalid' : ''}`}
                        {...register('confirm_password', {
                          required: 'Password is required',
                        })}
                        type="password"
                        placeholder="Password" required />
                      <div className="invalid-feedback">{errors.confirm_password?.message}</div>
                      <label className="password-toggle-btn" aria-label="Show/hide password">
                        <input className="password-toggle-check" type="checkbox" /><span className="password-toggle-indicator" />

                      </label>
                    </div>
                  </div>
                </div>
                <div className="pb-4">
                  <div className="form-check my-2">
                    <input className="form-check-input" type="checkbox" id="terms" />
                    <label className="form-check-label ms-1" htmlFor="terms">I agree to <a href="#">Terms &amp; Conditions</a></label>
                  </div>
                </div>
                <button className="btn btn-lg btn-primary w-100 mb-4" type="submit">Sign up</button>
              </form>
            </div>
            {/* Copyright*/}
            <p className="w-100 fs-sm pt-5 mt-auto mb-5" style={{ maxWidth: '526px' }}><span className="text-muted">© All rights reserved. Made by</span><a className="nav-link d-inline-block p-0 ms-1" href="https://onnmed.com/" target="_blank" rel="noopener">ONNMED LLC</a></p>          </div>
          {/* Cover image*/}
          <div className="w-50 bg-size-cover bg-repeat-0 bg-position-center" style={{ backgroundImage: 'url(assets/img/account/cover.jpg)' }} />
        </div>
      </main>
    </>
  );
};

export default SignUp;
