import { Button, InputGroup } from "react-bootstrap";
import {
  FaAt,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaPortrait,
} from "react-icons/fa";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import React from "react";
import CustomNavBar from "./components/Nav/Nav";
import CustomForm from "./components/CustomComponents/Form/CustomForm";
import { render } from "react-dom";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile";
import { getUser, updateUser } from "./API";
import {
  getPrimaryColorFromTheme,
  getBackgroundColorFromTheme,
} from "./Colors";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.container = document.getElementById("app");
    this.state = {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      id: null,
      theme: "",
      loggedIn: localStorage.getItem("token") ? true : false,
      isPasswordShowing: false,
    };
  }

  componentDidMount() {
    document.body.style.transition = "background-color 0.4s";
    document.body.style.marginBottom = "50px";
    if (this.state.loggedIn) {
      console.log("JWT", localStorage.getItem("token"));
      this.getUser();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.loggedIn !== this.state.loggedIn && this.state.loggedIn) {
      console.log("JWT", localStorage.getItem("token"));
      this.getUser();
    }
    if (prevState.theme !== this.state.theme) {
      this.setColors();
    }
  }

  setColors = () => {
    document.body.style.color = getPrimaryColorFromTheme(this.state.theme);
    document.body.style.backgroundColor = getBackgroundColorFromTheme(
      this.state.theme
    );
  };

  setUsername = (username, isLoggedIn, id) => {
    this.setState({
      username: username,
      loggedIn: isLoggedIn,
      id: id,
    });
  };

  getUser = () => {
    getUser(
      (response) => {
        this.setState(
          {
            username: response.data.username,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            email: response.data.email,
            id: response.data.id,
            theme: response.data.theme,
          },
          this.setColors
        );
      },
      (error) => {
        console.log(error);
      }
    );
  };

  updateUser = (responseFunc, rejectFunc, properties) => {
    updateUser(
      (response) => {
        responseFunc(response);
        this.setState(response.data);
      },
      (error) => {
        rejectFunc(error);
      },
      { ...this.state, ...properties }
    );
  };

  showPassword = () => {
    this.setState({
      isPasswordShowing: !this.state.isPasswordShowing,
    });
  };

  renderNav() {
    return (
      <CustomNavBar
        username={this.state.username}
        theme={this.state.theme}
        setUsername={this.setUsername}
        updateUser={this.updateUser}
      />
    );
  }

  renderSignUpForm = () => {
    return (
      <CustomForm
        setUsername={this.setUsername}
        pageTitle={"Sign Up"}
        formFields={[
          {
            fieldName: "first_name",
            type: "text",
            leftIcon: () => {
              return <FaPortrait size={20} />;
            },
          },
          {
            fieldName: "last_name",
            type: "text",
            leftIcon: () => {
              return <FaPortrait size={20} />;
            },
          },
          {
            fieldName: "email",
            type: "text",
            leftIcon: () => {
              return <FaEnvelope size={20} />;
            },
          },
          {
            fieldName: "username",
            type: "text",
            leftIcon: () => {
              return <FaAt size={20} />;
            },
          },
          {
            fieldName: "password",
            type: this.state.isPasswordShowing ? "text" : "password",
            leftIcon: () => {
              return <FaKey size={20} />;
            },
            rightIcon: () => {
              return (
                <InputGroup.Append>
                  <Button
                    variant="outline-secondary"
                    onClick={this.showPassword}
                  >
                    {this.state.isPasswordShowing ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </Button>
                </InputGroup.Append>
              );
            },
          },
        ]}
        postUrl={"http://localhost:8000/users/"}
      />
    );
  };

  renderLoginForm = () => {
    return (
      <CustomForm
        setUsername={this.setUsername}
        pageTitle={"Log In"}
        formFields={[
          {
            fieldName: "username",
            type: "text",
            leftIcon: () => {
              return <FaAt size={20} />;
            },
          },
          {
            fieldName: "password",
            type: this.state.isPasswordShowing ? "text" : "password",
            leftIcon: () => {
              return <FaKey size={20} />;
            },
            rightIcon: () => {
              return (
                <InputGroup.Append>
                  <Button
                    variant="outline-secondary"
                    onClick={this.showPassword}
                  >
                    {this.state.isPasswordShowing ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </Button>
                </InputGroup.Append>
              );
            },
          },
        ]}
        postUrl={"http://localhost:8000/token-auth/"}
      />
    );
  };

  renderHomePage = () => {
    return (
      <Home
        username={this.state.username}
        loggedIn={this.state.loggedIn}
        theme={this.state.theme}
      />
    );
  };

  renderProfilePage = () => {
    return <Profile />;
  };

  render() {
    return (
      <Router>
        {this.renderNav()}
        <Switch>
          <Route path="/login">
            {!this.state.loggedIn && this.renderLoginForm()}
            {this.state.loggedIn && <Redirect to="/" />}
          </Route>
          <Route path="/signup">
            {!this.state.loggedIn && this.renderSignUpForm()}
            {this.state.loggedIn && <Redirect to="/" />}
          </Route>
          <Route path="/about">
            <div>About</div>
          </Route>
          <Route path="/terms">
            <div>Lol, no terms and services</div>
          </Route>
          <Route path="/profile">
            {this.state.loggedIn && this.renderProfilePage()}
            {!this.state.loggedIn && <Redirect to="/" />}
          </Route>
          <Route path="/">
            {this.state.loggedIn
              ? this.renderHomePage()
              : this.renderLoginForm()}
          </Route>
        </Switch>
      </Router>
    );
  }
}

let container = document.getElementById("app");
render(<App />, container);
