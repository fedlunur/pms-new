import React, { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { useHistory } from "react-router-dom";
import swal from "sweetalert2";
import config from "../config";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );

  const [roles, setRoles] = useState(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? jwtDecode(tokens).role : null;
  });

  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    setRoles(null);
    localStorage.removeItem("authTokens");
    history.push("/login");
    swal.fire({
      title: "You have been logged out...",
      icon: "success",
      toast: true,
      timer: 2000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const loginUser = async (email, password) => {
    try {
      const response = await fetch(`${config.baseURL}/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();

      if (response.status === 200) {
        setAuthTokens(data);
        const decodedToken = jwtDecode(data.access);
        setUser(decodedToken);
        setRoles(decodedToken.role);
        localStorage.setItem("authTokens", JSON.stringify(data));
        history.push("/dashboard");
        swal.fire({
          title: "Login Successful",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        swal.fire({
          title: "Username or password does not exist",
          icon: "error",
          toast: true,
          timer: 3000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      swal.fire({
        title: "Unable to fetch data. Please check your network connection or try again later.",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "center",
        timerProgressBar: true,
        showConfirmButton: true,
      });
    }
  };
  const registerUser = async (first_name,middle_name,last_name,email, password, password2) => {

    try {
      const response = await fetch(`${config.baseURL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name,
          middle_name,
          last_name,
          email,
        
          password,
          password2,
        }),
      });
      if (response.status === 201) {
        history.push("/login");
        swal.fire({
          title: "Registration Successful, Login Now",
          icon: "success",
          toast: true,
          timer: 2000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        swal.fire({
          title: `An Error Occurred ${response.status}`,
          icon: "error",
          toast: true,
          timer: 2000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      swal.fire({
        title: "Unable to fetch data. Please check your network connection or try again later.",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  useEffect(() => {
    const refreshTokens = async () => {
      try {
        const response = await fetch(`${config.baseURL}/token/refresh/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: authTokens?.refresh,
          }),
        });

        const data = await response.json();

        if (response.status === 200) {
          setAuthTokens(data);
          localStorage.setItem("authTokens", JSON.stringify(data));
          const decodedToken = jwtDecode(data.access);
          setUser(decodedToken);
          setRoles(decodedToken.role);
        } else {
          logoutUser();
        }
      } catch (error) {
        logoutUser();
        swal.fire({
          title: "Unable to refresh token. Please check your network connection or try again later.",
          icon: "error",
          toast: true,
          timer: 3000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
      setLoading(false);
    };

    if (authTokens) {
      const interval = setInterval(refreshTokens, 15 * 60 * 1000); // Refresh every 15 minutes
      return () => clearInterval(interval); // Cleanup on unmount
    } else {
      setLoading(false);
    }
  }, [authTokens]); // No dependency on logoutUser

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    roles,
    registerUser,
    loginUser,
    logoutUser,
  };

  useEffect(() => {
    if (authTokens) {
      const decodedToken = jwtDecode(authTokens.access);
      setUser(decodedToken);
      setRoles(decodedToken.role);
    }
    setLoading(false);
  }, [authTokens]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};