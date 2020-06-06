import React from "react";
import PropTypes from "prop-types";
import CustomButton from "../../CustomComponents/Button/CustomButton";

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
    return newStyle ? { ...newStyle } : null;
  }

  renderDelete = () => {
    return (
      <>
        <i style={this.state.listStyle.listDeleteInfo}>
          Deleted Lists are permanently deleted.
        </i>
        <CustomButton
          text={"Archive"}
          style={this.state.listStyle.listArchiveButton}
          onClick={this.props.deleteList}
        ></CustomButton>
        <CustomButton
          text={"Delete"}
          style={this.state.listStyle.listDeleteButton}
          onClick={this.props.deleteList}
        ></CustomButton>
      </>
    );
  };

  render() {
    return <>{this.renderDelete()}</>;
  }
}

export default ListDelete;

ListDelete.propTypes = {
  style: PropTypes.object.isRequired,
  deleteList: PropTypes.func.isRequired,
};
