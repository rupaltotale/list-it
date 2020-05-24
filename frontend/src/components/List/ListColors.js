import React from "react";
import PropTypes from "prop-types";
import CustomButton from "../CustomComponents/Button/CustomButton";
import ListStyle from "./ListStyle";

class ListColors extends React.Component {
  constructor(props) {
    super(props);
    this.colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
      "#795548",
      "#607d8b",
    ];
    this.listStyle = new ListStyle();
    this.state = {
      hoveringDropdown: false,
    };
  }

  renderColors = (colors) => {
    let createdColors = [];
    colors.forEach((color) => {
      let style = this.listStyle.listColorButton(color);
      let hoveringStyle = this.listStyle.listColorButtonHover(color);
      createdColors.push(
        <CustomButton style={style} styleOnHover={hoveringStyle} />
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
