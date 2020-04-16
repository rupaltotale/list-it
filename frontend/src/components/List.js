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
} from "react-bootstrap";
import moment from "moment";
import {
  FaRegCheckSquare,
  FaEdit,
  FaTrashAlt,
  FaCross,
  FaRegWindowClose,
} from "react-icons/fa";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      changingTitle: this.props.title,
      currentlyEditingTitle: false,
      errorResponse: null,
    };
  }

  componentDidMount() {}

  handleTitleChange = (titleData) => {
    this.setState(
      {
        changingTitle: titleData.target.value,
        errorResponse: null,
      },
      () => {
        if (!this.state.changingTitle) {
          this.setState({
            errorResponse: "This field may not be blank",
          });
        }
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
        console.log(response);
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

  renderButtons = () => {
    if (!this.state.currentlyEditingTitle) {
      return (
        <Button size="sm" variant="light" onClick={this.changeTitleEditState}>
          <FaEdit size={20} color="green"></FaEdit>
        </Button>
      );
    } else {
      return (
        <>
          <Button
            size="sm"
            type="submit"
            variant="light"
            onClick={this.updateListTitle}
          >
            <FaRegCheckSquare size={20} color="green"></FaRegCheckSquare>
          </Button>
          <Button size="sm" variant="light" onClick={this.changeTitleEditState}>
            <FaRegWindowClose size={20} color="red"></FaRegWindowClose>
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
        <InputGroup style={{ height: "100%", width: "70%" }}>
          <Form.Control
            required
            type="text"
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
        <ListGroup variant="flush">
          {this.props.listItems.map((listItem) => {
            return (
              <ListGroupItem key={listItem.id}>
                This is a list item
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </Card.Body>
    );
  };

  renderDateCreated() {
    return (
      <Card.Footer>
        Created on{" "}
        {moment(this.props.dateCreated).format("MMMM Do, YYYY (h:mm A)")}
      </Card.Footer>
    );
  }

  renderList = () => {
    return (
      <Card style={{ margin: "5px", minWidth: "315px" }}>
        {this.renderListTitle()}
        {this.renderListItems()}
        {this.renderDateCreated()}
      </Card>
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
};
