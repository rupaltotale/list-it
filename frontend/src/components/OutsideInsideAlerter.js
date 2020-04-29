import React, { Component } from "react";
import PropTypes from "prop-types";

export default class OutsideInsideAlerter extends React.Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.outsideCallback ? this.props.outsideCallback() : null;
    } else {
      this.props.insideCallback ? this.props.insideCallback() : null;
    }
  };

  render() {
    return (
      <div
        style={this.props.divStyle ? this.props.divStyle : null}
        ref={this.setWrapperRef}
      >
        {this.props.children}
      </div>
    );
  }
}

OutsideInsideAlerter.propTypes = {
  children: PropTypes.element.isRequired,
  outsideCallback: PropTypes.func,
  insideCallback: PropTypes.func,
  divStyle: PropTypes.object,
};
