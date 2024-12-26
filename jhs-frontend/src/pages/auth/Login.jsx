/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { login } from '../../store/auth/actions';
import LoginButton from '../../components/button/Button';
import ErrResponse from '../../components/common/form/ErrResponse';
import Toast from '../../components/Notification/Toasts';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const err = useSelector((state) => state.general.errors);
  // Data

  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({ reValidateMode: 'onChange' });

  const LoginHandle = (formData) => {
    let data = {
      email: formData.email,
      password: formData.password,
    }

    dispatch(
      login({
        body: { ...data },
        options: { __module: 'auth', loader: true, btnLoader: true },
      })
    );
  }

  useEffect(() => {
    if (auth && auth?.user && auth?.user.id) {
      navigate('/main/dashboard');
    }
  }, [auth]);
  return (
    <>
      <main className="page-wrapper">
        <Toast />
        {/* Page content*/}
        <div className="d-lg-flex position-relative" style={{ height: '100vh' }}>
          {/* Home button*/}
          <Link className="text-nav btn btn-icon bg-light border rounded-circle position-absolute top-0 end-0 p-0 mt-3 me-3 mt-sm-4 me-sm-4" to="/" title="Back to home"><i className="ai-home" /></Link>

          {/* Sign in form*/}
          <div className="d-flex flex-column align-items-center w-lg-50 px-3 px-lg-5 pt-5" style={{ height: '100vh' }}>
            <div className="w-100 mt-auto" style={{ maxWidth: '526px' }}>
              <h1>Sign in to get start</h1>
              <p className="pb-3 mb-3 mb-lg-4">Don't have an account yet?&nbsp;&nbsp;<Link to='/signup'>Register here!</Link></p>
              <ErrResponse />
              <form className="needs-validation" onSubmit={handleSubmit(LoginHandle)}>
                <div className="pb-3 mb-3">
                  <div className="position-relative"><i className={` ${errors.email ? '' : 'ai-mail fs-lg position-absolute top-50 start-0 translate-middle-y ms-3'}  `} />
                    <input className={`form-control form-control-lg ps-5 ${errors.email ? 'is-invalid' : ''}`}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: 'Please enter a valid email',
                        },
                      })}
                      type="email"
                      placeholder="Email address" />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="position-relative"><i className={`${errors.password ? '' : 'ai-lock-closed fs-lg position-absolute top-50 start-0 translate-middle-y ms-3'}`} />
                    <div className="password-toggle">
                      <input className={`form-control form-control-lg ps-5 ${errors.password ? 'is-invalid' : ''}`}
                        {...register('password', {
                          required: 'Password is required',
                        })}
                        type="password"
                        placeholder="Password" />
                      <div className="invalid-feedback">{errors.password?.message}</div>
                      <label className="password-toggle-btn" aria-label="Show/hide password">
                        <input className="password-toggle-check" type="checkbox" /><span className="" />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-wrap align-items-center justify-content-between pb-4">
                  <form-check className="my-0">
                  </form-check><Link className="fs-sm fw-semibold text-decoration-none my-0" to='/forget-password'>Forgot password?</Link>
                </div>
                <LoginButton type="submit" className="btn btn-lg btn-primary w-100 mb-4" title="Login" />
              </form>
            </div>
            {/* Copyright*/}
            <p className="w-100 fs-sm pt-5 mt-auto mb-5" style={{ maxWidth: '526px' }}><span className="text-muted">© All rights reserved. Made by</span><Link className="nav-link d-inline-block p-0 ms-1" to="https://onnmed.com/" target="_blank" rel="noopener">ONNMED LLC</Link></p>
          </div>
          {/* Cover image*/}
          <div className="w-50 bg-size-cover bg-repeat-0 bg-position-center" style={{ backgroundImage: 'url(assets/img/account/cover.jpg)' }} />
        </div>
      </main>
      <a className="btn-scroll-top" href="#top" data-scroll>
        <svg viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <circle cx={20} cy={20} r={19} fill="none" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit={10} />
        </svg><i className="ai-arrow-up" /></a>
    </>
  );
};

export default Login;
