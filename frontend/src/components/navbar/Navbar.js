import React, { useEffect, useState } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import validateToken from "../auth/tokenValidator";
import axios from "axios";

export default function Navbar() {
  const [tokenIsActive, setTokenIsActive] = useState();
  const [user, setUser] = useState();

  const fetchUserDetails = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER}/Auth/get-me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          // 'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setTokenIsActive(validateToken());
    fetchUserDetails();
  }, []);

  if (tokenIsActive) {
    return (
      <nav className="nav">
        <Link to="/" className="site-title">
          Apex
        </Link>
        <ul>
          <CustomLink to="/feed">Feed</CustomLink>
          <CustomLink to="/about">About</CustomLink>
          <CustomLink to={"/"} onClick={logout}>
            Logout
          </CustomLink>
          {user && <CustomLink to="/profile">{user.name}</CustomLink>}
        </ul>
      </nav>
    );
  } else {
    return (
      <nav className="nav">
        <Link to="/" className="site-title">
          Apex
        </Link>
        <ul>
          <CustomLink to="/about">About</CustomLink>
          <CustomLink to="/register">Register</CustomLink>
          <CustomLink to="/login">Login</CustomLink>
        </ul>
      </nav>
    );
  }
}

function CustomLink({ to, children, onClick, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props} onClick={onClick}>
        {children}
      </Link>
    </li>
  );
}

function logout() {
  localStorage.clear();
  window.location.reload(true);
}
