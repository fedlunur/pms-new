import React from "react";
import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import AuthContext from "../context/AuthContext";
import ThemeToggle from '../components/ThemeToggle';
import { Link } from "react-router-dom";

export default function Header() {
  const { user, logoutUser } = useContext(AuthContext);
  const token = localStorage.getItem("authTokens");

  if (token) {
    const decoded = jwtDecode(token);
    var user_id = decoded.user_id;
  }
  return (
    <div>
      <nav className="main-header navbar navbar-expand bg-white sticky top-0 dark:bg-[#182235] border-b border-slate-200 dark:border-slate-700 z-30 py-3">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars text-indigo-600" />
            </a>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="far fa-bell w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80 rounded-full false" />
              <span className="badge badge-warning navbar-badge">15</span>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right hover:bg-slate-50 dark:hover:bg-slate-700/">
              <span className="dropdown-item dropdown-header text-xs font-bold text-slate-400 dark:text-slate-500 uppercase pt-1.5 pb-2 px-3">
                15 Notifications
              </span>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item text-indigo-600">
                <i className="fas fa-envelope mr-2" /> 4 new messages
                <span className="float-right text-muted text-sm">3 mins</span>
              </a>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item  text-indigo-600">
                <i className="fas fa-users mr-2" /> 8 friend requests
                <span className="float-right text-muted text-sm">12 hours</span>
              </a>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item text-indigo-600">
                <i className="fas fa-file mr-2" /> 3 new reports
                <span className="float-right text-muted text-sm">2 days</span>
              </a>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item dropdown-footer">
                See All Notifications
              </a>
            </div>
          </li>
          <div className="flex items-center space-x-3">
          <ThemeToggle />
          </div>
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <div className="user-panel mt-0 pb-3 mb-3 d-flex">
                <div className="image">
                  <img
                    src="dist/img/user-avatar-32.png"
                    className="img-circle elevation-2"
                    alt="User Image"
                  />
                </div>
                <div className="info">
                  <a href="#" className="d-block">
                    Fedlu N.
                  </a>
                </div>
              </div>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span className="dropdown-item dropdown-header">
                Administrator
              </span>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item text-indigo-600">
                <i class="fas fa-user-circle"></i> My Account
              </a>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                <li class="nav-item">
                  <a
                    className="nav-link dropdown-item text-indigo-600"
                    onClick={logoutUser}
                    style={{ cursor: "pointer" }}
                  >
                    <i class="fa fa-sign-out"></i> Logout
                  </a>
                </li>
              </a>
              <div className="dropdown-divider"/>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}
