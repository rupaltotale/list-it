import {
  Link,
  Route,
  BrowserRouter as Router,
  Switch,
  useParams,
  NavLink,
  Redirect,
} from "react-router-dom";
import React, { Component } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import { render } from "react-dom";
import { Jumbotron, Nav, Navbar, Button, NavDropdown } from "react-bootstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: localStorage.getItem("token") ? true : false,
      username: "",
      isNavDropdownOpen: false,
    };
  }

  set_username = (username) => {
    this.setState({
      username: username,
      logged_in: true,
    });
  };

  handle_navdropdown_open = () => {
    this.setState({ isNavDropdownOpen: true });
  };

  handle_navdropdown_close = () => {
    this.setState({ isNavDropdownOpen: false });
  };

  componentDidMount() {
    if (this.state.logged_in) {
      fetch("http://localhost:8000/current_user/", {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          this.setState({ username: json.username });
        });
    }
  }

  handle_logout = () => {
    localStorage.removeItem("token");
    this.setState({ logged_in: false, username: "", isNavDropdownOpen: false });
  };

  render_nav_logged_in() {
    const logged_in_nav = (
      <Navbar collapseOnSelect expand="sm" bg="light" variant="light">
        <Navbar.Brand>To-Do List</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <NavLink
              exact
              to="/"
              className={"nav-link"}
              activeClassName={"nav-link active"}
            >
              Home
            </NavLink>
            <NavLink
              exact
              to="/about"
              className={"nav-link"}
              activeClassName={"nav-link active"}
            >
              About
            </NavLink>
          </Nav>
          <Nav className="mr-5">
            <Navbar.Text>Signed in as:</Navbar.Text>
            <NavDropdown
              title={this.state.username}
              onMouseEnter={this.handle_navdropdown_open}
              onMouseLeave={this.handle_navdropdown_close}
              show={this.state.isNavDropdownOpen}
            >
              <NavDropdown.Item>Your Profile</NavDropdown.Item>
              <NavDropdown.Item
                className="font-weight-bold"
                onClick={this.handle_logout}
              >
                <u>Logout</u>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
    return logged_in_nav;
  }

  render_nav_logged_out() {
    const logged_out_nav = (
      <Navbar collapseOnSelect expand="sm" bg="light" variant="light">
        <Navbar.Brand href="/">To-Do List</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto" align="center">
            <NavLink
              exact
              to="/"
              className={"nav-link"}
              activeClassName={"nav-link active"}
            >
              Home
            </NavLink>
            <NavLink
              exact
              to="/about"
              className={"nav-link"}
              activeClassName={"nav-link active"}
            >
              About
            </NavLink>
          </Nav>
          <Nav>
            <NavLink
              exact
              to="/login"
              className={"nav-link"}
              activeClassName={"nav-link active"}
            >
              Login
            </NavLink>
            <NavLink
              exact
              to="/signup"
              className={"nav-link"}
              activeClassName={"nav-link active"}
            >
              Sign Up
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
    return logged_out_nav;
  }

  render_nav() {
    return (
      <div>
        {this.state.logged_in
          ? this.render_nav_logged_in()
          : this.render_nav_logged_out()}
      </div>
    );
  }

  render() {
    return (
      <Router>
        {this.render_nav()}
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/login">
            {!this.state.logged_in && (
              <LoginForm set_username={this.set_username} />
            )}
            {this.state.logged_in && <Redirect to="/" />}
          </Route>
          <Route path="/signup">
            {!this.state.logged_in && (
              <SignupForm set_username={this.set_username} />
            )}
            {this.state.logged_in && <Redirect to="/" />}
          </Route>
          <Route path="/about">
            <div>About</div>
          </Route>
          <Route path="/">
            <Jumbotron>
              <h2>To-do List</h2>
            </Jumbotron>
          </Route>
        </Switch>
      </Router>
    );
  }
}

const container = document.getElementById("app");
render(<App />, container);
