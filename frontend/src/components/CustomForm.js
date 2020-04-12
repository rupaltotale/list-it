import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Redirect, BrowserRouter as Router } from "react-router-dom";

import PropTypes from "prop-types";
import React from "react";
import axios from "axios";

class CustomForm extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  componentDidUpdate() {}

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.pageTitle !== prevState.pageTitle) {
      return Object.assign(
        {},
        {
          redirect: null,
          submitted: false,
          error: CustomForm.getFields([], nextProps),
          pageTitle: nextProps.pageTitle,
        },
        CustomForm.getFields("", nextProps)
      );
    }
    return null;
  }

  static getFields(initialValue, props) {
    const returnDict = {};
    props.formFields.forEach((field) => {
      returnDict[field.fieldName] = initialValue;
    });
    return returnDict;
  }

  state = Object.assign(
    {},
    {
      redirect: null,
      submitted: false,
      error: CustomForm.getFields([], this.props),
      pageTitle: this.props.pageTitle,
    },
    CustomForm.getFields("", this.props)
  );

  handleChange = (e) => {
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
    event.preventDefault();
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
        // TODO: Have same username location for login and signup
        const username = response.data.username
          ? response.data.username
          : response.data.user.username;
        this.setState({
          logged_in: true,
          username,
          redirect: "/",
        });
        this.props.setUsername(username);
      })
      .catch(this.setInvalidFeedback);
    this.setState({
      submitted: true,
    });
  };

  getProperNameFromField = (string) => {
    string = string.charAt(0).toUpperCase() + string.slice(1);
    return string.replace("_", " ");
  };

  renderField(fieldName, type, renderLeftIcon, renderRightIcon = () => {}) {
    return (
      <Form.Group>
        <Form.Label>{this.getProperNameFromField(fieldName)}</Form.Label>
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
            placeholder={`Enter your ${fieldName.replace("_", " ")}`}
            value={this.state[fieldName]}
            onChange={this.handleChange}
            required
          />
          {renderRightIcon ? renderRightIcon() : null}
          <Form.Control.Feedback type="invalid">
            {this.state.error[fieldName].map((item, i) => {
              return <Form.Label key={i}>{item}</Form.Label>;
            })}
          </Form.Control.Feedback>
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
      <Container>
        <Row className="justify-content-center align-items-center p-3">
          <Col md={5} className="mx-auto">
            <h1 className="text-center">{this.props.pageTitle}</h1>
            <Form noValidate onSubmit={this.handleSubmit}>
              {this.renderFields()}
              <Button type="submit" className="btn btn-primary">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return this.renderForm();
  }
}

export default CustomForm;

CustomForm.propTypes = {
  setUsername: PropTypes.func.isRequired,
  pageTitle: PropTypes.string.isRequired,
  formFields: PropTypes.array.isRequired,
  postUrl: PropTypes.string.isRequired,
};
