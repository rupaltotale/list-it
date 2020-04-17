import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { ListGroupItem } from "react-bootstrap";

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  renderListItem() {
    return <ListGroupItem>{this.props.content}</ListGroupItem>;
  }

  render() {
    return this.renderListItem();
  }
}

export default ListItem;

ListItem.propTypes = {
  id: PropTypes.number.isRequired,
  completed: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
};
