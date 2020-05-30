import React from "react";
import PropTypes from "prop-types";
import { Card, ListGroup, Button, Alert } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import ListItem from "./ListItem";
import { createNewListItem, deleteList, updateList, getList } from "../../API";
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
      listItems: this.props.listItems,
      theme: this.props.theme,
      listStyle: new ListStyle(this.props.color, this.props.theme),
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.theme !== prevState.theme) {
      console.log("NEXT PROPS COLOR: ", nextProps.color);
      return {
        theme: nextProps.theme,
        listStyle: new ListStyle(prevState.color, nextProps.theme),
      };
    }
    return null;
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

  updateList = (properties, callback = null) => {
    if (properties.color != null) {
      this.setState({
        listStyle: this.state.listStyle.setNewBackgroundColor(properties.color),
      });
    }
    this.setState(properties, () => {
      updateList(
        (response) => {
          console.log(response.data);
          callback ? callback(response.data) : null;
          return response.data;
        },
        (error) => {
          console.log(error.response);
        },
        {
          id: this.props.id,
          title: this.state.title,
          color: this.state.color,
          list_items: this.state.listItems,
        }
      );
    });
  };

  getListData = (callback) => {
    getList(
      (response) => {
        this.setState(
          {
            color: response.data.color,
            title: response.data.title,
            listItems: response.data.list_items,
          },
          callback ? callback() : null
        );
      },
      (error) => {
        console.log(error.response);
      },
      { id: this.props.id }
    );
  };

  createListItem = (isCompleted = false) => {
    createNewListItem(
      (response) => {
        this.getListData(() => {
          this.setNewListItemToFocus(response.data.id);
        });
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
        updateListTitle={this.updateList}
        hoveringList={this.state.hoveringList}
        title={this.props.title}
        style={this.state.listStyle}
      ></ListHeader>
    );
  };

  renderAddListItemButton = () => {
    return (
      <Button
        style={this.state.listStyle.listAddButton}
        variant="outline-dark"
        onClick={() => {
          this.createListItem();
        }}
      >
        <FaPlus style={this.state.listStyle.listAddIcon}></FaPlus>
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
        idToFocus={this.state.idToFocus}
        listItems={this.state.listItems}
        getListData={this.getListData}
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

  renderListFooter = () => {
    return (
      <ListFooter
        deleteList={this.deleteList}
        hoveringList={this.state.hoveringList}
        shouldRenderColorDropDown={this.shouldRenderColorDropDown}
        style={this.state.listStyle}
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
      <div style={this.state.listStyle.list}>
        <Card
          style={
            this.state.hoveringList
              ? this.state.listStyle.listCardHover(
                  this.state.shouldRenderColorDropDown
                )
              : this.state.listStyle.listCard(
                  this.state.shouldRenderColorDropDown
                )
          }
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
            ? this.state.listStyle.listColorDropDownShow(
                this.state.shouldRenderColorDropDown
              )
            : this.state.listStyle.listColorDropDownHide(
                this.state.shouldRenderColorDropDown
              )
        }
      >
        <ListColors
          currentColor={this.state.color}
          updateListColor={this.updateList}
          shouldRenderColorDropDown={this.shouldRenderColorDropDown}
          toggleHoverList={this.toggleHoverList}
          style={this.state.listStyle}
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
  theme: PropTypes.string.isRequired,
};
