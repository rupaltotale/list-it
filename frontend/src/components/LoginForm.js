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
  }
  componentDidMount() {
    console.log("State mounted only!!");
    console.log(this.state);
  }

  componentDidUpdate() {
    console.log("State updated only!");
  }

  getFields = (initialValue) => {
    const returnDict = {};
    this.props.formFields.forEach((field) => {
      returnDict[field.fieldName] = initialValue;
    });
    return returnDict;
  };

  state = Object.assign(
    {},
    {
      redirect: null,
      submitted: false,
      error: this.getFields([]),
    },
    this.getFields("")
  );

  handle_change = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // Stores the input field value in a state variable
    this.setState(
      (prevstate) => {
        const newState = { ...prevstate };
        newState[name] = value;
        return newState;
      },
      () => {
        // Sets validity of the input field being changed (based on if it is now empty)
        const updatedErrorState = this.state.error;
        if (value.length > 0) {
          Object.keys(this.state.error).forEach((field) => {
            if (this.state[field]) {
              updatedErrorState[field] = [];
            }
          });
        } else {
          updatedErrorState[name] = ["This field may not be blank."];
        }
        this.setState({
          error: updatedErrorState,
        });
      }
    );
  };

  handleLogin = (e) => {
    e.preventDefault();
    axios({
      method: "post",
      // TODO: Abstract root url: http://localhost:8000/
      url: this.props.postUrl,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(this.state),
    })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        const username = response.data.username
          ? response.data.username
          : response.data.user.username;
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
        updatedErrorState[errorField] = errorDict[errorField];
      }
    }
    this.setState({
      error: updatedErrorState,
    });
  };

  handleSubmit = (event) => {
    this.handleLogin(event);
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
            {this.state.error[fieldName].map((item, i) => {
              return <Form.Label key={i}>{item}</Form.Label>;
            })}
          </Form.Control.Feedback>
          {renderRightIcon ? renderRightIcon() : null}
        </InputGroup>
      </Form.Group>
    );
  }

  renderFields = () => {
    return (
      <React.Fragment>
        {this.props.formFields.map((field) => {
          return this.renderField(
            field.fieldName,
            field.type,
            field.leftIcon,
            field.rightIcon
          );
        })}
      </React.Fragment>
    );
  };

  renderForm = () => {
    return (
      <Form noValidate onSubmit={this.handleSubmit}>
        {this.renderFields()}
        <Button type="submit" className="btn btn-primary">
          Submit
        </Button>
      </Form>
    );
  };

  renderLoginForm = () => {
    return (
      <Container>
        <Row className="justify-content-center align-items-center p-3">
          <Col md={5} className="mx-auto">
            <h1 className="text-center">{this.props.pageTitle}</h1>
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
  set_username: PropTypes.func.isRequired,
  pageTitle: PropTypes.string.isRequired,
  formFields: PropTypes.array.isRequired,
  postUrl: PropTypes.string.isRequired,
};
