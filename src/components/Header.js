import React, { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AuthContext from "../context/AuthContext";
import ThemeToggle from '../components/ThemeToggle';
import { Dropdown } from "react-bootstrap";
import useAxios from "../utils/useAxios";
import moment from "moment";

export default function Header() {
  const { user, logoutUser } = useContext(AuthContext);
  const token = localStorage.getItem("authTokens");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const api = useAxios();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications/");
        const sortedNotifications = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setNotifications(sortedNotifications);
        updateUnreadCount(sortedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const updateUnreadCount = (notifications) => {
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadCount(unread);
  };

  const markAsRead = async (id) => {
    const readAt = new Date();
    try {
      await api.patch(`/notifications/${id}/`, { read: true, read_at: readAt });
      const updatedNotifications = notifications.map((n) =>
        n.id === id ? { ...n, read: true, read_at: readAt } : n
      );
      setNotifications(updatedNotifications);
      updateUnreadCount(updatedNotifications);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (token) {
    const decoded = jwtDecode(token);
    var user_id = decoded.user_id;
  }

  return (
    <div>
      <nav className="w-full flex justify-between bg-white sticky top-0 dark:bg-[#182235] border-b border-slate-200 dark:border-slate-700 z-30 py-3">
        <div></div>
        <ul className="flex">
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="far fa-bell w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80 rounded-full false" />
              <span className="badge badge-warning navbar-badge">{unreadCount}</span>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right hover:bg-slate-50 dark:hover:bg-slate-700/">
              <span className="dropdown-item dropdown-header text-xs font-bold text-slate-400 dark:text-slate-500 uppercase pt-1.5 pb-2 px-3">
                {notifications.length} Notifications
              </span>
              <div className="dropdown-divider" />
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`space-y-5 ${!notification.read ? 'cursor-pointer' : ''}`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div
                      className={`relative mx-auto max-w-[400px] rounded-md border border-slate-50 p-4 text-sm shadow-lg ${notification.read ? 'bg-slate-100' : 'bg-white'}`}
                    >
                      <div className="flex space-x-4">
                        <div className="flex-1">
                        <div className="mt-1 text-slate-500">
                            {notification.message} 
                          </div>
                          <h4 className="pr-6 font-medium text-slate-900">
                            {notification.user.username}{" "}
                            <span className="ml-2 font-normal text-slate-500">
                              {moment(notification.timestamp).format("LL")}{" "}
                              <span className="text-slate-400">
                                ({moment(notification.timestamp).fromNow()})
                              </span>
                            </span>
                          </h4>
                         
                          {notification.read && notification.read_at && (
                            <div className="text-slate-400 text-xs">
                              Read {moment(notification.read_at).fromNow()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dropdown-divider" />
              {/* <a href="#" className="dropdown-item dropdown-footer">
                See All Notifications
              </a> */}
            </div>
          </li>
          
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
                    {user && user.username}
                  </a>
                </div>
              </div>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span className="dropdown-item dropdown-header">
                {user && user.username}
              </span>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item text-indigo-600">
                <i className="fas fa-user-circle"></i> My Account
              </a>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                <li className="nav-item">
                  <a
                    className="nav-link dropdown-item text-indigo-600"
                    onClick={logoutUser}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa fa-sign-out"></i> Logout
                  </a>
                </li>
              </a>
              <div className="dropdown-divider" />
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}