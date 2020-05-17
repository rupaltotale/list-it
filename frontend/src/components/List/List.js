import React from "react";
import PropTypes from "prop-types";
import TextareaAutosize from "react-textarea-autosize";
import * as Mousetrap from "Mousetrap";
import onClickOutside from "react-onclickoutside";
import { Card, ListGroup, Button, Alert } from "react-bootstrap";
import { FaPlus, FaCheck } from "react-icons/fa";
import ListItem from "./ListItem";
import CustomButton from "../CustomComponents/Button/CustomButton";
import { createNewListItem, deleteList, updateList } from "../../API";
import listStyle from "./ListStyle";
import ListFooter from "./ListFooter";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.listTitle = React.createRef();
    this.state = {
      title: this.props.title,
      errorResponse: null,
      idToFocus: null,
      focusedOnListTitle: false,
      clickedInsideList: false,
      hoveringList: false,
    };
  }

  handleClickOutside = (event) => {
    if (this.state.clickedInsideList) {
      this.setState({
        clickedInsideList: false,
      });
    }
  };

  deleteList = () => {
    deleteList(
      (response) => {
        this.props.refresh();
      },
      (error) => {
        console.log(error.response);
      },
      { id: this.props.id }
    );
  };

  updateListTitle = () => {
    updateList(
      (response) => {
        this.setState({
          title: response.data.title,
          errorResponse: null,
        });
      },
      (error) => {
        console.log(error.response);
      },
      { id: this.props.id, title: this.state.title }
    );
  };

  renderSelectIcon = () => {
    return (
      <CustomButton
        style={
          this.state.hoveringList
            ? { ...listStyle.listSelectHide, ...listStyle.listSelectShow }
            : listStyle.listSelectHide
        }
        icon={<FaCheck style={listStyle.listSelectIcon} size={16}></FaCheck>}
      ></CustomButton>
    );
  };

  handleTitleChange = (event) => {
    this.setState(
      {
        title: event.target.value,
        errorResponse: null,
      },
      this.updateListTitle
    );
  };

  renderListTitle = () => {
    return (
      <Card.Header style={listStyle.listHeader}>
        <TextareaAutosize
          value={this.state.title}
          className="form-control mousetrap"
          style={
            this.state.focusedOnListTitle
              ? { ...listStyle.listTitle, ...listStyle.listTitleHover }
              : listStyle.listTitle
          }
          onChange={this.handleTitleChange}
          placeholder="List Title"
          inputRef={this.listTitle}
          onFocus={() => {
            this.setState({
              focusedOnListTitle: true,
            });
            Mousetrap.bind("enter", (event) => {
              event.preventDefault();
              this.listTitle.current.blur();
            });
          }}
          onBlur={() => {
            this.setState({
              focusedOnListTitle: false,
            });
            Mousetrap.reset();
          }}
        ></TextareaAutosize>
      </Card.Header>
    );
  };

  createListItem = (isCompleted = false) => {
    createNewListItem(
      (response) => {
        this.setNewListItemToFocus(response.data.id);
        this.props.refresh();
      },
      (error) => {
        console.log(error.response);
      },
      { content: "", completed: isCompleted, list_id: this.props.id }
    );
  };

  renderAddListItemButton = () => {
    return (
      <Button
        style={listStyle.listAddButton}
        variant="outline-dark"
        onClick={() => {
          this.createListItem();
        }}
      >
        <FaPlus style={listStyle.listAddIcon}></FaPlus>
        {" Add list item"}
      </Button>
    );
  };

  setNewListItemToFocus = (id) => {
    this.setState({
      idToFocus: id,
    });
  };

  renderListItem = (listItem, index) => {
    return (
      <ListItem
        key={listItem.id}
        content={listItem.content}
        id={listItem.id}
        completed={listItem.completed}
        listID={this.props.id}
        refresh={this.props.refresh}
        idToFocus={this.state.idToFocus}
        listItems={this.props.listItems}
        index={index}
        setNewListItemToFocus={this.setNewListItemToFocus}
      ></ListItem>
    );
  };

  renderNoncompletedListItems = (listItems) => {
    return (
      <>
        {listItems
          .filter((listItem) => {
            return !listItem.completed;
          })
          .map((listItem, i) => {
            return this.renderListItem(listItem, i);
          })}
      </>
    );
  };

  renderCompletedListItems = (listItems) => {
    let completedListItems = listItems.filter((listItem) => {
      return listItem.completed;
    });
    if (completedListItems.length > 0) {
      return (
        <>
          <Alert style={listStyle.listCompletedItemsAlert}>
            Completed Items
          </Alert>
          {completedListItems.map((listItem, i) => {
            return this.renderListItem(
              listItem,
              i + (listItems.length - completedListItems.length)
            );
          })}
        </>
      );
    }
    return null;
  };

  renderListItems = () => {
    const listItems = [].concat(this.props.listItems);
    return (
      <ListGroup variant="flush">
        {this.renderAddListItemButton()}
        {this.renderNoncompletedListItems(listItems)}
        {this.renderCompletedListItems(listItems)}
      </ListGroup>
    );
  };

  renderListFooter = () => {
    return (
      <ListFooter
        deleteList={this.deleteList}
        hoveringList={this.state.hoveringList}
      ></ListFooter>
    );
  };

  renderList = () => {
    return (
      <>
        <Card
          style={listStyle.listCard}
          onClick={() => {
            this.setState({
              clickedInsideList: true,
            });
          }}
          onMouseOver={() => {
            if (!this.state.hoveringList) {
              this.setState({
                hoveringList: true,
              });
            }
          }}
          onMouseLeave={() => {
            this.setState({
              hoveringList: false,
            });
          }}
        >
          {this.renderSelectIcon()}
          {this.renderListTitle()}
          {this.renderListItems()}
          {this.renderListFooter()}
        </Card>
      </>
    );
  };

  render() {
    return this.renderList();
  }
}

export default onClickOutside(List);

List.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  dateCreated: PropTypes.string.isRequired,
  listItems: PropTypes.array.isRequired,
  refresh: PropTypes.func.isRequired,
};
