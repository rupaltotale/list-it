import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import onClickOutside from "react-onclickoutside";

class CustomButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovering: false,
      isFocusing: false,
    };
  }

  handleClickOutside = (event) => {
    if (this.props.onClickOutside) {
      this.props.onClickOutside();
    }
  };

  toggleHover = (bool) => {
    this.setState(
      {
        isHovering: bool,
      },
      () => {
        if (this.props.onHover) {
          this.props.onHover(bool);
        }
      }
    );
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
    return this.state.isHovering || this.state.isFocusing
      ? this.variantOnHover
      : this.variant;
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
        {...this.props.syntheticEvents}
        ref={this.props.buttonRef ? this.props.buttonRef : false}
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
        onFocus={() => {
          if (this.props.onFocus) {
            this.props.onFocus();
          }
          this.setState({
            isFocusing: true,
          });
        }}
        onBlur={() => {
          if (this.props.onBlur) {
            this.props.onBlur();
          }
          this.setState({
            isFocusing: false,
          });
        }}
      >
        {this.renderIcon()}
        {this.props.text}
      </Button>
    );
  }
}
export default onClickOutside(CustomButton);

CustomButton.propTypes = {
  onClickOutside: PropTypes.func,
  syntheticEvents: PropTypes.object,
  onHover: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
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
  buttonRef: PropTypes.object,
};
