import React from "react";
import PropTypes from "prop-types";
import CustomButton from "../CustomComponents/Button/CustomButton";
import { FaTimes } from "react-icons/fa";
import { deleteTag } from "../../API";

class ListTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoveringTag: false,
      name: this.props.name,
      listStyle: this.props.style,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.name !== prevState.name) {
      var newName = {
        name: nextProps.name,
      };
    }
    if (nextProps.style !== prevState.listStyle) {
      var newStyle = {
        listStyle: nextProps.style,
      };
    }
    return newName || newStyle ? { ...newName, ...newStyle } : null;
  }

  deleteTag = () => {
    deleteTag(
      (response) => {
        this.props.getListData();
      },
      (error) => {
        console.log(error.response);
      },
      { id: this.props.id }
    );
  };

  renderTag = () => {
    return (
      <div
        onMouseOver={() => {
          if (!this.state.hoveringTag) {
            this.setState({
              hoveringTag: true,
            });
          }
        }}
        onMouseLeave={() => {
          this.setState({
            hoveringTag: false,
          });
        }}
        style={
          this.state.hoveringTag
            ? this.state.listStyle.listTagHover
            : this.state.listStyle.listTag
        }
      >
        <label
          style={
            this.state.hoveringTag
              ? this.state.listStyle.listTagLabelHover
              : this.state.listStyle.listTagLabel
          }
        >
          {this.props.name}
        </label>
        <CustomButton
          onClick={this.deleteTag}
          style={
            this.state.hoveringTag
              ? this.state.listStyle.listTagRemoveButtonShow
              : this.state.listStyle.listTagRemoveButton
          }
          styleOnHover={this.state.listStyle.listTagRemoveButtonHover}
          icon={
            <FaTimes
              style={this.state.listStyle.listTagRemoveIcon}
              size={14}
            ></FaTimes>
          }
        ></CustomButton>
      </div>
    );
  };

  render() {
    return this.renderTag();
  }
}

export default ListTag;

ListTag.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  getListData: PropTypes.func.isRequired,
};
