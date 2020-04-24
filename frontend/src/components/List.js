import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Card,
  Col,
  ListGroup,
  ListGroupItem,
  Button,
  InputGroup,
  Form,
  ButtonGroup,
  Modal,
  Alert,
} from "react-bootstrap";
import moment from "moment";
import {
  FaRegCheckSquare,
  FaEdit,
  FaRegTrashAlt,
  FaRegWindowClose,
  FaPlus,
} from "react-icons/fa";
import ListItem from "./ListItem";
import TextareaAutosize from "react-textarea-autosize";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      errorResponse: null,
      showDeleteModal: false,
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

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
      <Modal show={this.state.showDeleteModal} onHide={this.toggleDeleteModal}>
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
      <Button size="sm" variant="light" onClick={this.toggleDeleteModal}>
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
            textAlign: "center",
          }}
          value={this.state.title}
          className="form-control bg-light shadow-none"
          onChange={this.handleTitleChange}
          placeholder="List Title"
          rows={1}
        ></TextareaAutosize>
      </Card.Header>
    );
  };

  createListItem = () => {
    axios
      .post(
        "http://127.0.0.1:8000/api/v1/list_item/new",
        {
          content: "",
          completed: false,
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
        this.props.refresh();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  renderListItem = (listItem) => {
    return (
      <ListItem
        key={listItem.id + "_" + this.props.id}
        content={listItem.content}
        id={listItem.id}
        completed={listItem.completed}
        list_id={this.props.id}
        refresh={this.props.refresh}
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
        onClick={this.createListItem}
      >
        <FaPlus style={{ margin: "2px" }}></FaPlus>
        {" Add list item"}
      </Button>
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
            }}
          >
            <b>Completed Items</b>
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
        Created on{" "}
        {moment(this.props.dateCreated).format("MMMM Do, YYYY (h:mm A)")}
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
        <React.Fragment>{this.renderDeleteModal()}</React.Fragment>
        <Card style={{ margin: "10px", width: "315px" }}>
          {this.renderListTitle()}
          {this.renderListItems()}
          {this.renderDateCreated()}
        </Card>
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
