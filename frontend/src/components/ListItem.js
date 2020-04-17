import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { ListGroupItem, InputGroup, Form } from "react-bootstrap";
import TextareaAutosize from "react-textarea-autosize";

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changingContent: this.props.content,
      completed: this.props.completed,
      currentlyEditingContent: false,
      errorResponse: null,
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

  handleContentChange = (contentData) => {
    this.setState(
      {
        changingContent: contentData.target.value,
        errorResponse: null,
      },
      () => {
        if (!this.state.changingContent) {
          this.setState({
            errorResponse: "This field may not be blank",
          });
        }
      }
    );
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
        this.props.update();
        this.setState({
          changingContent: "",
        });
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  updateListItem = () => {
    axios
      .put(
        `http://127.0.0.1:8000/api/v1/list_item/${this.props.id}/`,
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
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  renderListItemContent = () => {
    return (
      <TextareaAutosize
        value={this.state.changingContent}
        className={"form-control"}
        onClick={() => {
          this.setState({ currentlyEditingContent: true });
        }}
        onBlur={() => {
          this.setState({ currentlyEditingContent: false });
          this.props.id > -1 ? this.updateListItem() : this.createListItem();
        }}
        onChange={this.handleContentChange}
        rows={1}
        placeholder={"New List Item"}
      ></TextareaAutosize>
    );
  };
  renderListItem = () => {
    return <ListGroupItem>{this.renderListItemContent()}</ListGroupItem>;
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
