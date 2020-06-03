import React from "react";
import PropTypes from "prop-types";

class ListDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listStyle: this.props.style,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.style !== prevState.listStyle) {
      var newStyle = {
        listStyle: nextProps.style,
      };
    }
  }

  render() {}
}

export default ListDelete;

ListDelete.propTypes = {
  style: PropTypes.object.isRequired,
};
