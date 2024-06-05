import React from "react";
import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="index3.html" className="brand-link">
          <img
            src="dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">PMS</span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src="dist/img/user2-160x160.jpg"
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
          {/* SidebarSearch Form */}

          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
              <li className="nav-item menu-open">
                <Link to="/dashboard" className="nav-link active">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>
                    Dashboard
                    <i className="right fas fa-angle-left" />
                  </p>
                </Link>
            
              </li>

              <li className="nav-item">
                <Link to="/projectsDashboard" className="nav-link">
                  <i className="nav-icon fas fa-chart-pie" />
                  <p>
                    Projects
                    <i className="right fas fa-angle-left" />
                  </p>
                </Link>
              </li>

              <li className="nav-header">Tasks</li>
              <li className="nav-item">
                <Link to="/timetable" className="nav-link">
                  <i className="nav-icon far fa-calendar-alt " />
                  <p>
                    Events
                    <i className="right fas fa-angle-left" />
                  </p>
                </Link>
                <Link to="/taskdt" className="nav-link">
                  <i className="nav-icon fas fa-chart-pie" />
                  <p>
                    Tasks
                    <i className="right fas fa-calendar-alt " />
                  </p>
                </Link>
              </li>
              <li className="nav-header">Teams</li>
              <li className="nav-item">
                <Link to="/membersandchat" className="nav-link">
                  <i className="nav-icon far fa-person-alt" />
                  <p>Members</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/attachments" className="nav-link">
                  <i className="nav-icon far fa-person-alt" />
                  <p>Attachments</p>
                </Link>
                <Link to="/charts" className="nav-link">
                  <i className="nav-icon far fa-person-alt" />
                  <p>Charts</p>
                </Link>
                
              </li>

              
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  );
}
