// src/hooks/useRole.js
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const useRole = (requiredRoles) => {
  const { user, roles } = useContext(AuthContext);

  if (!user) {
    return { hasAccess: false, redirect: "/login" };
  }

  const hasAccess = requiredRoles.some(role => roles.includes(role));

  return { hasAccess, roles, user };
};

export default useRole;
