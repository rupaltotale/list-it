import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { FaEye, FaLock, FaPortrait } from "react-icons/fa";
import {
  Link,
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
  useParams,
} from "react-router-dom";
import PropTypes, { object } from "prop-types";
import React, { useState } from "react";

import { IconContext } from "react-icons";
import axios from "axios";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    // this.api = new API();
  }
  state = {
    username: "",
    password: "",
    redirect: null,
    submitted: false,
    error: {
      username: [],
      password: [],
    },
  };

  handle_change = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // Stores the input field value in a state variable
    this.setState((prevstate) => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
    // Sets validity of the input field being changed (based on if it is now empty)
    const updatedErrorState = this.state.error;
    if (value.length > 0) {
      Object.keys(this.state.error).forEach((field) => {
        updatedErrorState[field] = [];
      });
    } else {
      updatedErrorState[name] = ["This field is required"];
    }
    this.setState({
      error: updatedErrorState,
    });
  };

  handleLogin = (e) => {
    e.preventDefault();
    axios({
      method: "post",
      // TODO: Abstract root url: http://localhost:8000/
      url: "http://localhost:8000/token-auth/",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(this.state),
    })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        const username = response.data.user.username;
        this.setState({
          logged_in: true,
          username,
          redirect: "/",
        });
        this.props.set_username(username);
      })
      .catch(this.setInvalidFeedback);
  };

  setInvalidFeedback = (error) => {
    const errorDict = error.response.data;
    const updatedErrorState = this.state.error;
    for (const errorField in errorDict) {
      if (errorField == "non_field_errors") {
        Object.keys(this.state.error).forEach((field) => {
          updatedErrorState[field] = errorDict[errorField];
        });
      } else {
        const object_list = document.getElementsByName(key);
        object_list.forEach((object) => {
          object.setCustomValidity(arr[key]);
          object.nextElementSibling.innerHTML = object.validationMessage;
        });
      }
    }
    this.setState({
      error: updatedErrorState,
    });
  };

  handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.handleLogin(event);
    }
    this.setState({
      submitted: true,
    });
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  renderField(fieldName, type, renderLeftIcon, renderRightIcon = () => {}) {
    return (
      <Form.Group>
        <Form.Label>{this.capitalizeFirstLetter(fieldName)}</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>{renderLeftIcon()}</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            isInvalid={this.state.error[fieldName].length !== 0}
            isValid={
              this.state.submitted && this.state.error[fieldName].length === 0
            }
            type={type}
            name={fieldName}
            placeholder={`Enter your ${fieldName}`}
            value={this.state[fieldName]}
            onChange={this.handle_change}
            required
          />
          <Form.Control.Feedback type="invalid">
            {this.state.error[fieldName]}
          </Form.Control.Feedback>
          {renderRightIcon()}
        </InputGroup>
      </Form.Group>
    );
  }

  renderForm() {
    return (
      <Form noValidate onSubmit={this.handleSubmit}>
        {this.renderField("username", "text", () => {
          return <FaPortrait size={20} />;
        })}
        {this.renderField(
          "password",
          "password",
          () => {
            return <FaLock size={20} />;
          },
          () => {
            return (
              <InputGroup.Append>
                <Button variant="outline-secondary">
                  <FaEye size={20} />
                </Button>
              </InputGroup.Append>
            );
          }
        )}
        <Button type="submit" className="btn btn-primary">
          Submit
        </Button>
      </Form>
    );
  }

  renderLoginForm = () => {
    return (
      <Container>
        <Row className="justify-content-center align-items-center p-3">
          <Col md={5} className="mx-auto">
            <h1 className="text-center">Log In</h1>
            {this.renderForm()}
          </Col>
        </Row>
      </Container>
    );
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return this.renderLoginForm();
  }
}

export default LoginForm;

LoginForm.propTypes = {
  // handleLogin: PropTypes.func.isRequired
};
