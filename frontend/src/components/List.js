import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Card, ListGroup, Button, Modal, Alert } from "react-bootstrap";
import moment from "moment";
import { FaRegTrashAlt, FaPlus } from "react-icons/fa";
import ListItem from "./ListItem";
import TextareaAutosize from "react-textarea-autosize";
import * as Mousetrap from "Mousetrap";
import onClickOutside from "react-onclickoutside";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.listTitle = React.createRef();
    this.state = {
      title: this.props.title,
      errorResponse: null,
      showDeleteModal: false,
      focusedOnListTitle: false,
      idToFocus: null,
      clickedInsideList: false,
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

  handleClickOutside = (event) => {
    if (this.state.clickedInsideList) {
      this.setState({
        clickedInsideList: false,
      });
    }
  };

  findCompletedStatusOfListItem = (id) => {
    const listItems = [].concat(this.props.listItems);
    for (let i = 0; i < listItems.length; i++) {
      //Match found
      if (listItems[i].id === id) {
        if (listItems[i].completed) {
          return true;
        } else {
          return false;
        }
      }
    }
  };

  setCurrentListItemToFocus = (id) => {
    this.setState({
      idToFocus: id,
    });
  };

  setPreviousListItemToFocus = (oldID, isCompleted = null) => {
    const listItems = [].concat(this.props.listItems);
    //If there are list items
    if (listItems.length > 1) {
      //If the completed status of the list item is defined
      if (typeof isCompleted !== "boolean") {
        isCompleted = this.findCompletedStatusOfListItem(oldID);
      }
      //Filter list items based on completed status
      const filteredListItems = listItems.filter((listItem) => {
        if (isCompleted) {
          return listItem.completed;
        }
        return !listItem.completed;
      });
      //Iterate filtered list items
      for (let i = 0; i < filteredListItems.length; i++) {
        //Match found
        if (filteredListItems[i].id === oldID) {
          if (i > 0) {
            let previousListID = filteredListItems[i - 1].id;
            this.setState({
              idToFocus: previousListID,
            });
          } else {
            this.setLastListItemToFocus(!isCompleted);
          }
          break;
        }
      }
    }
  };

  setNextListItemToFocus = (oldID, isCompleted = null, isDeleting = false) => {
    const listItems = [].concat(this.props.listItems);
    //If there are list items
    if (listItems.length > 1) {
      //If the completed status of the list item is defined
      if (typeof isCompleted !== "boolean") {
        isCompleted = this.findCompletedStatusOfListItem(oldID);
      }
      //Filter list items based on completed status
      const filteredListItems = listItems.filter((listItem) => {
        if (isCompleted) {
          return listItem.completed;
        }
        return !listItem.completed;
      });
      //Iterate through filtered list items
      for (let i = 0; i < filteredListItems.length; i++) {
        //Match found
        if (filteredListItems[i].id === oldID) {
          if (i < filteredListItems.length - 1) {
            let nextListItemID = filteredListItems[i + 1].id;
            this.setState({
              idToFocus: nextListItemID,
            });
          } else if (isDeleting) {
            this.setPreviousListItemToFocus(oldID, isCompleted);
          } else {
            this.setFirstListItemToFocus(!isCompleted);
          }
          break;
        }
      }
    }
  };

  setFirstListItemToFocus = (focusFirstCompleted = false) => {
    const listItems = [].concat(this.props.listItems);
    let filteredListItems;
    if (focusFirstCompleted) {
      filteredListItems = listItems.filter((listItem) => {
        return listItem.completed;
      });
    } else {
      filteredListItems = listItems.filter((listItem) => {
        return !listItem.completed;
      });
    }

    if (filteredListItems.length > 0) {
      this.setState({
        idToFocus: filteredListItems[0].id,
      });
    } else if (listItems.length > 0) {
      this.setState({
        idToFocus: listItems[0].id,
      });
    }
  };

  setLastListItemToFocus = (focusLastCompleted = true) => {
    const listItems = [].concat(this.props.listItems);
    let filteredListItems;
    if (focusLastCompleted) {
      filteredListItems = listItems.filter((listItem) => {
        return listItem.completed;
      });
    } else {
      filteredListItems = listItems.filter((listItem) => {
        return !listItem.completed;
      });
    }

    if (filteredListItems.length > 0) {
      this.setState({
        idToFocus: filteredListItems.slice(-1)[0].id,
      });
    } else if (listItems.length > 0) {
      this.setState({
        idToFocus: listItems.slice(-1)[0].id,
      });
    }
  };

  deleteList = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/v1/lists/${this.props.id}/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        this.toggleDeleteModal();
        this.props.refresh();
      })
      .catch((error) => {
        console.log(error.response);
      });
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
      <Modal
        show={this.state.showDeleteModal}
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
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Delete <em>{this.state.title}</em>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this list? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              this.deleteList();
              Mousetrap.reset();
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  updateListTitle = () => {
    axios
      .put(
        `http://127.0.0.1:8000/api/v1/lists/${this.props.id}/`,
        {
          title: this.state.title,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        this.setState({
          title: response.data.title,
          errorResponse: null,
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
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
      <Card.Header className="bg-light" style={{}}>
        <TextareaAutosize
          style={{
            resize: "none",
            border: "none",
            fontWeight: "bold",
            fontSize: "large",
            textAlign: "center",
            boxShadow: "none",
            textShadow: this.state.focusedOnListTitle
              ? "1px 1px 2px lightGray"
              : "none",
          }}
          value={this.state.title}
          className="form-control bg-light mousetrap"
          onChange={this.handleTitleChange}
          placeholder="List Title"
          rows={1}
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
    axios
      .post(
        "http://127.0.0.1:8000/api/v1/list_item/new",
        {
          content: "",
          completed: isCompleted,
          list_id: this.props.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        this.setCurrentListItemToFocus(response.data.id);
        this.props.refresh();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  renderAddListItemButton = () => {
    return (
      <Button
        variant="outline-primary"
        style={{
          width: "wrap-content",
          margin: "6px 6px",
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => {
          this.createListItem();
        }}
      >
        <FaPlus style={{ margin: "2px" }}></FaPlus>
        {" Add list item"}
      </Button>
    );
  };

  renderListItem = (listItem) => {
    return (
      <ListItem
        key={listItem.id}
        content={listItem.content}
        id={listItem.id}
        completed={listItem.completed}
        list_id={this.props.id}
        refresh={this.props.refresh}
        idToFocus={this.state.idToFocus}
        setPreviousListItemToFocus={this.setPreviousListItemToFocus}
        setNextListItemToFocus={this.setNextListItemToFocus}
        setCurrentListItemToFocus={this.setCurrentListItemToFocus}
        createListItem={this.createListItem}
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
          .map((listItem) => {
            return this.renderListItem(listItem);
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
          <Alert
            style={{
              borderRadius: "0px",
              marginTop: "0px",
              marginBottom: "0px",
              paddingBottom: "10px",
              fontWeight: "bold",
            }}
          >
            Completed Items
          </Alert>
          {completedListItems.map((listItem) => {
            return this.renderListItem(listItem);
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

  renderDeleteButton = () => {
    return (
      <Button
        size="sm"
        variant="light"
        onClick={() => {
          this.toggleDeleteModal();
        }}
      >
        <FaRegTrashAlt size={20} color="red"></FaRegTrashAlt>
      </Button>
    );
  };

  renderListFooter = () => {
    return (
      <Card.Footer
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "flex-center",
          alignItems: "flex-center",
          height: "100%",
        }}
      >
        {moment(this.props.dateCreated).format("[Created on] MMMM Do, YYYY")}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-center",
          }}
        >
          {this.renderDeleteButton()}
        </div>
      </Card.Footer>
    );
  };

  renderList = () => {
    return (
      <>
        {this.renderDeleteModal()}
        <Card
          style={{
            margin: "10px",
            width: "315px",
          }}
          onClick={() => {
            this.setState({
              clickedInsideList: true,
            });
          }}
        >
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
