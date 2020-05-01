import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

class CustomButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovering: false,
    };
    this.variant = this.props.variant ? this.props.variant : null;
    this.variantOnHover = this.props.variantOnHover
      ? this.props.variantOnHover
      : this.variant;
    this.styleOnHover = this.props.styleOnHover
      ? this.props.styleOnHover
      : this.props.style;
    this.iconOnHover = this.props.iconOnHover
      ? this.props.iconOnHover
      : this.props.icon;
  }

  handleClickOutside = (event) => {
    if (this.props.onClickOutside) {
      this.props.onClickOutside();
    }
  };

  toggleHover = (bool) => {
    this.setState({
      isHovering: bool,
    });
  };

  render() {
    return (
      <Button
        style={this.state.isHovering ? this.styleOnHover : this.props.style}
        size={this.props.size ? this.props.size : "sm"}
        onClick={this.props.onClick ? this.props.onClick : null}
        variant={this.state.isHovering ? this.variantOnHover : this.variant}
        onMouseEnter={() => {
          this.toggleHover(true);
        }}
        onMouseLeave={() => {
          this.toggleHover(false);
        }}
      >
        {this.state.isHovering ? this.iconOnHover : this.props.icon}
        {this.props.text}
      </Button>
    );
  }
}

export default CustomButton;

CustomButton.propTypes = {
  onClickOutside: PropTypes.func,
  size: PropTypes.string,
  variant: PropTypes.string,
  variantOnHover: PropTypes.string,
  style: PropTypes.object,
  styleOnHover: PropTypes.object,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.object,
  iconOnHover: PropTypes.object,
};
