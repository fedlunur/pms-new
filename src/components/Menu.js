import React from "react";
import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <div>
      <aside className="main-sidebar px-4" style={{background:'#1e293b',width:270}}>
      <div class="flex justify-between mb-10 pr-3 sm:px-2 py-4 mt-1"><button class="lg:hidden text-slate-500 hover:text-slate-400" aria-controls="sidebar" aria-expanded="false"><svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></svg></button><a aria-current="page" class="block active" href="/"> <img src="/dist/img/pms.png" height="30" alt="Logo"/>   </a></div>
        <div className="sidebar">
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item menu-open">
                <Link to="/dashboard" className="nav-link bg-black">
                  <i className="nav-icon fas fa-tachometer-alt fill-current text-indigo-600" />
                  <p className="text-white-600 font-medium">
                    Dashboard
                  </p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/projectsDashboard" className="nav-link">
                  <i className="nav-icon fas fa-chart-pie" />
                  <p className="text-light font-medium">
                    Projects
                  </p>
                </Link>
              </li>
              <li className="nav-header text-xs uppercase text-slate-500 font-bold pl-3">Tasks</li>
              <li className="nav-item">
                <Link to="/calendar" className="nav-link">
                  <i className="nav-icon far fa-calendar-alt " />
                  <p className="text-light font-medium">
                   Calendar
                  </p>
                </Link>
                <Link to="/taskdt" className="nav-link">
                  <i className="nav-icon fas fa-calendar" />
                  <p className="text-light font-medium">
                    Task List
                  </p>
                </Link>
              </li>
              <li className="nav-header text-xs uppercase text-slate-500 font-bold pl-3">Teams</li>
              <li className="nav-item">
                {/* <Link to="/membersandchat" className="nav-link">
                  <i className="nav-icon fa fa-users"></i>
                  <p className="text-light font-medium">Members</p>
                </Link> */}
              </li>
              <li className="nav-item">
                <Link to="/attachments" className="nav-link">
                  <i className="nav-icon fa fa-paperclip" />
                  <p className="text-light font-medium">Attachments</p>
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
