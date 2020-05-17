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
import CustomButton from "../CustomComponents/Button/CustomButton";
import { updateListItem, deleteListItem, createNewListItem } from "../../API";
import * as focus from "../../Focus";
import listStyle from "./ListStyle";

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
      createNewListItem(
        (response) => {
          this.props.setNewListItemToFocus(response.data.id);
          this.props.refresh();
        },
        (error) => {
          console.log(error.response);
        },
        {
          content: "",
          completed: this.state.completed,
          list_id: this.props.listID,
        }
      );
    });
    Mousetrap.bind("backspace", (event) => {
      if (this.state.content.length === 0) {
        event.preventDefault();
        this.deleteListItem();
      }
    });
    Mousetrap.bind(["down", "tab"], (event) => {
      event.preventDefault();
      let newID = focus.setNextListItemToFocus(
        this.props.index,
        this.props.listItems
      );
      this.props.setNewListItemToFocus(newID);
    });
    Mousetrap.bind("up", (event) => {
      event.preventDefault();
      let newID = focus.setPreviousListItemToFocus(
        this.props.index,
        this.props.listItems
      );
      this.props.setNewListItemToFocus(newID);
    });
  };

  updateListItem = () => {
    if (this.props.idToFocus !== this.props.id) {
      this.props.setNewListItemToFocus(this.props.id);
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
      <div style={listStyle.listItemButtonDiv}>
        <CustomButton
          size="sm"
          style={listStyle.listIconButton}
          styleOnHover={listStyle.listIconButtonHover}
          variantOnHover="light"
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
        style={
          this.state.completed && this.state.content
            ? {
                ...listStyle.listItemContent,
                ...listStyle.listItemContentCompleted,
              }
            : listStyle.listItemContent
        }
        className="form-control mousetrap"
        onChange={this.handleContentChange}
        onFocus={() => {
          this.setState(
            {
              focused: true,
            },
            this.bindKeys
          );
          this.props.setNewListItemToFocus(this.props.id);
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
      let newID = focus.setPreviousListItemToFocus(
        this.props.index,
        this.props.listItems
      );
      this.props.setNewListItemToFocus(newID);
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
    return (
      <div style={listStyle.listItemButtonDiv}>
        <CustomButton
          eventTypes={["click", "mousedown"]}
          size="sm"
          style={listStyle.listIconButton}
          styleOnHover={listStyle.listIconButtonHover}
          variantOnHover="light"
          onClick={this.deleteListItem}
          onClickOutside={this.handleClickOutsideDelete}
          icon={<FaRegTimesCircle size={20} color="black"></FaRegTimesCircle>}
        />
      </div>
    );
  };

  renderListItem = () => {
    return (
      <ListGroupItem style={listStyle.listItem}>
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
  listID: PropTypes.number.isRequired,
  refresh: PropTypes.func.isRequired,
  idToFocus: PropTypes.number,
  listItems: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  setNewListItemToFocus: PropTypes.func.isRequired,
};
