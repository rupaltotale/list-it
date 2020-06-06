import React from "react";
import PropTypes from "prop-types";
import CustomButton from "../../CustomComponents/Button/CustomButton";

class ListSharing extends React.Component {
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
    return newStyle ? { ...newStyle } : null;
  }

  renderListSharing = () => {
    return (
      <>
        <i>This is list sharing</i>
      </>
    );
  };

  render() {
    return this.renderListSharing();
  }
}

export default ListSharing;

ListSharing.propTypes = {
  style: PropTypes.object.isRequired,
};
