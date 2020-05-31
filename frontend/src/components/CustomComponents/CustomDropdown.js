import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "react-bootstrap";
import onClickOutside from "react-onclickoutside";

class CustomDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      isDropdownHovering: false,
      isDropdownClicked: false,
      haveClickedDropdown: false,
    };
  }

  handleClickOutside = (event) => {
    this.setState({
      isDropdownOpen: false,
      isDropdownHovering: false,
      isDropdownClicked: false,
      haveClickedDropdown: false,
    });
  };

  toggleDropdownHover = (bool) => {
    this.setState({ isDropdownHovering: bool }, () => {
      this.setState({
        haveClickedDropdown: bool ? this.state.haveClickedDropdown : false,
        isDropdownOpen: this.toggleDropdown(),
      });
    });
  };

  toggleDropdownClicked = () => {
    this.setState(
      {
        isDropdownClicked: !this.state.isDropdownClicked,
        haveClickedDropdown: true,
      },
      () => {
        this.setState({
          isDropdownOpen: this.toggleDropdown(),
        });
      }
    );
  };

  toggleDropdown = () => {
    if (this.state.isDropdownClicked) {
      return true;
    } else {
      if (this.state.haveClickedDropdown) {
        return false;
      }
      if (this.state.isDropdownHovering) {
        return true;
      }
    }
    return false;
  };

  renderDropdown = () => {
    return this.props.dropdownItems;
  };

  renderDropdownToggle = () => {
    if (this.props.dropdownToggle) {
      return React.cloneElement(this.props.dropdownToggle, {
        onClick: this.toggleDropdownClicked,
      });
    } else {
      return (
        <Dropdown.Toggle onClick={this.toggleDropdownClicked}>
          {this.props.title}
        </Dropdown.Toggle>
      );
    }
  };

  render() {
    return (
      <Dropdown
        {...this.props.dropdownProps}
        style={this.props.dropdownStyle}
        onMouseEnter={() => {
          this.toggleDropdownHover(true);
        }}
        onMouseLeave={() => {
          this.toggleDropdownHover(false);
        }}
        onSelect={this.handleClickOutside}
        show={this.state.isDropdownOpen}
        {...this.props.dropdownProps}
      >
        {this.renderDropdownToggle()}
        <Dropdown.Menu {...this.props.menuProps} style={this.props.menuStyle}>
          {this.renderDropdown()}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default onClickOutside(CustomDropdown);

CustomDropdown.propTypes = {
  title: PropTypes.string,
  dropdownItems: PropTypes.object,
  dropdownProps: PropTypes.object,
  menuStyle: PropTypes.object,
  menuProps: PropTypes.object,
  dropdownToggle: PropTypes.object,
  dropdownProps: PropTypes.object,
};
