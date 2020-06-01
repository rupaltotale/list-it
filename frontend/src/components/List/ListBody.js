import React from "react";
import PropTypes from "prop-types";
import { ListGroup, Alert } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import ListItem from "./ListItem";
import CustomButton from "../CustomComponents/Button/CustomButton";
import { createNewListItem } from "../../API";

class ListBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listStyle: this.props.style,
      idToFocus: null,
      listItems: this.props.listItems,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.style !== prevState.listStyle) {
      var newStyle = {
        listStyle: nextProps.style,
      };
    }
    if (nextProps.listItems !== prevState.listItems) {
      var newListItems = {
        listItems: nextProps.listItems,
      };
    }
    return newStyle || newListItems ? { ...newStyle, ...newListItems } : null;
  }

  setNewListItemToFocus = (id) => {
    this.setState({
      idToFocus: id,
    });
  };

  createListItem = (isCompleted = false) => {
    createNewListItem(
      (response) => {
        this.props.getListData(() => {
          this.setNewListItemToFocus(response.data.id);
        });
      },
      (error) => {
        console.log(error.response);
      },
      { content: "", completed: isCompleted, list_id: this.props.id }
    );
  };

  renderAddListItemButton = () => {
    return (
      <CustomButton
        style={this.state.listStyle.listAddButton}
        styleOnHover={this.state.listStyle.listAddButtonHover}
        onClick={() => {
          this.createListItem();
        }}
        icon={<FaPlus style={this.state.listStyle.listAddIcon}></FaPlus>}
        text={" Add list item"}
      ></CustomButton>
    );
  };

  renderListItem = (listItem, index) => {
    return (
      <ListItem
        key={listItem.id}
        content={listItem.content}
        id={listItem.id}
        completed={listItem.completed}
        listID={this.props.id}
        idToFocus={this.state.idToFocus}
        listItems={this.state.listItems}
        getListData={this.props.getListData}
        index={index}
        style={this.state.listStyle}
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
          <Alert style={this.state.listStyle.listCompletedItemsAlert}>
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
    const listItems = [].concat(this.state.listItems);
    return (
      <ListGroup variant="flush" style={this.state.listStyle.listGroup}>
        {this.renderAddListItemButton()}
        {this.renderNoncompletedListItems(listItems)}
        {this.renderCompletedListItems(listItems)}
      </ListGroup>
    );
  };

  render() {
    return this.renderListItems();
  }
}

export default ListBody;

ListBody.propTypes = {
  style: PropTypes.object.isRequired,
  listItems: PropTypes.array,
  getListData: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};
