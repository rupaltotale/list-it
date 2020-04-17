import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { ListGroupItem, InputGroup, Form } from "react-bootstrap";

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changingContent: this.props.content,
      currentlyEditingContent: false,
      errorResponse: null,
    };
  }

  componentDidMount() {}

  componentDidUpdate() {
    this.props.changeTextAreaHeight();
  }

  handleContentChange = (contentData) => {
    this.setState(
      {
        changingContent: contentData.target.value,
        errorResponse: null,
      },
      () => {
        if (!this.state.changingContent) {
          this.setState({
            errorResponse: "This field may not be blank",
          });
        }
      }
    );
  };

  renderListItemContent = () => {
    return (
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
          placeholder="Content cannot be blank"
          value={this.state.changingContent}
          onChange={this.handleContentChange}
          readOnly={!this.state.currentlyEditingContent}
          plaintext={!this.state.currentlyEditingContent}
          onClick={() => {
            this.setState({ currentlyEditingContent: true });
          }}
          onBlur={() => {
            this.setState({ currentlyEditingContent: false });
          }}
        ></Form.Control>
      </InputGroup>
    );
  };
  renderListItem = () => {
    return <ListGroupItem>{this.renderListItemContent()}</ListGroupItem>;
  };

  render() {
    return this.renderListItem();
  }
}

export default ListItem;

ListItem.propTypes = {
  id: PropTypes.number.isRequired,
  completed: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
  changeTextAreaHeight: PropTypes.func.isRequired,
};
