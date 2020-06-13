import React from "react";
import PropTypes from "prop-types";
import ListTags from "./ListTags";
import ListSharing from "./ListSharing";
import ListColors from "./ListColors";
import ListImages from "./ListImages";
import ListDelete from "./ListDelete";

class ListDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listStyle: this.props.listStyle,
      shouldRenderDropDown: this.props.shouldRenderDropDown,
      changingTypeOfDropDown: false,
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
      var newTypeOfDropdown = {
        changingTypeOfDropDown: true,
        typeOfDropdown: nextProps.typeOfDropdown,
      };
    } else {
      if (prevState.changingTypeOfDropDown) {
        var newTypeOfDropdown = {
          changingTypeOfDropDown: false,
        };
      }
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
    return newStyle || newTypeOfDropdown || newColor || newShouldRenderDropDown
      ? {
          ...newStyle,
          ...newTypeOfDropdown,
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

  renderDropdownContent = () => {
    let content = null;
    switch (this.state.typeOfDropdown) {
      case "tags":
        content = (
          <ListTags
            style={this.state.listStyle}
            updateListTags={this.props.updateList}
            createNewTag={this.props.createNewTag}
            currentTags={this.props.tags}
          ></ListTags>
        );
        break;
      case "sharing":
        content = <ListSharing style={this.state.listStyle}></ListSharing>;
        break;
      case "colors":
        content = (
          <ListColors
            style={this.state.listStyle}
            updateListColor={this.props.updateList}
            currentColor={this.state.color}
          ></ListColors>
        );
        break;
      case "images":
        content = <ListImages style={this.state.listStyle}></ListImages>;
        break;
      case "delete":
        content = (
          <ListDelete
            style={this.state.listStyle}
            deleteList={this.props.deleteList}
          ></ListDelete>
        );
        break;
    }
    return (
      <div
        style={
          this.state.shouldRenderDropDown
            ? this.state.listStyle.listDropDownContent(
                this.state.typeOfDropdown
              )
            : this.state.listStyle.listDropDownContentHide(
                this.state.typeOfDropdown
              )
        }
      >
        {content}
      </div>
    );
  };

  renderDropdown = () => {
    return (
      <div
        style={
          this.state.shouldRenderDropDown
            ? this.state.listStyle.listDropDownShow(this.state.typeOfDropdown)
            : this.state.listStyle.listDropDownHide(this.state.typeOfDropdown)
        }
        onMouseOver={() => {
          this.toggleHoveringDropdown(true);
        }}
        onMouseLeave={() => {
          this.toggleHoveringDropdown(false);
        }}
      >
        {this.renderDropdownContent()}
      </div>
    );
  };

  render() {
    return this.renderDropdown();
  }
}

export default ListDropdown;

ListDropdown.propTypes = {
  color: PropTypes.node.isRequired,
  typeOfDropdown: PropTypes.string,
  tags: PropTypes.array,
  listStyle: PropTypes.object.isRequired,
  updateList: PropTypes.func.isRequired,
  deleteList: PropTypes.func.isRequired,
  toggleHoverDropDown: PropTypes.func.isRequired,
  shouldRenderDropDown: PropTypes.bool.isRequired,
  createNewTag: PropTypes.func.isRequired,
};
