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
          title: response.data.title,
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
        <Card.Title>
          <Form>
            <InputGroup>
              <Form.Control
                required
                type="text"
                placeholder="Title cannot be blank"
                value={this.state.title}
                onChange={this.handleTitleChange}
              ></Form.Control>
              <InputGroup.Append>
                <Button
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
      <Card.Header>
        <Card.Title
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {this.state.title}
          <ButtonGroup
            style={{
              marginLeft: "auto",
            }}
          >
            <Button
              size="sm"
              variant="light"
              onClick={this.changeTitleEditState}
            >
              <FaEdit size={16}></FaEdit>
            </Button>

            {/* <Button
            size="sm"
            variant="danger"
            onClick={this.changeTitleEditState}
          >
            <FaTrashAlt size={16}></FaTrashAlt>
          </Button> */}
          </ButtonGroup>
        </Card.Title>
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
