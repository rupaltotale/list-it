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
      currentColor: this.props.currentColor
        ? this.props.currentColor
        : this.defaultColor,
    };
  }

  setActiveColor = (color) => {
    this.props.updateListColor(color, (returnedColor) => {
      this.setState({
        currentColor: returnedColor,
      });
    });
  };

  renderColors = (colors) => {
    let createdColors = [];
    colors.forEach((color) => {
      createdColors.push(
        <ListColorButton
          color={color}
          isDefaultColor={this.defaultColor === color}
          isCurrentColor={this.state.currentColor === color}
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
  currentColor: PropTypes.string,
  updateListColor: PropTypes.func.isRequired,
};

class ListColorButton extends React.Component {
  constructor(props) {
    super(props);
    this.listStyle = new ListStyle();
    this.state = {
      hoveringColorButton: false,
      isDefaultColor: this.props.isDefaultColor,
      isCurrentColor: this.props.isCurrentColor,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.isDefaultColor !== prevState.isDefaultColor ||
      nextProps.isCurrentColor !== prevState.isCurrentColor
    ) {
      return {
        isDefaultColor: nextProps.isDefaultColor,
        isCurrentColor: nextProps.isCurrentColor,
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
          this.state.isCurrentColor
        )}
        styleOnHover={this.listStyle.listColorButtonHover(
          this.props.color,
          this.state.isDefaultColor,
          this.state.isCurrentColor
        )}
        onHover={(bool) => {
          this.setState({
            hoveringColorButton: bool,
          });
        }}
        onClick={() => {
          this.props.setActiveColor(this.props.color);
        }}
        icon={this.props.isCurrentColor ? <FaCheck size={10}></FaCheck> : null}
      />
    );
  }
}

ListColorButton.propTypes = {
  color: PropTypes.string.isRequired,
  isDefaultColor: PropTypes.bool.isRequired,
  isCurrentColor: PropTypes.bool.isRequired,
  setActiveColor: PropTypes.func.isRequired,
};
