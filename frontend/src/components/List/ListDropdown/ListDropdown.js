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
      tags: this.props.tags,
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
    if (nextProps.tags !== prevState.tags) {
      var newTags = {
        tags: nextProps.tags,
      };
    }
    return newStyle ||
      newTypeOfDropdown ||
      newColor ||
      newShouldRenderDropDown ||
      newTags
      ? {
          ...newTags,
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
            updateListTags={this.props.updateListTags}
            createNewTag={this.props.createNewTag}
            removeTag={this.props.removeTag}
            currentTags={this.state.tags}
            addTag={this.props.addTag}
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
  //Properties
  color: PropTypes.node.isRequired,
  typeOfDropdown: PropTypes.string,
  tags: PropTypes.array,
  listStyle: PropTypes.object.isRequired,
  //Tag Functions
  updateListTags: PropTypes.func.isRequired,
  removeTag: PropTypes.func.isRequired,
  createNewTag: PropTypes.func.isRequired,
  addTag: PropTypes.func.isRequired,
  //List Properties
  updateList: PropTypes.func.isRequired,
  deleteList: PropTypes.func.isRequired,
  //Dropdown Properties
  toggleHoverDropDown: PropTypes.func.isRequired,
  shouldRenderDropDown: PropTypes.bool.isRequired,
};
