import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { ListGroupItem, InputGroup, Form, Button } from "react-bootstrap";
import TextareaAutosize from "react-textarea-autosize";
import {
  FaRegTimesCircle,
  FaRegSquare,
  FaRegCheckSquare,
  FaRegPlusSquare,
} from "react-icons/fa";

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changingContent: this.props.content,
      completed: this.props.completed,
      currentlyEditingContent: false,
      errorResponse: null,
      id: this.props.id,
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

  handleContentChange = (event) => {
    this.setState(
      {
        changingContent: event.target.value,
        errorResponse: null,
      },
      this.saveChanges
    );
  };

  saveChanges = () => {
    this.setState({ currentlyEditingContent: false });
    console.log("save changes");
    this.state.id > -1 ? this.updateListItem() : this.createListItem();
  };

  createListItem = () => {
    axios
      .post(
        "http://127.0.0.1:8000/api/v1/list_item/new",
        {
          content: this.state.changingContent,
          completed: this.state.completed,
          list_id: this.props.list_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        this.setState(
          {
            id: response.data.id,
          },
          () => {
            this.props.update();
          }
        );
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  updateListItem = () => {
    axios
      .put(
        `http://127.0.0.1:8000/api/v1/list_item/${this.state.id}/`,
        {
          content: this.state.changingContent,
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
        this.setState(
          {
            changingContent: response.data.content,
          },
          this.props.update
        );
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  deleteListItem = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/v1/list_item/${this.state.id}/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        this.props.update();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  changeCompleted = () => {
    this.setState(
      {
        completed: !this.state.completed,
      },
      this.updateListItem
    );
  };

  renderPlus = () => {
    if (this.state.changingContent) {
      return this.renderCheckbox();
    } else {
      return (
        <div
          style={{
            marginRight: "1px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Button size="sm" variant="light" onClick={this.changeCompleted}>
            <FaRegPlusSquare size={20}></FaRegPlusSquare>
          </Button>
        </div>
      );
    }
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
        <Button size="sm" variant="light" onClick={this.changeCompleted}>
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
        }}
        value={this.state.changingContent}
        className={"form-control"}
        onClick={() => {
          this.setState({ currentlyEditingContent: true });
        }}
        onBlur={this.saveChanges}
        onChange={this.handleContentChange}
        rows={1}
        placeholder={this.state.id < 0 ? "New List Item" : ""}
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
        {this.state.id > -1 ? this.renderCheckbox() : this.renderPlus()}
        {this.renderListItemContent()}
        {this.state.id > -1 ? this.renderDeleteButton() : null}
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
  completed: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
};
