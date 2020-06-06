import React from "react";
import PropTypes from "prop-types";
import * as Mousetrap from "Mousetrap";
import CustomButton from "../CustomComponents/Button/CustomButton";
import CustomModal from "../CustomComponents/CustomModal";
import { Card, Button } from "react-bootstrap";
import {
  FaPalette,
  FaUserPlus,
  FaImages,
  FaTrashAlt,
  FaTags,
} from "react-icons/fa";

class ListFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listStyle: this.props.style,
      hoveringList: this.props.hoveringList,
      isRenderingDropDown: this.props.isRenderingDropDown,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.style !== prevState.listStyle) {
      var newStyle = {
        listStyle: nextProps.style,
      };
    }
    if (nextProps.isRenderingDropDown !== prevState.isRenderingDropDown) {
      var newIsRenderingDropDown = {
        isRenderingDropDown: nextProps.isRenderingDropDown,
      };
    }
    if (nextProps.hoveringList !== prevState.hoveringList) {
      var newHoveringList = {
        hoveringList: nextProps.hoveringList,
      };
    }
    return newStyle || newIsRenderingDropDown || newHoveringList
      ? { ...newStyle, ...newIsRenderingDropDown, ...newHoveringList }
      : null;
  }

  toggleHoverFooterButton = (bool, type) => {
    if (bool) {
      this.props.toggleHoverFooterButton(bool, type);
    } else {
      this.props.toggleHoverFooterButton(bool);
    }
  };

  renderFooterButtons = (buttons) => {
    let createdButtons = [];
    buttons.forEach((button) => {
      createdButtons.push(
        <ListFooterButton
          listStyle={this.state.listStyle}
          hoveringList={this.state.hoveringList}
          icon={button.icon}
          name={button.name}
          toggleHoverFooterButton={this.toggleHoverFooterButton}
        ></ListFooterButton>
      );
    });
    return (
      <>
        {createdButtons.map((createdButton, i) => {
          return <React.Fragment key={i}>{createdButton}</React.Fragment>;
        })}
      </>
    );
  };

  render() {
    return (
      <Card.Footer
        style={this.state.listStyle.listFooter(this.state.isRenderingDropDown)}
      >
        <div style={this.state.listStyle.listFooterButtonRow}>
          {this.renderFooterButtons([
            { icon: <FaTags size={18}></FaTags>, name: "tags" },
            { icon: <FaUserPlus size={18}></FaUserPlus>, name: "sharing" },
            { icon: <FaPalette size={18}></FaPalette>, name: "colors" },
            { icon: <FaImages size={18}></FaImages>, name: "images" },
            { icon: <FaTrashAlt size={18}></FaTrashAlt>, name: "delete" },
          ])}
        </div>
      </Card.Footer>
    );
  }
}

export default ListFooter;

ListFooter.propTypes = {
  style: PropTypes.object.isRequired,
  hoveringList: PropTypes.bool.isRequired,
  toggleHoverFooterButton: PropTypes.func.isRequired,
  isRenderingDropDown: PropTypes.bool.isRequired,
};

class ListFooterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listStyle: this.props.listStyle,
      hoveringList: this.props.hoveringList,
      hoveringButton: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.listStyle !== prevState.listStyle) {
      var newStyle = {
        listStyle: nextProps.listStyle,
      };
    }
    if (nextProps.hoveringList !== prevState.hoveringList) {
      var newHoveringList = {
        hoveringList: nextProps.hoveringList,
      };
    }
    return newStyle || newHoveringList
      ? { ...newStyle, ...newHoveringList }
      : null;
  }

  toggleHoveringButton = (bool) => {
    if (this.state.hoveringButton !== bool) {
      this.setState(
        {
          hoveringButton: bool,
        },
        () => {
          this.props.toggleHoverFooterButton(bool, this.props.name);
        }
      );
    }
  };

  renderFooterButton = () => {
    return (
      <div
        style={
          this.state.hoveringList
            ? this.state.listStyle.listFooterButtonDivShow
            : this.state.listStyle.listFooterButtonDivHide
        }
        onMouseOver={() => {
          this.toggleHoveringButton(true);
        }}
        onMouseLeave={() => {
          this.toggleHoveringButton(false);
        }}
      >
        <CustomButton
          style={
            this.state.hoveringButton
              ? this.state.listStyle.listFooterButtonHover
              : this.state.listStyle.listFooterButton
          }
          icon={this.props.icon}
        />
      </div>
    );
  };

  render() {
    return this.renderFooterButton();
  }
}

ListFooterButton.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  hoveringList: PropTypes.bool.isRequired,
  listStyle: PropTypes.object.isRequired,
  toggleHoverFooterButton: PropTypes.func.isRequired,
};
