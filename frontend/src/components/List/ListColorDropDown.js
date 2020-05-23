import React from "react";
import PropTypes from "prop-types";

class ListColors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderColors = (colors) => {
    let createdColors = [];
    colors.forEach((color) => {
      createdColors.push(
        <CustomButton
          style={listStyle.listColorButton(color)}
          styleOnHover={listStyle.listColorButtonHover}
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
    return null;
  }
}

export default ListColors;

ListColors.propTypes = {};
