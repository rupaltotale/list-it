import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { Nav, Navbar, Dropdown } from "react-bootstrap";
import CustomDropdown from "../CustomComponents/CustomDropdown";
import { FaSignOutAlt, FaMoon, FaUser, FaLightbulb } from "react-icons/fa";
import NavStyle from "./NavStyle";

class CustomNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: localStorage.getItem("token") ? true : false,
      username: this.props.username,
      userID: this.props.userID,
      theme: this.props.theme,
      navStyle: new NavStyle(this.props.theme),
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.username !== prevState.username ||
      nextProps.userID !== prevState.userID ||
      nextProps.theme !== prevState.theme
    ) {
      return {
        username: nextProps.username,
        loggedIn: nextProps.username ? true : false,
        userID: nextProps.userID,
        theme: nextProps.theme,
        navStyle: new NavStyle(nextProps.theme),
      };
    }

    return null;
  }

  renderNavLoggedOut = () => {
    return (
      <>
        <Nav>
          <NavLink
            style={this.state.navStyle.navLink}
            className="nav-link"
            exact
            to="/login"
          >
            Login
          </NavLink>
          <NavLink
            style={this.state.navStyle.navLink}
            className="nav-link"
            exact
            to="/signup"
          >
            Sign Up
          </NavLink>
        </Nav>
      </>
    );
  };

  changeTheme = () => {
    this.props.updateUser(
      (response) => {
        this.setState({
          theme: response.data.theme,
        });
      },
      (error) => {
        console.log(error.response);
      },
      { theme: this.state.theme === "L" ? "D" : "L" }
    );
  };

  handleLogout = () => {
    localStorage.removeItem("token");
    this.props.setUsername("", false, null);
  };

  renderNavLoggedIn = () => {
    return (
      <>
        <Nav>
          <CustomDropdown
            title={this.state.username}
            dropdownStyle={this.state.navStyle.navDropdown}
            menuStyle={this.state.navStyle.navDropdownMenu}
            dropdownItems={
              <>
                <NavLink
                  style={this.state.navStyle.navDropdownLink}
                  exact
                  to="/profile"
                >
                  <Dropdown.Item
                    style={this.state.navStyle.navDropdownItem}
                    as="button"
                  >
                    <FaUser
                      style={this.state.navStyle.navDropdownIcon}
                    ></FaUser>
                    My Profile
                  </Dropdown.Item>
                </NavLink>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item
                  style={this.state.navStyle.navDropdownItem}
                  onClick={this.changeTheme}
                >
                  {this.state.theme === "L" ? (
                    <FaMoon
                      style={this.state.navStyle.navDropdownIcon}
                    ></FaMoon>
                  ) : (
                    <FaLightbulb
                      style={this.state.navStyle.navDropdownIcon}
                    ></FaLightbulb>
                  )}
                  {this.state.theme === "L" ? "Dark " : "Light "}
                  Theme
                </Dropdown.Item>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item
                  style={this.state.navStyle.navDropdownLogout}
                  onClick={this.handleLogout}
                >
                  <FaSignOutAlt
                    style={this.state.navStyle.navDropdownIcon}
                  ></FaSignOutAlt>
                  Logout
                </Dropdown.Item>
              </>
            }
            dropdownProps={{ alignRight: true }}
          />
        </Nav>
      </>
    );
  };

  renderCustomNavBar = () => {
    return (
      <Navbar collapseOnSelect expand="sm" style={this.state.navStyle.navbar}>
        <NavLink exact to="/" style={this.state.navStyle.navLink}>
          <Navbar.Brand style={this.state.navStyle.navBrand}>
            To-Do List
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav style={this.state.navStyle.leftNavbar}>
            <NavLink
              style={this.state.navStyle.navLink}
              className="nav-link"
              exact
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              style={this.state.navStyle.navLink}
              className="nav-link"
              exact
              to="/about"
            >
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
    return this.renderCustomNavBar();
  }
}

export default CustomNavBar;

CustomNavBar.propTypes = {
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
};
