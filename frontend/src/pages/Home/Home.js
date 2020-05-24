import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import List from "../../components/List/List";
import { createNewList, createNewListItem, getLists } from "../../API";
import HomeStyle from "./HomeStyle";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.homeStyle = new HomeStyle();
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

  createList = () => {
    createNewList(
      (response) => {
        createNewListItem(
          (response) => {
            this.getUserLists();
          },
          (error) => {
            console.log(error.response);
          },
          { content: "", completed: false, list_id: response.data.id }
        );
      },
      (error) => {
        console.log(error.response);
      }
    );
  };

  getUserLists = () => {
    if (this.state.loggedIn) {
      getLists(
        (response) => {
          this.setState(
            {
              lists: response.data,
            },
            this.setColumnAmount
          );
        },
        (error) => {
          console.log(error.response);
        }
      );
    }
  };

  renderLists = () => {
    if (this.state.loggedIn) {
      let lists = [].concat(this.state.lists);
      let recreatedLists = [];
      for (let i = 0; i < this.state.numberOfColumns; i++) {
        let j = i;
        let listArray = [];
        while (j < lists.length) {
          listArray.push(lists[j]);
          j += this.state.numberOfColumns;
        }
        recreatedLists.push(listArray);
      }
      return (
        <div style={this.homeStyle.homeRow}>
          {recreatedLists.map((listArray, i) => {
            return (
              <div key={i} style={this.homeStyle.homeCol}>
                {listArray.map((list) => {
                  let listItems = list.list_items.sort((x, y) => {
                    return x.completed === y.completed
                      ? 0
                      : x.completed
                      ? 1
                      : -1;
                  });
                  return (
                    <List
                      key={list.id}
                      id={list.id}
                      title={list.title}
                      dateCreated={list.date_created}
                      listItems={listItems}
                      color={list.color}
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
      <Button
        variant="outline-dark"
        style={this.homeStyle.homeAdd}
        onClick={() => {
          this.createList();
        }}
      >
        <FaPlus style={this.homeStyle.homeAddIcon}></FaPlus>
        {" Add list"}
      </Button>
    );
  };

  renderHeading = () => {
    return (
      <div style={this.homeStyle.homeHeading}>
        <h1 className="display-4" style={this.homeStyle.homeTitle}>
          My Lists
        </h1>
        {this.renderAddListButton()}
      </div>
    );
  };

  renderLoggedInHome = () => {
    return (
      <div style={this.homeStyle.home}>
        {this.renderHeading()}
        {this.renderLists()}
      </div>
    );
  };

  renderLoggedOutHome = () => {
    return (
      <div style={this.homeStyle.homeHeading}>
        <h1 className="display-4" style={this.homeStyle.homeTitle}>
          You must log in to create lists
        </h1>
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
