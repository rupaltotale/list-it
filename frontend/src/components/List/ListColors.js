import React from "react";
import PropTypes from "prop-types";
import CustomButton from "../CustomComponents/Button/CustomButton";
import ListStyle from "./ListStyle";
import { FaCheck } from "react-icons/fa";

class ListColors extends React.Component {
  constructor(props) {
    super(props);
    this.defaultColor = "#ffffff";
    this.colors = [
      "#ffffff",
      "#f44336",
      "#e91e63",
      "#3f51b5",
      "#2196f3",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
    ];
    this.listStyle = new ListStyle();
    this.state = {
      hoveringDropdown: false,
      activeColor: "#ffeb3b",
    };
  }

  setActiveColor = (color) => {
    this.setState({
      activeColor: color,
    });
  };

  renderColors = (colors) => {
    let createdColors = [];
    colors.forEach((color) => {
      createdColors.push(
        <ListColorButton
          color={color}
          isDefaultColor={this.defaultColor === color}
          isActiveColor={this.state.activeColor === color}
          setActiveColor={this.setActiveColor}
        />
      );
    });
    return (
      <>
        {createdColors.map((createdColor, i) => {
          return <div key={i}>{createdColor}</div>;
        })}
      </>
    );
  };

  render() {
    return (
      <div
        style={this.listStyle.listColors}
        onMouseOver={() => {
          this.props.shouldRenderColorDropDown(true);
          this.props.toggleHoverList(true);
        }}
        onMouseLeave={() => {
          this.props.shouldRenderColorDropDown(false);
          this.props.toggleHoverList(false);
        }}
      >
        {this.renderColors(this.colors)}
      </div>
    );
  }
}

export default ListColors;

ListColors.propTypes = {
  shouldRenderColorDropDown: PropTypes.func.isRequired,
  toggleHoverList: PropTypes.func.isRequired,
};

class ListColorButton extends React.Component {
  constructor(props) {
    super(props);
    this.listStyle = new ListStyle();
    this.state = {
      hoveringColorButton: false,
      isDefaultColor: this.props.isDefaultColor,
      isActiveColor: this.props.isActiveColor,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.isDefaultColor !== prevState.isDefaultColor ||
      nextProps.isActiveColor !== prevState.isActiveColor
    ) {
      return {
        isDefaultColor: nextProps.isDefaultColor,
        isActiveColor: nextProps.isActiveColor,
      };
    }
    return null;
  }

  render() {
    return (
      <CustomButton
        style={this.listStyle.listColorButton(
          this.props.color,
          this.state.isDefaultColor,
          this.state.isActiveColor
        )}
        styleOnHover={this.listStyle.listColorButtonHover(
          this.props.color,
          this.state.isDefaultColor,
          this.state.isActiveColor
        )}
        onHover={(bool) => {
          this.setState({
            hoveringColorButton: bool,
          });
        }}
        onClick={() => {
          this.props.setActiveColor(this.props.color);
        }}
        icon={this.props.isActiveColor ? <FaCheck size={10}></FaCheck> : null}
      />
    );
  }
}

ListColorButton.propTypes = {
  color: PropTypes.string.isRequired,
  isDefaultColor: PropTypes.bool.isRequired,
  isActiveColor: PropTypes.bool.isRequired,
  setActiveColor: PropTypes.func.isRequired,
};
