import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import List from "../components/List";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.props.loggedIn,
      username: this.props.username,
      windowWidth: window.innerWidth,
      numberOfColumns: null,
      lists: [],
    };
  }

  //On mount, get the user's list and update lists
  componentDidMount() {
    this.getUserLists();
    window.addEventListener("resize", this.updateWindowWidth);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowWidth);
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

  updateWindowWidth = () => {
    this.setState(
      {
        windowWidth: window.innerWidth,
      },
      this.setColumnAmount
    );
  };

  setColumnAmount = () => {
    const listWidth = 319;
    const numberOfColumns = Math.floor(this.state.windowWidth / listWidth);
    if (numberOfColumns < this.state.lists.length) {
      this.setState({
        numberOfColumns: numberOfColumns,
      });
    } else if (this.state.numberOfColumns !== this.state.lists.length) {
      this.setState({
        numberOfColumns: this.state.lists.length,
      });
    }
  };

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
          this.setState(
            {
              lists: response.data,
            },
            this.setColumnAmount
          );
        });
    }
  };

  renderLists = () => {
    if (this.state.loggedIn) {
      let lists = [].concat(this.state.lists);
      let newLists = [];
      for (let i = 0; i < this.state.numberOfColumns; i++) {
        let j = i;
        let listArray = [];
        while (j < lists.length) {
          listArray.push(lists[j]);
          j += this.state.numberOfColumns;
        }
        newLists.push(listArray);
      }
      return (
        <div className="home-lists">
          {newLists.map((listArray, i) => {
            return (
              <div key={i} className="home-lists-col">
                {listArray.map((list) => {
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
          })}
        </div>
      );
    }
    return null;
  };

  renderAddListButton = () => {
    return (
      <Button variant={null} className="btn-add" onClick={this.createNewList}>
        <FaPlus></FaPlus>
        {" Add list"}
      </Button>
    );
  };

  renderHeading = () => {
    return (
      <div className="home-heading">
        <h1>My Lists</h1>
        {this.renderAddListButton()}
      </div>
    );
  };

  renderLoggedInHome = () => {
    return (
      <div className="home">
        {this.renderHeading()}
        {this.renderLists()}
      </div>
    );
  };

  renderLoggedOutHome = () => {
    return (
      <div className="home-heading">
        <h1>You must log in to create lists</h1>
      </div>
    );
  };

  render() {
    return this.state.loggedIn
      ? this.renderLoggedInHome()
      : this.renderLoggedOutHome();
  }
}

export default Home;

Home.propTypes = {
  username: PropTypes.string.isRequired,
  loggedIn: PropTypes.bool.isRequired,
};
