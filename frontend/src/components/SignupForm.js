import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Link,
  Route,
  Redirect,
  BrowserRouter as Router,
  Switch,
  useParams,
} from "react-router-dom";
import { Form, Container, Col, Row, InputGroup } from "react-bootstrap";
import axios from "axios";
import { GiKing, GiPadlock } from "react-icons/gi";
import { IconContext } from "react-icons";

class SignupForm extends React.Component {
  state = {
    username: "",
    password: "",
    redirect: null,
    status: null,
    serverResponse: null,
  };

  handle_change = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const object_list = document.getElementsByName(name);

    this.setState((prevstate) => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });

    object_list.forEach((object) => {
      //If the value is not empty
      if (object.value.length > 0) {
        //Get all the input fields
        object.setCustomValidity("");
      }
      //If the value is empty
      else {
        //Capitalize the object's name
        const capitalized_object =
          object.name.charAt(0).toUpperCase() + object.name.slice(1);
        //Set the invalidation message
        object.setCustomValidity(`${capitalized_object} is required`);
        //Display the invalidation message
        object.nextElementSibling.innerHTML = object.validationMessage;
      }
    });
  };

  handle_signup = (e, callback) => {
    e.preventDefault();
    axios({
      method: "post",
      url: "http://localhost:8000/users/",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(this.state),
    })
      .then(
        (response) => {
          localStorage.setItem("token", response.data.token);
          this.setState({
            logged_in: true,
            username: response.data.username,
            redirect: "/",
            status: response.status,
            serverResponse: response.data,
          });
          this.props.set_username(response.data.username);
        },
        (error) => {
          this.setState({
            status: error.response.status,
            serverResponse: error.response.data,
          });
        }
      )
      .then(() => {
        if (this.state.status == 400) {
          callback();
        }
      });
  };

  validating_signup_form = () => {
    const [validated, setValidated] = useState(false);

    const set_invalid_feedback = () => {
      const arr = this.state.serverResponse;

      for (const key in arr) {
        if (key == "non_field_errors") {
          const all_inputs = document.getElementsByClassName("form-control");
          Array.from(all_inputs).forEach((input) => {
            input.setCustomValidity(arr[key]);
            input.nextElementSibling.innerHTML = input.validationMessage;
          });
        } else {
          const object_list = document.getElementsByName(key);
          object_list.forEach((object) => {
            object.setCustomValidity(arr[key]);
            object.nextElementSibling.innerHTML = object.validationMessage;
          });
        }
      }
    };

    const handleSubmit = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        this.handle_signup(event, () => {
          set_invalid_feedback();
        });
      }
      setValidated(true);
    };

    return (
      <Container>
        <Row className="justify-content-center align-items-center p-3">
          <Col md={5} className="mx-auto">
            <h1 className="text-center">Sign Up</h1>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Username&#42;</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <GiKing size={20} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter a username"
                    value={this.state.username}
                    onChange={this.handle_change}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Username is required
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Password&#42;</Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <GiPadlock size={20} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter a password"
                    value={this.state.password}
                    onChange={this.handle_change}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Password is required
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="formBasicChecbox">
                <Form.Check
                  type="checkbox"
                  label={
                    <Link to="/terms">
                      I have read the Terms and Conditions
                    </Link>
                  }
                  required
                  checked={true}
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </Form.Group>
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
    return <this.validating_signup_form />;
  }
}

export default SignupForm;

SignupForm.propTypes = {
  // handle_signup: PropTypes.func.isRequired
};
