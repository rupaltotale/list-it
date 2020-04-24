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

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content,
      completed: this.props.completed,
      currentlyEditingContent: false,
      errorResponse: null,
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

  handleContentChange = (event) => {
    this.setState(
      {
        content: event.target.value,
        errorResponse: null,
      },
      this.updateListItem
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

  renderCheckbox = () => {
    return (
      <div
        style={{
          marginRight: "1px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Button size="sm" variant="light" onClick={this.toggleCompleted}>
          {this.state.completed ? (
            <FaRegCheckSquare size={20}></FaRegCheckSquare>
          ) : (
            <FaRegSquare size={20}></FaRegSquare>
          )}
        </Button>
      </div>
    );
  };

  renderDeleteButton = () => {
    return (
      <div
        style={{
          marginLeft: "3px",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-center",
        }}
      >
        <Button size="sm" variant="light" onClick={this.deleteListItem}>
          <FaRegTimesCircle size={20}></FaRegTimesCircle>
        </Button>
      </div>
    );
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
        className={"form-control"}
        onFocus={() => {
          this.setState({ currentlyEditingContent: true });
        }}
        onChange={this.handleContentChange}
        rows={1}
        placeholder="List Item"
      ></TextareaAutosize>
    );
  };

  renderListItem = () => {
    return (
      <ListGroupItem
        variant="light"
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "flex-center",
          alignItems: "flex-center",
          height: "100%",
          paddingLeft: "0px",
        }}
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
};
