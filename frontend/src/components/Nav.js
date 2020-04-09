import { Nav, Navbar, Button, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import React, { Component } from "react";

class NavBar extends React.Component {
  state = {
    logged_in: localStorage.getItem("token") ? true : false,
    username: "",
    isNavDropdownOpen: false,
  };
}
