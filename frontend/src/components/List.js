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
} from "react-bootstrap";
import moment from "moment";
import {
  FaRegCheckSquare,
  FaEdit,
  FaRegTrashAlt,
  FaCross,
  FaRegWindowClose,
} from "react-icons/fa";
import ListItem from "./ListItem";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      changingTitle: this.props.title,
      currentlyEditingTitle: false,
      errorResponse: null,
      showDeleteModal: false,
    };
  }

  componentDidMount() {
    this.changeTextAreaHeight();
  }

  componentDidUpdate() {
    this.changeTextAreaHeight();
  }

  changeTextAreaHeight = () => {
    var tx = document.getElementsByTagName("textarea");
    for (var i = 0; i < tx.length; i++) {
      tx[i].setAttribute("style", "height: auto");
      tx[i].setAttribute(
        "style",
        "height:" + tx[i].scrollHeight + "px; resize: none; overflow: hidden"
      );
    }
  };

  handleTitleChange = (event) => {
    this.setState(
      {
        changingTitle: event.target.value,
        errorResponse: null,
      },
      () => {
        if (!this.state.changingTitle) {
          this.setState({
            errorResponse: "This field may not be blank",
          });
        }
        // event.target.scrollHeight
      }
    );
  };

  changeTitleEditState = () => {
    this.setState({
      currentlyEditingTitle: !this.state.currentlyEditingTitle,
      changingTitle: this.state.title,
    });
  };

  updateListTitle = (event) => {
    event.preventDefault();
    axios
      .put(
        `http://127.0.0.1:8000/api/v1/lists/${this.props.id}/`,
        {
          title: this.state.changingTitle,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        this.changeTitleEditState();
        this.setState({
          title: response.data.title,
          changingTitle: response.data.title,
          errorResponse: null,
        });
      })
      .catch((error) => {
        this.setState({
          errorResponse: error.response.data.title,
        });
      });
  };

  toggleModal = () => {
    this.setState(
      {
        showDeleteModal: !this.state.showDeleteModal,
      },
      this.renderDeleteModal
    );
  };

  renderDeleteModal = () => {
    return (
      <Modal show={this.state.showDeleteModal} onHide={this.toggleModal}>
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
          <Button variant="secondary" onClick={this.toggleModal}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              this.props.deleteList(this.props.id, this.toggleModal);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  renderButtons = () => {
    if (this.state.currentlyEditingTitle) {
      return (
        <>
          <Button size="sm" variant="light" onClick={this.updateListTitle}>
            <FaRegCheckSquare size={20} color="green"></FaRegCheckSquare>
          </Button>
          <Button size="sm" variant="light" onClick={this.changeTitleEditState}>
            <FaRegWindowClose size={20} color="red"></FaRegWindowClose>
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button size="sm" variant="light" onClick={this.changeTitleEditState}>
            <FaEdit size={20} color="blue"></FaEdit>
          </Button>
          <Button size="sm" variant="light" onClick={this.toggleModal}>
            <FaRegTrashAlt size={20} color="red"></FaRegTrashAlt>
          </Button>
        </>
      );
    }
  };

  renderListTitle = () => {
    return (
      <Card.Header
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "flex-center",
          alignItems: "flex-center",
          height: "100%",
        }}
      >
        <InputGroup
          style={{
            height: "100%",
            width: "70%",
          }}
        >
          <Form.Control
            required
            as="textarea"
            rows="1"
            placeholder="Title cannot be blank"
            value={this.state.changingTitle}
            onChange={this.handleTitleChange}
            disabled={!this.state.currentlyEditingTitle}
            plaintext={!this.state.currentlyEditingTitle}
          ></Form.Control>
        </InputGroup>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-center",
          }}
        >
          {this.renderButtons()}
        </div>
      </Card.Header>
    );
  };

  renderListItems = () => {
    return (
      <Card.Body>
        <ListGroup>
          {this.props.listItems.map((listItem) => {
            return (
              <ListItem
                key={listItem.id}
                content={listItem.content}
                id={listItem.id}
                completed={listItem.completed}
                changeTextAreaHeight={this.changeTextAreaHeight}
              ></ListItem>
            );
          })}
        </ListGroup>
      </Card.Body>
    );
  };

  renderDateCreated = () => {
    return (
      <Card.Footer>
        Created on{" "}
        {moment(this.props.dateCreated).format("MMMM Do, YYYY (h:mm A)")}
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
  deleteList: PropTypes.func.isRequired,
};
