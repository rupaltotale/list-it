import React from "react";
import PropTypes from "prop-types";
import CustomButton from "../CustomComponents/Button/CustomButton";
import { FaCheck } from "react-icons/fa";

class ListColors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listStyle: this.props.style,
      hoveringDropdown: false,
      currentColor: this.props.currentColor
        ? this.props.currentColor
        : "Default",
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.style !== prevState.listStyle) {
      return {
        listStyle: nextProps.style,
        currentColor: nextProps.currentColor
          ? nextProps.currentColor
          : "Default",
      };
    }
    return null;
  }

  setActiveColor = (color) => {
    this.props.updateListColor({ color: color }, (returnedData) => {
      this.setState({
        currentColor: returnedData.color,
      });
    });
  };

  renderColors = (colors) => {
    let createdColors = [];
    for (const [colorName, colorRGB] of Object.entries(colors)) {
      createdColors.push(
        <ListColorButton
          colorName={colorName}
          color={colorRGB}
          isCurrentColor={this.state.currentColor === colorName}
          setActiveColor={this.setActiveColor}
          style={this.state.listStyle}
        />
      );
    }
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
        style={this.state.listStyle.listColors}
        onMouseOver={() => {
          this.props.shouldRenderColorDropDown(true);
          this.props.toggleHoverList(true);
        }}
        onMouseLeave={() => {
          this.props.shouldRenderColorDropDown(false);
          this.props.toggleHoverList(false);
        }}
      >
        {this.renderColors(this.state.listStyle.colors)}
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
    this.state = {
      listStyle: this.props.style,
      hoveringColorButton: false,
      isCurrentColor: this.props.isCurrentColor,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.style !== prevState.listStyle) {
      var newStyle = { listStyle: nextProps.style };
    }
    if (nextProps.isCurrentColor !== prevState.isCurrentColor) {
      var newColors = {
        isCurrentColor: nextProps.isCurrentColor,
      };
    }
    return newStyle || newColors ? { ...newColors, ...newStyle } : null;
  }

  render() {
    return (
      <CustomButton
        style={this.state.listStyle.listColorButton(
          this.props.colorName,
          this.state.isCurrentColor
        )}
        styleOnHover={this.state.listStyle.listColorButtonHover(
          this.props.colorName,
          this.state.isCurrentColor
        )}
        onHover={(bool) => {
          this.setState({
            hoveringColorButton: bool,
          });
        }}
        onClick={() => {
          this.props.setActiveColor(this.props.colorName);
        }}
        icon={
          this.props.isCurrentColor ? (
            <FaCheck
              size={10}
              style={this.state.listStyle.listColorButtonCheck}
            ></FaCheck>
          ) : null
        }
      />
    );
  }
}

ListColorButton.propTypes = {
  color: PropTypes.string.isRequired,
  colorName: PropTypes.string.isRequired,
  isCurrentColor: PropTypes.bool.isRequired,
  setActiveColor: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
};
