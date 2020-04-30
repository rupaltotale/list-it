import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Card, ListGroup, Button, Modal, Alert } from "react-bootstrap";
import moment from "moment";
import { FaRegTrashAlt, FaPlus } from "react-icons/fa";
import ListItem from "./ListItem";
import TextareaAutosize from "react-textarea-autosize";
import * as Mousetrap from "Mousetrap";
import OutsideInsideAlerter from "./OutsideInsideAlerter";

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

  componentDidMount() {}

  componentDidUpdate() {}

  setPreviousIdToFocus = (oldID) => {
    return new Promise((resolve, reject) => {
      const listItems = [].concat(this.props.listItems);
      if (listItems.length > 1) {
        var previousListItemID = null;
        for (var i = 0; i < listItems.length; i++) {
          if (listItems[i].id === oldID) {
            if (i > 0) {
              previousListItemID = listItems[i - 1].id;
              this.setState({ idToFocus: previousListItemID }, () => {
                resolve();
              });
            } else {
              this.setLastIdToFocus();
            }
          }
        }
      } else {
        resolve();
      }
    });
  };

  setNextIdToFocus = (oldID, isDeleting = false) => {
    return new Promise((resolve, reject) => {
      const listItems = [].concat(this.props.listItems);
      if (listItems.length > 1) {
        var nextListItemID = null;
        for (var i = 0; i < listItems.length; i++) {
          if (listItems[i].id === oldID) {
            if (i < listItems.length - 1) {
              nextListItemID = listItems[i + 1].id;
              this.setState({ idToFocus: nextListItemID }, () => {
                resolve();
              });
            } else if (isDeleting) {
              this.setPreviousIdToFocus(oldID);
            } else {
              this.setFirstIdToFocus();
            }
          }
        }
      } else {
        resolve();
      }
    });
  };

  setFirstIdToFocus = () => {
    return new Promise((resolve, reject) => {
      const listItems = [].concat(this.props.listItems);
      this.setState(
        {
          idToFocus: listItems[0].id,
        },
        () => {
          resolve();
        }
      );
    });
  };

  setLastIdToFocus = () => {
    return new Promise((resolve, reject) => {
      const listItems = [].concat(this.props.listItems);
      this.setState(
        {
          idToFocus: listItems.slice(-1)[0].id,
        },
        () => {
          resolve();
        }
      );
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
            Mousetrap.unbind("enter");
          });
        }}
        onHide={() => {
          this.toggleDeleteModal();
          Mousetrap.unbind("enter");
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
              Mousetrap.unbind("enter");
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
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

  renderListTitle = () => {
    return (
      <Card.Header className="bg-light">
        <TextareaAutosize
          style={{
            resize: "none",
            border: "none",
            fontWeight: "bold",
            fontSize: "large",
            textAlign: "center",
            boxShadow: "none",
          }}
          value={this.state.title}
          className="form-control bg-light mousetrap"
          onChange={this.handleTitleChange}
          placeholder="List Title"
          rows={1}
          inputRef={this.listTitle}
          onFocus={() => {
            Mousetrap.bind(["enter", "escape"], (event) => {
              event.preventDefault();
              this.listTitle.current.blur();
            });
          }}
          onBlur={() => {
            Mousetrap.unbind(["enter", "escape"]);
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
        this.setState(
          {
            idToFocus: response.data.id,
          },
          () => {
            this.props.refresh();
          }
        );
      })
      .catch((error) => {
        console.log(error.response);
      });
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
        setPreviousIdToFocus={this.setPreviousIdToFocus}
        setNextIdToFocus={this.setNextIdToFocus}
        createListItem={this.createListItem}
      ></ListItem>
    );
  };

  renderCompletedListItems = (listItems) => {
    var completedListItems = listItems.filter((listItem) => {
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

  renderDateCreated = () => {
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
        <OutsideInsideAlerter
          children={
            <Card
              style={{
                margin: "10px",
                width: "315px",
              }}
            >
              {this.renderListTitle()}
              {this.renderListItems()}
              {this.renderDateCreated()}
            </Card>
          }
          insideCallback={() => {
            if (!this.state.clickedInsideList) {
              console.log("Inside a list");
              this.setState({
                clickedInsideList: true,
              });
            }
          }}
          outsideCallback={() => {
            if (this.state.clickedInsideList) {
              console.log("OUUTSIDE");
              this.setState({
                clickedInsideList: false,
              });
            }
          }}
        />
      </>
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
  refresh: PropTypes.func.isRequired,
};
