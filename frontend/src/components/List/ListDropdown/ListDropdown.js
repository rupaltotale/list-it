import React from "react";
import PropTypes from "prop-types";
import ListColors from "./ListColors";

class ListDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listStyle: this.props.listStyle,
      shouldRenderDropDown: this.props.shouldRenderDropDown,
      typeOfDropdown: this.props.typeOfDropdown,
      color: this.props.color,
      hoveringDropdown: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.listStyle !== prevState.listStyle) {
      var newStyle = {
        listStyle: nextProps.listStyle,
      };
    }
    if (nextProps.typeOfDropdown !== prevState.typeOfDropdown) {
      var newtypeOfDropdown = {
        typeOfDropdown: nextProps.typeOfDropdown,
      };
    }
    if (nextProps.shouldRenderDropDown !== prevState.shouldRenderDropDown) {
      var newShouldRenderDropDown = {
        shouldRenderDropDown: nextProps.shouldRenderDropDown,
      };
    }
    if (nextProps.color !== prevState.color) {
      var newColor = {
        color: nextProps.color,
      };
    }
    return newStyle || newtypeOfDropdown || newColor || newShouldRenderDropDown
      ? {
          ...newStyle,
          ...newtypeOfDropdown,
          ...newColor,
          ...newShouldRenderDropDown,
        }
      : null;
  }

  toggleHoveringDropdown = (bool) => {
    if (bool !== this.state.hoveringDropdown) {
      this.setState(
        {
          hoveringDropdown: bool,
        },
        () => {
          this.props.toggleHoverDropDown(bool);
        }
      );
    }
  };

  renderDropdown = () => {
    return (
      <div
        style={
          this.state.shouldRenderDropDown
            ? this.state.listStyle.listDropDownShow()
            : this.state.listStyle.listDropDownHide()
        }
        onMouseOver={() => {
          this.toggleHoveringDropdown(true);
        }}
        onMouseLeave={() => {
          this.toggleHoveringDropdown(false);
        }}
      >
        <ListColors
          currentColor={this.state.color}
          updateListColor={this.props.updateList}
          style={this.state.listStyle}
          shouldRenderColors={
            this.state.shouldRenderDropDown &&
            this.state.typeOfDropdown === "colors"
          }
        ></ListColors>
        {/* <ListDelete
          shouldRenderDelete={
            this.state.shouldRenderDropDown &&
            this.state.typeOfDropdown === "delete"
          }
        ></ListDelete> */}
      </div>
    );
  };

  render() {
    return this.renderDropdown();
  }
}

export default ListDropdown;

ListDropdown.propTypes = {
  listStyle: PropTypes.object.isRequired,
  typeOfDropdown: PropTypes.string,
  updateList: PropTypes.func.isRequired,
  color: PropTypes.node.isRequired,
  toggleHoverDropDown: PropTypes.func.isRequired,
  shouldRenderDropDown: PropTypes.bool.isRequired,
};
