import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Jumbotron,
  Alert,
  CardDeck,
  CardGroup,
  CardColumns,
} from "react-bootstrap";
import { Redirect, BrowserRouter as Router } from "react-router-dom";
import List from "./List";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.props.loggedIn,
      username: this.props.username,
      userListData: [],
    };
  }

  //On mount, get the user's list and update userListData
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

  deleteList = (id, callback) => {
    console.log("Calling this method");
    axios
      .delete(`http://127.0.0.1:8000/api/v1/lists/${id}/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        callback();
        this.getUserLists();
      })
      .catch((error) => {
        console.log(error.response.data);
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
            userListData: response.data,
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
          {this.state.userListData.map((list) => {
            return (
              <List
                key={list.id}
                id={list.id}
                title={list.title}
                dateCreated={list.date_created}
                listItems={list.list_items}
                deleteList={this.deleteList}
              />
            );
          })}
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <h1 className="text-center">You must log in to create lists</h1>
        </React.Fragment>
      );
    }
  };

  render() {
    return (
      <Container>
        <h1 className="text-center display-4">My Lists</h1>
        {this.renderLists()}
      </Container>
    );
  }
}

export default Home;

Home.propTypes = {
  username: PropTypes.string.isRequired,
  loggedIn: PropTypes.bool.isRequired,
};
