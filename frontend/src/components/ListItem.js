import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import * as Mousetrap from "Mousetrap";
import onClickOutside from "react-onclickoutside";
import { ListGroupItem } from "react-bootstrap";
import {
  FaRegTimesCircle,
  FaRegSquare,
  FaRegCheckSquare,
} from "react-icons/fa";
import CustomButton from "./CustomComponents/CustomButton";

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      content: this.props.content,
      completed: this.props.completed,
      errorResponse: null,
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
      this.ref.current.selectionStart = this.ref.current.value.length;
      this.ref.current.selectionEnd = this.ref.current.value.length;
    }
  };

  bindKeys = () => {
    Mousetrap.bind("enter", (event) => {
      event.preventDefault();
      this.props.createListItem(this.state.completed);
    });
    Mousetrap.bind("backspace", (event) => {
      if (this.state.content.length === 0) {
        event.preventDefault();
        this.deleteListItem();
      }
    });
    Mousetrap.bind(["down", "tab"], (event) => {
      event.preventDefault();
      this.props.setNextListItemToFocus(this.props.id, this.state.completed);
    });
    Mousetrap.bind("up", (event) => {
      event.preventDefault();
      this.props.setPreviousListItemToFocus(
        this.props.id,
        this.state.completed
      );
    });
  };

  updateListItem = () => {
    if (this.props.idToFocus !== this.props.id) {
      this.props.setCurrentListItemToFocus(this.props.id);
    }
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
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-center",
          margin: "0px 3px 0px 3px",
        }}
      >
        <CustomButton
          size="sm"
          className="btn-round btn-no-border btn-opaque-hover"
          onClick={this.toggleCompleted}
          variantOnHover="light"
          icon={
            this.state.completed ? (
              <FaRegCheckSquare color="black" size={20}></FaRegCheckSquare>
            ) : (
              <FaRegSquare color="black" size={20}></FaRegSquare>
            )
          }
        />
      </div>
    );
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
          this.setState(
            {
              focused: true,
            },
            this.bindKeys
          );
        }}
        onBlur={() => {
          Mousetrap.reset();
        }}
        rows={1}
        placeholder="List Item"
        inputRef={this.ref}
      ></TextareaAutosize>
    );
  };

  deleteListItem = () => {
    if (this.state.focused) {
      Mousetrap.reset();
      this.props.setNextListItemToFocus(
        this.props.id,
        this.state.completed,
        true
      );
    }
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

  handleClickOutsideDelete = () => {
    this.setState({
      focused: false,
    });
  };

  renderDeleteButton = () => {
    let ButtonWithClickOutside = onClickOutside(CustomButton);
    return (
      <div
        className="d-flex flex-row justify-content-center"
        style={{
          marginLeft: "3px",
        }}
      >
        <ButtonWithClickOutside
          eventTypes={["click", "mousedown"]}
          size="sm"
          className="btn-round btn-no-border btn-opaque-hover"
          onClick={this.deleteListItem}
          onClickOutside={this.handleClickOutsideDelete}
          variantOnHover="light"
          icon={<FaRegTimesCircle size={20} color="black"></FaRegTimesCircle>}
        />
      </div>
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
  content: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  completed: PropTypes.bool.isRequired,
  refresh: PropTypes.func.isRequired,
  idToFocus: PropTypes.number,
  setPreviousListItemToFocus: PropTypes.func.isRequired,
  setNextListItemToFocus: PropTypes.func.isRequired,
  setCurrentListItemToFocus: PropTypes.func.isRequired,
  createListItem: PropTypes.func.isRequired,
};
