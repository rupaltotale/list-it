import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Button, Container } from "react-bootstrap";
import { Redirect, BrowserRouter as Router } from "react-router-dom";
import List from "./List";
import { FaPlus } from "react-icons/fa";
import moment from "moment";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.props.loggedIn,
      username: this.props.username,
      lists: [],
    };
  }

  //On mount, get the user's list and update lists
  componentDidMount() {
    this.getUserLists();
  }

  //If the username has changed (user logged in/out), then run render lists again
  componentDidUpdate(prevProps, prevState) {
    if (prevState.username !== this.state.username) {
      this.getUserLists();
      this.renderLists();
    }
  }

  // If the props (username/logged in) from app.js have changed, change the state
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.username !== prevState.username) {
      return {
        username: nextProps.username,
        loggedIn: nextProps.loggedIn,
      };
    }

    return null;
  }

  refresh = () => {
    this.getUserLists();
  };

  createNewList = () => {
    axios
      .post(
        "http://127.0.0.1:8000/api/v1/lists/new",
        {
          title: "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        this.getUserLists();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  getUserLists = () => {
    if (this.state.loggedIn) {
      axios
        .get("http://localhost:8000/api/v1/lists/", {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.setState({
            lists: response.data,
          });
        });
    }
  };

  renderLists = () => {
    if (this.state.loggedIn) {
      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
            alignContent: "flex-start",
            minHeight: "80%",
          }}
        >
          {this.state.lists.map((list) => {
            return (
              <List
                key={list.id}
                id={list.id}
                title={list.title}
                dateCreated={list.date_created}
                listItems={list.list_items}
                refresh={this.refresh}
              />
            );
          })}
        </div>
      );
    }
    return null;
  };

  renderAddListButton = () => {
    return (
      <Button
        variant="outline-success"
        style={{
          width: "wrap-content",
          margin: "6px 6px",
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onClick={this.createNewList}
      >
        <FaPlus style={{ margin: "2px" }}></FaPlus>
        {" Add list"}
      </Button>
    );
  };

  renderHeading = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "stretch",
          alignItems: "center",
        }}
      >
        <h1 className="text-center display-4">My Lists</h1>
        {this.renderAddListButton()}
      </div>
    );
  };

  renderLoggedInHome = () => {
    return (
      <Container>
        {this.renderHeading()}
        {this.renderLists()}
      </Container>
    );
  };

  renderLoggedOutHome = () => {
    return <h1 className="text-center">You must log in to create lists</h1>;
  };

  render() {
    if (this.state.loggedIn) {
      return this.renderLoggedInHome();
    }
    return this.renderLoggedOutHome();
  }
}

export default Home;

Home.propTypes = {
  username: PropTypes.string.isRequired,
  loggedIn: PropTypes.bool.isRequired,
};
