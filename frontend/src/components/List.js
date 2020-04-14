import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Card,
  Col,
  ListGroup,
  ListGroupItem,
  CardGroup,
  Button,
  CardDeck,
  InputGroup,
  FormControl,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import moment from "moment";
import { FaRegCheckSquare } from "react-icons/fa";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      title: this.props.title,
      currentlyEditingTitle: false,
      isButtonDisabled: false,
    };
  }

  componentDidMount() {}

  changeTitleEditState = () => {
    this.setState({
      currentlyEditingTitle: !this.state.currentlyEditingTitle,
      isButtonDisabled: true,
    });
  };

  changeTitle = () => {
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
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  renderListTitle = () => {
    if (this.state.currentlyEditingTitle) {
      return (
        <InputGroup>
          <FormControl
            size="sm"
            required
            type="text"
            value={this.state.title}
            onChange={(formData) => {
              this.setState({
                title: formData.target.value,
              });
            }}
          ></FormControl>
          <InputGroup.Append>
            <Button variant="secondary" onClick={this.changeTitle}>
              <FaRegCheckSquare size={17}></FaRegCheckSquare>
            </Button>
          </InputGroup.Append>
        </InputGroup>
      );
    } else {
      return <Card.Title className="m-0">{this.state.title}</Card.Title>;
    }
  };

  renderListItems = () => {
    return (
      <ListGroup variant="flush">
        {this.props.listItems.map((listItem) => {
          return (
            <ListGroupItem key={listItem.id}>This is a list item</ListGroupItem>
          );
        })}
      </ListGroup>
    );
  };

  renderList = () => {
    return (
      <CardDeck className="m-2">
        <Card className="text-center">
          <Card.Header>List ID: {this.props.id}</Card.Header>
          <Card.Body>
            <Button
              className="m-0 p-2"
              variant="light"
              onClick={this.changeTitleEditState}
              disabled={this.state.isButtonDisabled}
            >
              {this.renderListTitle()}
            </Button>
            <CardDeck className="text-center">
              {this.renderListItems()}
            </CardDeck>
          </Card.Body>
          <Card.Footer>
            Created on{" "}
            {moment(this.props.dateCreated).format("MMMM Do, YYYY (h:mm A)")}
          </Card.Footer>
        </Card>
      </CardDeck>
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
