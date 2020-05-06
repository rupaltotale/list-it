import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import onClickOutside from "react-onclickoutside";
import { Nav, Navbar, Dropdown } from "react-bootstrap";
import CustomDropdown from "./CustomDropdown";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: localStorage.getItem("token") ? true : false,
      username: this.props.username,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.username !== prevState.username) {
      return {
        username: nextProps.username,
        loggedIn: nextProps.username ? true : false,
      };
    }

    return null;
  }

  renderNavLoggedOut = () => {
    return (
      <>
        <Nav>
          <NavLink className="nav-link" exact to="/login">
            Login
          </NavLink>
          <NavLink className="nav-link" exact to="/signup">
            Sign Up
          </NavLink>
        </Nav>
      </>
    );
  };

  handleLogout = () => {
    localStorage.removeItem("token");
    this.props.setUsername("", false);
  };

  renderNavLoggedIn = () => {
    var DropdownWithClickOutside = onClickOutside(CustomDropdown);
    return (
      <>
        <Nav>
          <DropdownWithClickOutside
            title={this.state.username}
            dropdownItems={
              <>
                <NavLink style={{ color: "black" }} exact to="/profile">
                  <Dropdown.Item as="button">My Profile</Dropdown.Item>
                </NavLink>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item
                  style={{
                    fontWeight: "bold",
                    color: "red",
                  }}
                  onClick={this.handleLogout}
                >
                  Logout
                </Dropdown.Item>
              </>
            }
            menuStyle={{ right: 0, left: "auto" }}
          />
        </Nav>
      </>
    );
  };

  renderNavBar = () => {
    return (
      <Navbar collapseOnSelect expand="sm" bg="light" variant="light">
        <Navbar.Brand href="/">To-Do List</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <NavLink className="nav-link" exact to="/">
              Home
            </NavLink>
            <NavLink className="nav-link" exact to="/about">
              About
            </NavLink>
          </Nav>
          {this.state.loggedIn
            ? this.renderNavLoggedIn()
            : this.renderNavLoggedOut()}
        </Navbar.Collapse>
      </Navbar>
    );
  };

  render() {
    return this.renderNavBar();
  }
}

export default NavBar;

NavBar.propTypes = {
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
};
