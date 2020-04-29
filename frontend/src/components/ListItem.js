import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { ListGroupItem, InputGroup, Form, Button } from "react-bootstrap";
import TextareaAutosize from "react-textarea-autosize";
import {
  FaRegTimesCircle,
  FaRegSquare,
  FaRegCheckSquare,
} from "react-icons/fa";
import * as Mousetrap from "Mousetrap";
import OutsideAlerter from "./OutsideAlerter";

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      content: this.props.content,
      completed: this.props.completed,
      errorResponse: null,
      hoveringCheckbox: false,
      hoveringDelete: false,
      idToFocus: this.props.idToFocus,
      focused: false,
    };
  }

  componentDidMount() {
    if (this.state.idToFocus === this.props.id && !this.state.focused) {
      this.focusListItem();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.idToFocus !== prevProps.idToFocus &&
      this.state.idToFocus === this.props.id
    ) {
      this.focusListItem();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.idToFocus !== prevState.idToFocus) {
      return {
        idToFocus: nextProps.idToFocus,
      };
    }
    return null;
  }

  focusListItem = () => {
    if (this.ref.current) {
      this.ref.current.focus();
    }
  };

  handleContentChange = (event) => {
    this.setState(
      {
        content: event.target.value,
        errorResponse: null,
      },
      () => {
        this.updateListItem();
      }
    );
  };

  updateListItem = () => {
    axios
      .put(
        `http://127.0.0.1:8000/api/v1/list_item/${this.props.id}/`,
        {
          content: this.state.content,
          completed: this.state.completed,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        this.props.refresh();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  deleteListItem = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/v1/list_item/${this.props.id}/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        this.props.refresh();
        if (this.state.focused) {
          this.props.setNewIdToFocus();
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  toggleCompleted = () => {
    this.setState(
      {
        completed: !this.state.completed,
      },
      this.updateListItem
    );
  };

  toggleCheckboxHover = (bool) => {
    this.setState({
      hoveringCheckbox: bool,
    });
  };

  renderCheckbox = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Button
          size="sm"
          variant={null}
          style={{
            borderColor: "transparent",
          }}
          onClick={this.toggleCompleted}
          onMouseEnter={() => {
            this.toggleCheckboxHover(true);
          }}
          onMouseLeave={() => {
            this.toggleCheckboxHover(false);
          }}
        >
          {this.state.completed ? (
            <FaRegCheckSquare
              color={this.state.hoveringCheckbox ? "black" : "gray"}
              size={20}
            ></FaRegCheckSquare>
          ) : (
            <FaRegSquare
              color={this.state.hoveringCheckbox ? "black" : "gray"}
              size={20}
            ></FaRegSquare>
          )}
        </Button>
      </div>
    );
  };

  toggleDeleteHover = (bool) => {
    this.setState({
      hoveringDelete: bool,
    });
  };

  renderDeleteButton = () => {
    const divStyle = {
      marginLeft: "3px",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-center",
      justifyContent: "center",
    };
    return (
      <OutsideAlerter
        divStyle={divStyle}
        children={
          <Button
            size="sm"
            style={{ borderColor: "transparent" }}
            onClick={this.deleteListItem}
            onMouseEnter={() => {
              this.toggleDeleteHover(true);
            }}
            onMouseLeave={() => {
              this.toggleDeleteHover(false);
            }}
            variant={this.state.hoveringDelete ? "light" : null}
          >
            <FaRegTimesCircle size={20} color="black"></FaRegTimesCircle>
          </Button>
        }
        callback={() => {
          if (this.state.focused) {
            this.setState({
              focused: false,
            });
          }
        }}
      />
    );
  };

  handleEnterPress = () => {
    this.props.createListItem(this.state.completed);
  };

  renderListItemContent = () => {
    return (
      <TextareaAutosize
        style={{
          resize: "none",
          width: "85%",
          textDecorationLine:
            this.state.completed && this.state.content
              ? "line-through"
              : "none",
        }}
        value={this.state.content}
        className="form-control mousetrap"
        onChange={this.handleContentChange}
        onFocus={() => {
          this.setState({
            focused: true,
          });
          Mousetrap.bind("enter", (event) => {
            event.preventDefault();
            this.handleEnterPress();
          });
          Mousetrap.bind("backspace", (event) => {
            if (!this.state.content.length) {
              event.preventDefault();
              this.deleteListItem();
              Mousetrap.unbind("backspace");
            }
          });
        }}
        onBlur={() => {
          Mousetrap.unbind(["enter", "backspace"]);
        }}
        rows={1}
        placeholder="List Item"
        inputRef={this.ref}
      ></TextareaAutosize>
    );
  };

  renderListItem = () => {
    return (
      <ListGroupItem
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "flex-center",
          alignItems: "flex-center",
          height: "100%",
          paddingLeft: "0px",
        }}
        variant={this.state.completed ? "light" : null}
      >
        {this.renderCheckbox()}
        {this.renderListItemContent()}
        {this.renderDeleteButton()}
      </ListGroupItem>
    );
  };

  render() {
    return this.renderListItem();
  }
}

export default ListItem;

ListItem.propTypes = {
  id: PropTypes.number.isRequired,
  list_id: PropTypes.number.isRequired,
  completed: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
  refresh: PropTypes.func.isRequired,
  createListItem: PropTypes.func.isRequired,
};
