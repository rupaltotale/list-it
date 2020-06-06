import React from "react";
import PropTypes from "prop-types";
import CustomButton from "../../CustomComponents/Button/CustomButton";

class ListImages extends React.Component {
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

  renderListImages = () => {
    return (
      <>
        <i>This is list images</i>
      </>
    );
  };

  render() {
    return this.renderListImages();
  }
}

export default ListImages;

ListImages.propTypes = {
  style: PropTypes.object.isRequired,
};
