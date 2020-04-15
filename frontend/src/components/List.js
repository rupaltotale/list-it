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
import { FaRegCheckSquare, FaEdit, FaTrashAlt } from "react-icons/fa";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      currentlyEditingTitle: false,
      errorResponse: null,
    };
  }

  componentDidMount() {}

  handleTitleChange = (titleData) => {
    this.setState(
      {
        title: titleData.target.value,
        errorResponse: null,
      },
      () => {
        if (!this.state.title) {
          this.setState({
            errorResponse: "This field may not be blank",
          });
        }
      }
    );
  };

  changeTitleEditState = () => {
    if (this.state.currentlyEditingTitle) {
      this.setState({
        currentlyEditingTitle: false,
      });
    } else {
      this.setState({
        currentlyEditingTitle: true,
      });
    }
  };

  updateListTitle = (event) => {
    event.preventDefault();
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
        console.log(response);
        this.changeTitleEditState();
        this.setState({
          title: response.data,
          errorResponse: null,
        });
      })
      .catch((error) => {
        this.setState({
          errorResponse: error.response.data.title,
        });
      });
  };

  renderEditingListTitle = () => {
    return (
      <Card.Header className="d-flex justify-content-center">
        <Card.Title className="my-0">
          <Form>
            <InputGroup>
              <Form.Control
                required
                className="pr-5"
                type="text"
                placeholder="Title cannot be blank"
                value={this.state.title}
                onChange={this.handleTitleChange}
              ></Form.Control>
              <InputGroup.Append>
                <Button
                  className="mr-4"
                  size="sm"
                  type="submit"
                  variant={this.state.errorResponse ? "danger" : "success"}
                  onClick={this.updateListTitle}
                >
                  <FaRegCheckSquare size={20}></FaRegCheckSquare>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
        </Card.Title>
      </Card.Header>
    );
  };

  renderFixedListTitle = () => {
    return (
      <Card.Header className="d-flex justify-content-between">
        <Card.Title className="ml-3 my-0">{this.state.title}</Card.Title>
        <ButtonGroup>
          <Button
            size="sm"
            variant="warning"
            className="mr-2"
            onClick={this.changeTitleEditState}
          >
            <FaEdit size={16}></FaEdit>
          </Button>

          {/* <Button
            className="mr-4"
            size="sm"
            variant="danger"
            onClick={this.changeTitleEditState}
          >
            <FaTrashAlt size={16}></FaTrashAlt>
          </Button> */}
        </ButtonGroup>
      </Card.Header>
    );
  };

  renderListTitle = () => {
    if (this.state.currentlyEditingTitle) {
      return this.renderEditingListTitle();
    } else {
      return this.renderFixedListTitle();
    }
  };

  renderListItems = () => {
    return (
      <Card.Body className="flex-fill">
        <ListGroup variant="flush">
          {this.props.listItems.map((listItem) => {
            return (
              <ListGroupItem className="p-1 m-1" key={listItem.id}>
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
      <Card>
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
