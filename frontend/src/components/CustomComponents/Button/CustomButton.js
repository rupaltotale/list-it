import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

class CustomButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovering: false,
    };
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

  renderIcon = () => {
    if (this.props.icon) {
      return this.state.isHovering
        ? React.cloneElement(this.props.icon, this.props.iconOnHover)
        : this.props.icon;
    }
  };

  renderVariant = () => {
    this.variant = this.props.variant ? this.props.variant : null;
    this.variantOnHover = this.props.variantOnHover
      ? this.props.variantOnHover
      : this.variant;
    return this.state.isHovering ? this.variantOnHover : this.variant;
  };

  renderStyle = () => {
    return this.state.isHovering
      ? { ...this.props.style, ...this.props.styleOnHover }
      : this.props.style;
  };

  renderClass = () => {
    return this.state.isHovering
      ? this.props.classNameOnHover
        ? this.props.classNameOnHover
        : this.props.className
      : this.props.className;
  };

  render() {
    return (
      <Button
        className={this.renderClass()}
        style={this.renderStyle()}
        size={this.props.size}
        block={this.props.block}
        onClick={this.props.onClick}
        variant={this.renderVariant()}
        onMouseOver={() => {
          if (!this.state.isHovering) {
            this.toggleHover(true);
          }
        }}
        onMouseLeave={() => {
          this.toggleHover(false);
        }}
      >
        {this.renderIcon()}
        {this.props.text}
      </Button>
    );
  }
}

export default CustomButton;

CustomButton.propTypes = {
  onClickOutside: PropTypes.func,
  size: PropTypes.string,
  className: PropTypes.string,
  classNameOnHover: PropTypes.string,
  variant: PropTypes.string,
  variantOnHover: PropTypes.string,
  style: PropTypes.object,
  styleOnHover: PropTypes.object,
  icon: PropTypes.object,
  iconOnHover: PropTypes.object,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  block: PropTypes.bool,
};
