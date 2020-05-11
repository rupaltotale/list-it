import React from "react";
import PropTypes from "prop-types";
import TextareaAutosize from "react-textarea-autosize";
import * as Mousetrap from "Mousetrap";
import onClickOutside from "react-onclickoutside";
import { Card, ListGroup, Button, Modal, Alert } from "react-bootstrap";
import {
  FaTrashAlt,
  FaPlus,
  FaPalette,
  FaBell,
  FaUserPlus,
  FaImages,
  FaCheck,
} from "react-icons/fa";
import ListItem from "./ListItem";
import CustomButton from "./CustomComponents/CustomButton";
import CustomModal from "./CustomComponents/CustomModal";
import { createNewListItem, deleteList, updateList } from "../API";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.listTitle = React.createRef();
    this.state = {
      title: this.props.title,
      errorResponse: null,
      showDeleteModal: false,
      idToFocus: null,
      clickedInsideList: false,
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
        this.toggleDeleteModal();
        this.props.refresh();
      },
      (error) => {
        console.log(error.response);
      },
      { id: this.props.id }
    );
  };

  toggleDeleteModal = () => {
    this.setState(
      {
        showDeleteModal: !this.state.showDeleteModal,
      },
      this.renderDeleteModal
    );
  };

  renderDeleteModal = () => {
    return (
      <CustomModal
        showModal={this.state.showDeleteModal}
        onShow={() => {
          Mousetrap.bind("enter", () => {
            this.deleteList();
            Mousetrap.reset();
          });
        }}
        onHide={() => {
          this.toggleDeleteModal();
          Mousetrap.reset();
        }}
        title={
          <>
            {"Delete "}
            <em>{this.state.title}</em>{" "}
          </>
        }
        body={
          "Are you sure you want to delete this list? This action cannot be undone."
        }
        footer={
          <Button
            variant="danger"
            onClick={() => {
              this.deleteList();
              Mousetrap.reset();
            }}
          >
            Delete
          </Button>
        }
      ></CustomModal>
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
      <div className="list-select">
        <FaCheck size={16}></FaCheck>
      </div>
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
      <Card.Header className="list-header">
        <TextareaAutosize
          value={this.state.title}
          className="list-title mousetrap"
          onChange={this.handleTitleChange}
          placeholder="List Title"
          inputRef={this.listTitle}
          onFocus={() => {
            Mousetrap.bind("enter", (event) => {
              event.preventDefault();
              this.listTitle.current.blur();
            });
          }}
          onBlur={() => {
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
        className="btn-add"
        variant={null}
        onClick={() => {
          this.createListItem();
        }}
      >
        <FaPlus></FaPlus>
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
          <Alert className="list-completed-items-alert">Completed Items</Alert>
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

  renderFooterButtons = (buttons) => {
    let createdButtons = [];
    buttons.forEach((button) => {
      createdButtons.push(
        <CustomButton
          className="btn-icon"
          onClick={button.onClick}
          icon={button.icon}
        />
      );
    });
    return (
      <>
        {createdButtons.map((createdButton, i) => {
          return (
            <div key={i} className="btn-div">
              {createdButton}
            </div>
          );
        })}
      </>
    );
  };

  renderListFooter = () => {
    return (
      <Card.Footer className="list-footer">
        {this.renderFooterButtons([
          { icon: <FaBell size={18}></FaBell> },
          { icon: <FaUserPlus size={18}></FaUserPlus> },
          { icon: <FaPalette size={18}></FaPalette> },
          { icon: <FaImages size={18}></FaImages> },
          {
            icon: <FaTrashAlt size={18}></FaTrashAlt>,
            onClick: () => {
              this.toggleDeleteModal();
            },
          },
        ])}
      </Card.Footer>
    );
  };

  renderList = () => {
    return (
      <>
        {this.renderDeleteModal()}
        <Card
          className="list-card"
          onClick={() => {
            this.setState({
              clickedInsideList: true,
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
