import React from "react";
import PropTypes from "prop-types";
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
import { updateListItem, deleteListItem } from "../API";

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
    updateListItem(
      (response) => {
        this.props.refresh();
      },
      (error) => {
        console.log(error.response);
      },
      {
        id: this.props.id,
        content: this.state.content,
        completed: this.state.completed,
      }
    );
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
      <div className="btn-div mx-1">
        <CustomButton
          size="sm"
          className="btn-icon"
          onClick={this.toggleCompleted}
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
        value={this.state.content}
        className={`list-item-content${
          this.state.completed && this.state.content ? `-completed` : ``
        } mousetrap`}
        onChange={this.handleContentChange}
        onFocus={() => {
          this.setState(
            {
              focused: true,
            },
            this.bindKeys
          );
          this.props.setCurrentListItemToFocus(this.props.id);
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
    deleteListItem(
      (response) => {
        this.props.refresh();
      },
      (error) => {
        console.log(error.response);
      },
      { id: this.props.id }
    );
  };

  handleClickOutsideDelete = () => {
    this.setState({
      focused: false,
    });
  };

  renderDeleteButton = () => {
    let ButtonWithClickOutside = onClickOutside(CustomButton);
    return (
      <div className="btn-div mx-1">
        <ButtonWithClickOutside
          eventTypes={["click", "mousedown"]}
          size="sm"
          className="btn-icon"
          onClick={this.deleteListItem}
          onClickOutside={this.handleClickOutsideDelete}
          icon={<FaRegTimesCircle size={20} color="black"></FaRegTimesCircle>}
        />
      </div>
    );
  };

  renderListItem = () => {
    return (
      <ListGroupItem className="list-item">
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
