import React from "react";
import PropTypes from "prop-types";
import { Card, ListGroup, Button, Alert } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import ListItem from "./ListItem";
import { createNewListItem, deleteList, updateList } from "../../API";
import ListStyle from "./ListStyle";
import ListFooter from "./ListFooter";
import ListHeader from "./ListHeader";
import ListColors from "./ListColors";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idToFocus: null,
      hoveringList: false,
      shouldRenderColorDropDown: false,
      color: this.props.color,
      title: this.props.title,
    };
    this.listStyle = new ListStyle(this.state.color);
  }

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

  updateListTitle = (title, callback = null) => {
    this.setState(
      {
        title: title,
      },
      () => {
        updateList(
          (response) => {
            callback ? callback(response.data.title) : null;
            return response.data.title;
          },
          (error) => {
            console.log(error.response);
          },
          {
            id: this.props.id,
            title: this.state.title,
            color: this.state.color,
          }
        );
      }
    );
  };

  updateListColor = (color, callback = null) => {
    this.listStyle.setNewBackgroundColor(color);
    this.setState(
      {
        color: color,
      },
      () => {
        updateList(
          (response) => {
            callback ? callback(response.data.color) : null;
            return response.data.color;
          },
          (error) => {
            console.log(error.response);
          },
          {
            id: this.props.id,
            title: this.state.title,
            color: this.state.color,
          }
        );
      }
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

  setNewColor = (color) => {
    this.setState({
      color: color,
    });
  };

  renderListHeader = () => {
    return (
      <ListHeader
        updateListTitle={this.updateListTitle}
        hoveringList={this.state.hoveringList}
        title={this.props.title}
        style={this.listStyle}
      ></ListHeader>
    );
  };

  renderAddListItemButton = () => {
    return (
      <Button
        style={this.listStyle.listAddButton}
        variant="outline-dark"
        onClick={() => {
          this.createListItem();
        }}
      >
        <FaPlus style={this.listStyle.listAddIcon}></FaPlus>
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
        style={this.listStyle}
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
          <Alert style={this.listStyle.listCompletedItemsAlert}>
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
        shouldRenderColorDropDown={this.shouldRenderColorDropDown}
        style={this.listStyle}
      ></ListFooter>
    );
  };

  toggleHoverList = (bool, callback) => {
    if (bool && !this.state.hoveringList) {
      this.setState(
        {
          hoveringList: bool,
        },
        callback ? callback : null
      );
    } else if (!bool) {
      this.setState(
        {
          hoveringList: bool,
        },
        callback ? callback : null
      );
    }
  };

  renderList = () => {
    return (
      <div style={this.listStyle.list}>
        <Card
          style={this.listStyle.listCard}
          onKeyDown={() => {
            this.toggleHoverList(true, () => {
              setTimeout(() => {
                this.toggleHoverList(false);
              }, 1000);
            });
          }}
          onMouseOver={() => {
            this.toggleHoverList(true);
          }}
          onMouseLeave={() => {
            this.toggleHoverList(false);
          }}
        >
          {this.renderListHeader()}
          {this.renderListItems()}
          {this.renderListFooter()}
        </Card>
        {this.renderColorDropDown()}
      </div>
    );
  };

  shouldRenderColorDropDown = (bool) => {
    if (bool && !this.state.shouldRenderColorDropDown) {
      this.setState({
        shouldRenderColorDropDown: bool,
      });
    } else if (!bool && this.state.shouldRenderColorDropDown) {
      this.setState({
        shouldRenderColorDropDown: bool,
      });
    }
  };

  renderColorDropDown = () => {
    return (
      <div
        style={
          this.state.shouldRenderColorDropDown
            ? this.listStyle.listColorDropDownShow
            : this.listStyle.listColorDropDownHide
        }
      >
        <ListColors
          currentColor={this.state.color}
          updateListColor={this.updateListColor}
          shouldRenderColorDropDown={this.shouldRenderColorDropDown}
          toggleHoverList={this.toggleHoverList}
          style={this.listStyle}
        ></ListColors>
      </div>
    );
  };

  render() {
    return this.renderList();
  }
}

export default List;

List.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  dateCreated: PropTypes.string.isRequired,
  listItems: PropTypes.array.isRequired,
  color: PropTypes.string,
  refresh: PropTypes.func.isRequired,
};
