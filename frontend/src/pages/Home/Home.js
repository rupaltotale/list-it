import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import List from "../../components/List/List";
import { createNewList, createNewListItem, getLists } from "../../API";
import HomeStyle from "./HomeStyle";
import CustomButton from "../../components/CustomComponents/Button/CustomButton";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.props.loggedIn,
      username: this.props.username,
      windowWidth: window.innerWidth,
      numberOfColumns: null,
      lists: [],
      theme: this.props.theme,
      homeStyle: new HomeStyle(this.props.theme),
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

  // If the props (username/logged in/theme) from app.js have changed, change the state
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.theme !== prevState.theme) {
      var newTheme = {
        theme: nextProps.theme,
        homeStyle: new HomeStyle(nextProps.theme),
      };
    }
    if (nextProps.username !== prevState.username) {
      var newUsername = {
        username: nextProps.username,
        loggedIn: nextProps.loggedIn,
      };
    }
    return newTheme || newUsername ? { ...newTheme, ...newUsername } : null;
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
          {
            content: "",
            completed: false,
            list_id: response.data.id,
          }
        );
      },
      (error) => {
        console.log(error.response.data);
      },
      {
        title: "",
      }
    );
  };

  getUserLists = (resetColumnAmount = true) => {
    if (this.state.loggedIn) {
      getLists(
        (response) => {
          this.setState(
            {
              lists: response.data,
            },
            resetColumnAmount ? this.setColumnAmount : null
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
        <div style={this.state.homeStyle.homeRow}>
          {recreatedLists.map((listArray, i) => {
            return (
              <div key={i} style={this.state.homeStyle.homeCol}>
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
                      theme={this.state.theme}
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
      <CustomButton
        style={this.state.homeStyle.homeAdd}
        styleOnHover={this.state.homeStyle.homeAddHover}
        onClick={() => {
          this.createList();
        }}
        text={" Add List"}
        icon={<FaPlus style={this.state.homeStyle.homeAddIcon}></FaPlus>}
      ></CustomButton>
    );
  };

  renderHeading = () => {
    return (
      <div style={this.state.homeStyle.homeHeading}>
        <h1 className="display-4" style={this.state.homeStyle.homeTitle}>
          My Lists
        </h1>
        {this.renderAddListButton()}
      </div>
    );
  };

  renderLoggedInHome = () => {
    return (
      <div style={this.state.homeStyle.home}>
        {this.renderHeading()}
        {this.renderLists()}
      </div>
    );
  };

  renderLoggedOutHome = () => {
    return (
      <div style={this.state.homeStyle.homeHeading}>
        <h1 className="display-4" style={this.state.homeStyle.homeTitle}>
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
  theme: PropTypes.string.isRequired,
};
