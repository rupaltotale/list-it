import { Nav, Navbar, Button, Dropdown, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";
import onClickOutside from "react-onclickoutside";

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

  renderNavLoggedIn = () => {
    var DropdownWithClickOutside = onClickOutside(CustomNavDropdown);
    return (
      <>
        <Nav>
          <DropdownWithClickOutside
            username={this.props.username}
            setUsername={this.props.setUsername}
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

class CustomNavDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNavDropdownOpen: false,
      isNavDropdownHovering: false,
      isNavDropdownClicked: false,
      haveClickedNavDropdown: false,
    };
  }

  handleClickOutside = (event) => {
    this.setState({
      isNavDropdownClicked: false,
      isNavDropdownHovering: false,
      haveClickedNavDropdown: false,
      isNavDropdownOpen: false,
    });
  };

  handleLogout = () => {
    localStorage.removeItem("token");
    this.props.setUsername("", false);
  };

  toggleNavDropdownHover = (bool) => {
    this.setState({ isNavDropdownHovering: bool }, () => {
      this.setState({
        isNavDropdownOpen: this.toggleNavDropdown(),
      });
    });
  };

  toggleNavDropdownClicked = () => {
    this.setState(
      {
        isNavDropdownClicked: !this.state.isNavDropdownClicked,
        haveClickedNavDropdown: true,
      },
      () => {
        this.setState({
          isNavDropdownOpen: this.toggleNavDropdown(),
        });
      }
    );
  };

  toggleNavDropdown = () => {
    if (this.state.isNavDropdownClicked) {
      return true;
    } else {
      if (this.state.haveClickedNavDropdown) {
        return false;
      }
      if (this.state.isNavDropdownHovering) {
        return true;
      }
    }
    return false;
  };

  renderNavDropdown = () => {
    return (
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
    );
  };

  render() {
    return (
      <Dropdown
        onMouseEnter={() => {
          this.toggleNavDropdownHover(true);
        }}
        onMouseLeave={() => {
          this.toggleNavDropdownHover(false);
        }}
        onSelect={this.handleClickOutside}
        show={this.state.isNavDropdownOpen}
      >
        <Dropdown.Toggle onClick={this.toggleNavDropdownClicked}>
          {this.props.username}
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ right: 0, left: "auto" }}>
          {this.renderNavDropdown()}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default NavBar;

CustomNavDropdown.propTypes = {
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
};

NavBar.propTypes = {
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
};
