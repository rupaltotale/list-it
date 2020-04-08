import PropTypes from "prop-types";
import React from "react";
import {
  Link,
  Route,
  Redirect,
  BrowserRouter as Router,
  Switch,
  useParams,
} from "react-router-dom";
import { Form, Container, Col, Row } from "react-bootstrap";
import axios from "axios";

class SignupForm extends React.Component {
  state = {
    username: "",
    password: "",
    redirect: null,
  };

  handle_change = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState((prevstate) => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  handle_signup = (e) => {
    e.preventDefault();
    axios({
      method: "post",
      url: "http://localhost:8000/users/",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(this.state),
    }).then(
      (response) => {
        console.log(response);
        localStorage.setItem("token", response.data.token);
        this.setState({
          logged_in: true,
          username: response.data.username,
          redirect: "/",
        });
        this.props.set_username(response.data.username);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <Container>
        <Row className="justify-content-center align-items-center p-3">
          <Col md={5} className="mx-auto">
            <h1 className="text-center">Sign Up</h1>
            <Form onSubmit={(e) => this.handle_signup(e)}>
              <Form.Group>
                <Form.Label htmlFor="username">Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter a username"
                  value={this.state.username}
                  onChange={this.handle_change}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter a password"
                  value={this.state.password}
                  onChange={this.handle_change}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBasicChecbox">
                <Form.Check
                  type="checkbox"
                  label="I have read the Terms and Services"
                  required
                />
              </Form.Group>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SignupForm;

SignupForm.propTypes = {
  // handle_signup: PropTypes.func.isRequired
};
