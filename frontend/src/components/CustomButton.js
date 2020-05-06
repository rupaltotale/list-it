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

  renderHoveringIcon = () => {
    if (this.props.icon) {
      return React.cloneElement(this.props.icon, this.props.iconOnHover);
    }
  };

  renderHoveringStyle = () => {
    return { ...this.props.style, ...this.props.styleOnHover };
  };

  render() {
    return (
      <Button
        style={
          this.state.isHovering ? this.renderHoveringStyle() : this.props.style
        }
        size={this.props.size}
        block={this.props.block}
        onClick={this.props.onClick}
        variant={this.state.isHovering ? this.variantOnHover : this.variant}
        onMouseEnter={() => {
          this.toggleHover(true);
        }}
        onMouseLeave={() => {
          this.toggleHover(false);
        }}
      >
        {this.state.isHovering ? this.renderHoveringIcon() : this.props.icon}
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
  icon: PropTypes.object,
  iconOnHover: PropTypes.object,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
