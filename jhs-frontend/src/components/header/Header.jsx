/* eslint-disable no-nested-ternary */
/* eslint-disable */
import { logout } from '../../store/auth/actions';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getProfile } from '../../store/profile/actions'
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = JSON.parse(localStorage.getItem('auth'));
  const user = useSelector((state) => state.profile.profile);
  useEffect(() => {
    if (auth) {
      dispatch(
        getProfile({
          body: {},
          options: { __module: 'profile' },
        }))
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <header className="navbar navbar-expand-lg fixed-top">
        <div className="container">
          <Link className="navbar-brand pe-sm-3" to="/">
            <span className="text-primary flex-shrink-0 me-2">
              <svg xmlns="http://www.w3.org/2000/svg" width={200} xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 255.64 87.92">
                <defs>
                  <linearGradient id="a4277143-582f-4bf7-b08c-b9bcb467f452" x1="50.21" y1="88.36" x2="57.29" y2="-2.65" gradientUnits="userSpaceOnUse">
                    <stop offset="0.14" stopColor="#022a72" />
                    <stop offset="0.74" stopColor="#176fdd" />
                  </linearGradient>
                </defs>
                <g id="be0d6160-1eaf-41da-8491-faa4fea1b0d8" data-name="Layer 2">
                  <g id="ea2362e4-5d9a-4a0d-8fa4-b1301b0a90f5" data-name="Layer 1">
                    <path d="M12.25,4.15c1.88.94,1.5.53,2.95,2.18a22.5,22.5,0,0,1,2.47,3c-1.19,1.31-1.32.41-2.26,2.31-.84,1.73-1.1,1-3.1,1.45C9.76,13.65,10,17.3,7.1,17.3c-1.61,0-5.72-2.36-5.72.57,0,1,.34,1.85-.12,2.71C.68,21.69.1,21.3,0,22.73c1.2.78,5,2.33,6.2,5.37l.33.75.18,0,0,.07L33,26.19c4.28-.38,6.64,1.32,6.19,4.6-.16,2.46,2.78,3.41,4.7,3.46a.36.36,0,0,1,.33.25.36.36,0,0,1-.11.4c-1.77,1.48-3.65,2.41-6.16,0a.32.32,0,0,0-.29-.1.32.32,0,0,0-.27.16c-1.64,2.75-3.23,5.7-4.9,8.52A3.82,3.82,0,0,1,27.71,45l-.06,0,8.62-11.13a0,0,0,0,0,0-.05h-.05c-2.86,2.85-5.79,5.81-8.67,8.69a3.46,3.46,0,0,1-4.4.44c-.25-.17-.51-.34-.78-.49L35,32.37s0,0,0,0a0,0,0,0,0,0,0c-3.87,2.5-7.75,5.23-11.62,7.83a5.28,5.28,0,0,1-6.89-.82L16.13,39l18.28-8.51s0,0,0,0,0,0,0,0c-4.08,1.35-18.86,9.7-22.82,6.11.21.38.41.76.61,1.15h-.13l.47.67q.66,1.32,1.26,2.73c.16.44.32.85.49,1.22h0c2.64,5.91,6,4.78,8.55,12.21.69,2,0,2.6,0,4.28,0,.56.42,1.46.55,2.3a9.39,9.39,0,0,0,3.44,5.72c2.28,1.54,3.31.57,6.22,5.78,1.89,8,6.36,8.32,6.85,11.17.46,1,1.38,1.87,1.73,2.84.25.68,0,.59.37,1.35.58-.35,1.17-.78,1.71-1.15.1-2.65-.78-4,.86-5.14,2.29.37.39,1,5.16.86,2.34,0,3-.66,5.29.12a11.92,11.92,0,0,0,5.29.72c2.35-.17,1.48.46,3.31,2,2.26-.5,1.35-1.34,4.1-4.86a9.07,9.07,0,0,1,2.08-2.22,22.87,22.87,0,0,1,3-1.59c1.59-.8,1.42-.62,3.47-.82A75.79,75.79,0,0,0,94.64,72c10.25-3.22,10.44-.35,11.37-7.46.32-1.1,1.9-6.13,1.9-6.78s-2.57-2-2.55,1.59c0,.9,0,1.8,0,2.7h-9.9c0-1.33.42-3.64-.34-4.75l-4.52-.13c0-4.22.79-4.38-1.53-7.71a20.1,20.1,0,0,1-3-6.11h-.57c-.27,1-.11.64-.86,1.14-2.3-.61-2.7-3.69-3.86-5.44l-.16-.26-.64-1.22c-6.24-.71-16.16-6.13-19.43-7.22l-.05,0s0,0,0,.05l19,8.86c-.12.12-.25.25-.37.39a5.51,5.51,0,0,1-7.17.85c-4-2.71-8.07-5.56-12.1-8.15,0,0,0,0-.05,0a0,0,0,0,0,0,0L73,42.91c-.28.16-.55.33-.82.51A3.59,3.59,0,0,1,67.61,43c-3-3-6-6.09-9-9a0,0,0,0,0,0,0s0,0,0,0l9,11.59-.07,0a4,4,0,0,1-5-1.65c-1.74-2.95-3.39-6-5.1-8.88a.38.38,0,0,0-.28-.17.4.4,0,0,0-.31.11c-2.6,2.54-4.56,1.57-6.41,0a.38.38,0,0,1-.12-.41.37.37,0,0,1,.35-.26c2-.06,5.06-1,4.89-3.61-.47-3.41,2-5.19,6.45-4.79l12.74,1.32-.08-.17c-.79-1.69-1.38.57-2.09-1.7a13.87,13.87,0,0,0-.76-2.67c-1.19-2.16-2.5-2.29-4.85-2.29-.93,0-.59-.56-1-1.27-.82-1.4-2.43-.65-6.32-1.15-6.9-.88-6.41.94-11.32-3.52-1-.85-1.85-1.59-2.79-2.35C43.54,10.65,41.92,9.25,40,7.61a36.81,36.81,0,0,0-5.86-3.86C32.26,2.65,26-.89,23.45.21L19.66,1.55C17.85,2,13.16,3,12.25,4.15ZM77.79,33.39,61.33,28.73a.05.05,0,0,1,0-.05s0,0,0,0c5.42,1,10.84,2.41,15.69,3.27l.76,1.46Zm-68.5-.74c6.16.55,15.23-2.13,24.27-3.87a0,0,0,0,1,0,0s0,0,0,0c-7,2-15.71,4.45-22.69,6.44-.52-.9-1.06-1.78-1.6-2.63ZM52.16,58.81A12.49,12.49,0,0,0,48.31,57a19.81,19.81,0,0,0,3.32-1.22c.85-.49.16-1.39-.94-1.84-6.43-2.12-16.54-3.31-15.42-11.63a5.83,5.83,0,0,1,6.5-4.86c1.52.35,3.5,1.68,3.46,3.29,0,.9-.91,1.06-1.92,1.09s-3.26-.39-4.17.28c-1.08.79-.92,2.78,1.27,4.54,4.68,3.32,10.7,3.39,14,6.3,1.71,1.4.78,4.88-2.28,5.87ZM42.57,39.24a.54.54,0,1,1-.54.53.53.53,0,0,1,.54-.53Zm5,21.58c-2.37-1-5.3-1.44-7.09-2.88-2.22-2.09-1.82-4.63.62-6.15,1.37.49,2.84,1.07,4.21,1.56-1.43.4-3.56,1.54-1.41,2.41,2.42,1,4.81,1.44,6.94,2.9a4.16,4.16,0,0,1,.85,7.06,6.69,6.69,0,0,0-3-2c2.09-.84,1.8-2-1.1-2.92Zm2.53,8.9L48,68.47c.87-.76,1.19-1.33.3-1.47-3.61-.58-6.56-1.42-7.4-3.76a3.49,3.49,0,0,1,1.38-3.64l3.65,1.22c-1.45.6-2.11,1.35-1.65,2.29.66.81,3.69,1,5.54,1.5,2.23.7,2.63,3.25.34,5.11Zm-1.64,6.65-.93-.85c1.05-1.75.76-3.48-.65-4-4.54-1.56-4.32-3.16-4.17-5.4,1,.23,1.93.56,2.92.74l-.18.59c-.21.68,4.78,1.74,5.08,4a5.1,5.1,0,0,1-2.07,4.94Zm-4.68-5.53,2.41,1c-.16,2.47,1,4.18,2.53,5.72a.23.23,0,0,1,0,.31.26.26,0,0,1-.3.1c-3-1.25-5.07-3.23-4.67-7.09ZM46.43,61l1.29.36v2.51l-1.29-.35V61Zm-.53-7.76L48,54.1v2.77L45.9,56V53.24ZM47.22,26a4.14,4.14,0,0,1,4,4,3.69,3.69,0,0,1-2.46,3.66l-.25,15.57-2.26-.66L46,33.71A3.77,3.77,0,0,1,43.26,30a4.11,4.11,0,0,1,4-4Zm5.87,24.84-4.54-1.61a19.5,19.5,0,0,0,5.13-2.59C55.87,44.88,56,42.89,55,42.1c-.9-.67-3-.27-4.17-.28s-1.88-.19-1.92-1.09c0-1.61,1.94-2.94,3.46-3.29a5.81,5.81,0,0,1,6.5,4.86c.62,4.52-2.09,6.94-5.73,8.54Zm-1.45-11.6a.54.54,0,1,1-.54.53A.53.53,0,0,1,51.64,39.24Z" style={{ fillRule: 'evenodd', fill: 'url(#a4277143-582f-4bf7-b08c-b9bcb467f452)' }} />
                    <path d="M92.39,16.72H100v9.52h0a6.72,6.72,0,0,1-13.43,0h2.82a3.89,3.89,0,0,0,7.77,0V19.55H92.39V16.72ZM136,16.8h8.41A5.25,5.25,0,0,1,145,27.09l4.81,5.34h-3.52l-4.73-5.23h-2.71v5.23H136V16.8Zm2.84,2.84v5h5.28c1.2,0,2.06-1.4,2.06-2.51s-.86-2.5-2-2.5Zm89.59-2.81v2.84h-7.92V24h7.92v2.84h-7.92v5.59h-2.84V16.83h10.76Zm-53.58,0h0l6.87,15.63h-2.84l-1.27-2.88h-8.37L168,32.46h-2.84L172,16.83h2.83Zm1.52,9.91-2.93-6.68-2.94,6.68Zm6.9-9.91h2.84v12.8h8.12v2.83h-11V16.83Zm24.56,2.46a5.23,5.23,0,0,1,5.05,5.4,5.07,5.07,0,1,1-10.11,0,5.24,5.24,0,0,1,5.06-5.4Zm0-3A8.11,8.11,0,0,0,200,24.69a7.84,7.84,0,1,0,15.65,0,8.11,8.11,0,0,0-7.82-8.37ZM151,16.83h2.43L161,26.67V16.83h2.84V32.46h-1.9l-8.07-11v11H151V16.83ZM119.79,21.6v4.64h0a6.72,6.72,0,0,0,13.43,0h0V16.83h-2.84v9.41h0a3.89,3.89,0,0,1-7.78,0V16.83h-2.84V21.6ZM110,19.29a5.23,5.23,0,0,1,5.05,5.4,5.07,5.07,0,1,1-10.11,0,5.24,5.24,0,0,1,5.06-5.4Zm0-3a8.11,8.11,0,0,0-7.83,8.37,7.84,7.84,0,1,0,15.65,0A8.11,8.11,0,0,0,110,16.32Z" style={{ fill: '#186fe0', fillRule: 'evenodd' }} />
                    <path d="M244.32,36.64h11.32v2.84h-8.48v3.64h8.48V46h-8.48v3.48h8.48v2.84H244.32V36.64ZM122.58,46.08H115v6.19h-2.84V36.64H115v6.61h7.56V36.64h2.84V52.27h-2.84V46.08Zm83.59-9.54a8.34,8.34,0,0,1,5.63,2.17L210,40.78a5.55,5.55,0,0,0-3.81-1.51,5.32,5.32,0,1,0,0,10.63A5.52,5.52,0,0,0,210,48.33l2,1.89a8.36,8.36,0,0,1-5.88,2.41,8,8,0,1,1,0-16.09ZM193,46.08h-7.56v6.19h-2.84V36.64h2.84v6.61H193V36.64h2.84V52.27H193V46.08ZM176,39.48V52.27h-2.84V39.48H168.3V36.64h12.46v2.84Zm-6.34,10h-8.12V36.64h-2.84V52.27h11V49.43ZM128.16,36.64h11.32v2.84H131v3.64h8.48V46H131v3.48h8.48v2.84H128.16V36.64Zm21.68,0h0l6.88,15.63h-2.84l-1.27-2.89h-8.37L143,52.27h-2.84L147,36.64h2.84Zm1.52,9.9-2.94-6.68-2.93,6.68Zm69.95-9.9h-2.84L211.6,52.27h2.84l1.27-2.89h8.37l1.27,2.89h2.84l-6.88-15.63Zm1.52,9.9H217l2.93-6.68,2.94,6.68Zm6.62-9.9h8.41a5.25,5.25,0,0,1,.58,10.29l4.81,5.34h-3.52L235,47h-2.71v5.23h-2.84V36.64Zm2.84,2.84v5h5.28c1.2,0,2.06-1.39,2.06-2.51s-.86-2.49-2-2.49Z" style={{ fill: '#062a76', fillRule: 'evenodd' }} />
                    <path d="M141.1,55.63a8.31,8.31,0,0,1,5.63,2.17l-1.84,2.07a5.48,5.48,0,0,0-3.81-1.52,5.32,5.32,0,1,0,0,10.64A5.45,5.45,0,0,0,145,67.41l2,1.9a8.32,8.32,0,0,1-5.87,2.41,8,8,0,1,1,0-16.09ZM224.64,58l-2.18,1.23c-2.07-2.05-4.81-2.48-6.14-1.1-1.23,1.54-.45,2.84,1,3.17,2.91.89,7.16.26,7.88,4.45.67,3.5-2.1,6.16-6.59,6-4,0-5.49-1.74-6.44-3.75l2.13-1.35A5.34,5.34,0,0,0,219.22,69c2.32-.07,3.22-1.11,3.12-2.55-.12-1.92-2.82-1.93-4.53-2.16-4.31-.37-5.61-3.37-4.91-6.05.76-2.49,3.45-3.71,7.32-3.29a5.85,5.85,0,0,1,4.42,3Zm-94.08,0-2.18,1.23c-2.07-2.05-4.81-2.48-6.13-1.1-1.24,1.54-.46,2.84,1,3.17,2.9.89,7.15.26,7.88,4.45.66,3.5-2.11,6.16-6.6,6-4,0-5.49-1.74-6.44-3.75l2.14-1.35A5.33,5.33,0,0,0,125.14,69c2.33-.07,3.22-1.11,3.12-2.55-.11-1.92-2.81-1.93-4.52-2.16-4.32-.37-5.61-3.37-4.92-6.05.76-2.49,3.45-3.71,7.32-3.29a5.83,5.83,0,0,1,4.42,3Zm60.85-2.34A8.28,8.28,0,0,1,197,57.8l-1.83,2.07a5.5,5.5,0,0,0-3.81-1.52,5.32,5.32,0,1,0,0,10.64,5.48,5.48,0,0,0,3.87-1.58l2,1.9a8.32,8.32,0,0,1-5.87,2.41,8,8,0,1,1,0-16.09Zm7.21,0h11.31v2.84h-8.47v3.64h8.47V65h-8.47v3.47h8.47v2.84H198.62V55.68Zm-30.4,0h2.44l7.53,9.84V55.68H181V71.31h-1.9l-8.07-11v11h-2.84V55.68Zm-14.29,0h11.32v2.84h-8.48v3.64h8.48V65h-8.48v3.47h8.48v2.84H153.93V55.68Zm-5.39,0h2.84V71.31h-2.84Z" style={{ fill: '#186fe0', fillRule: 'evenodd' }} />
                  </g>
                </g>
              </svg>
            </span>
          </Link>
          <div className="order-lg-2 me-3 me-lg-4 ms-auto">
            {auth && auth.user && auth.authenticated ?
              <div className="dropdown nav d-sm-block">
                <a className="nav-link d-flex align-items-center p-0" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                  <img
                    className="border rounded-circle"
                    src={`${user?.file ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${user?.file}` : '/assets/img/avatar/user.png'}`}
                    style={{
                      width: 48,
                      height: 48,
                    }}
                    alt={`${user?.full_name} Profile Image`}
                  />
                  <div className="ps-2 d-none d-sm-block">
                    <div className="fs-xs lh-1 opacity-60">Hello,</div>
                    <div className="fs-sm dropdown-toggle">{user?.full_name ?? user?.email}</div>
                  </div>
                </a>
                <div className="dropdown-menu dropdown-menu-end my-1">
                  <h6 className="dropdown-header fs-xs fw-medium text-muted text-uppercase pb-1">
                    Account</h6>
                  <Link to='/main/dashboard' className="dropdown-item">
                    <i className="ai-home fs-lg opacity-70 me-2" />Dashboard
                  </Link>
                  <Link to='/system' className="dropdown-item">
                    <i className="ai-user-check fs-lg opacity-70 me-2" />Overview
                  </Link>
                  <Link to='/system/settings' className="dropdown-item" >
                    <i className="ai-settings fs-lg opacity-70 me-2" />
                    Settings
                  </Link>
                  <a className="dropdown-item" href="#">
                    <i className="ai-wallet fs-base opacity-70 me-2 mt-n1" />Billing
                  </a>
                  <div className="dropdown-divider" />
                  <h6 className="dropdown-header fs-xs fw-medium text-muted text-uppercase pb-1">Dashboard</h6>
                  <Link to='/main/dashboard/article/publish' className="dropdown-item" >
                    <i className="ai-cart fs-lg opacity-70 me-2" />
                    Articles
                  </Link>
                  <Link to='/main/dashboard/review' className="dropdown-item" >
                    <i className="ai-activity fs-lg opacity-70 me-2" />
                    Reviews
                  </Link>
                  <Link to='/main/chat' className="dropdown-item d-flex align-items-center"><i className="ai-messages fs-lg opacity-70 me-2" />Chat</Link>
                  <Link to='/main/dashboard/metrics' className="dropdown-item" >
                    <i className="ai-heart fs-lg opacity-70 me-2" />States
                  </Link>
                  <div className="dropdown-divider" /><a onClick={handleLogout} className="dropdown-item"><i className="ai-logout fs-lg opacity-70 me-2" />Sign out</a>
                </div>
              </div>
              :
              <Link to='/login' className="btn btn-primary btn-sm fs-sm d-sm-inline-flex" ><i className="ai-play fs-xl me-2 ms-n1" />Get Started</Link>
            }
          </div>
          <button className="navbar-toggler ms-sm-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"><span className="navbar-toggler-icon" /></button>
          <nav className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav navbar-nav-scroll me-auto">
              <li className="nav-item"><Link className={`nav-link ${(location.pathname === '/' ) ? 'active' : ''}`} to={`/`}>HOME</Link></li>
              <li className="nav-item"><Link className={`nav-link ${(location.pathname === '/articles' ) ? 'active' : ''}`} to={`/articles`}>ISSUES</Link></li>
              <li className="nav-item"><Link className={`nav-link ${(location.pathname === '/authors' ) ? 'active' : ''}`} to={`/authors`}>AUTHORS</Link></li>
              <li className="nav-item"><a className="nav-link" href="#">ABOUT US</a></li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};
export default Header;
