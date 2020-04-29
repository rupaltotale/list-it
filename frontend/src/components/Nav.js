import { Nav, Navbar, Button, Dropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import React, { Component } from "react";
import PropTypes from "prop-types";
import OutsideInsideAlerter from "./OutsideInsideAlerter";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: localStorage.getItem("token") ? true : false,
      username: this.props.username,
      isNavDropdownHovering: false,
      isNavDropdownClicked: false,
      haveClickedNavDropdown: false,
      isNavDropdownOpen: false,
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

  handleLogout = () => {
    localStorage.removeItem("token");
    this.setState({
      isNavDropdownHovering: false,
    });
    this.props.setUsername("", false);
  };

  renderNavDropdown = () => {
    return (
      <>
        <Dropdown.Item
          onMouseEnter={() => {
            this.toggleNavDropdownHover(true);
          }}
        >
          Your Profile
        </Dropdown.Item>
        <Dropdown.Item
          onMouseEnter={() => {
            this.toggleNavDropdownHover(true);
          }}
          className="font-weight-bold"
          onClick={this.handleLogout}
        >
          <u>Logout</u>
        </Dropdown.Item>
      </>
    );
  };

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

  renderNavLoggedIn = () => {
    return (
      <>
        <Nav>
          <OutsideInsideAlerter
            children={
              <Dropdown
                onMouseEnter={() => {
                  this.toggleNavDropdownHover(true);
                }}
                onMouseLeave={() => {
                  this.toggleNavDropdownHover(false);
                }}
                onClick={this.toggleNavDropdownClicked}
                show={this.state.isNavDropdownOpen}
              >
                <Dropdown.Toggle>{this.state.username}</Dropdown.Toggle>
                <Dropdown.Menu style={{ right: 0, left: "auto" }}>
                  {this.renderNavDropdown()}
                </Dropdown.Menu>
              </Dropdown>
            }
            outsideCallback={() => {
              this.setState({
                isNavDropdownClicked: false,
                isNavDropdownHovering: false,
                haveClickedNavDropdown: false,
                isNavDropdownOpen: false,
              });
            }}
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
