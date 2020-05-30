import React from "react";
import PropTypes from "prop-types";
import TextareaAutosize from "react-textarea-autosize";
import * as Mousetrap from "Mousetrap";
import { Card } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import ListStyle from "./ListStyle";
import CustomButton from "../CustomComponents/Button/CustomButton";

class ListHeader extends React.Component {
  constructor(props) {
    super(props);
    this.listTitle = React.createRef();
    this.state = {
      hoveringList: this.props.hoveringList,
      title: this.props.title,
      focusedOnListTitle: false,
      listStyle: this.props.style,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.style !== prevState.listStyle) {
      var newStyle = {
        listStyle: nextProps.style,
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

  renderSelectIcon = () => {
    return (
      <CustomButton
        style={
          this.state.hoveringList
            ? this.state.listStyle.listSelectShow
            : this.state.listStyle.listSelectHide
        }
        icon={
          <FaCheck
            style={this.state.listStyle.listSelectIcon}
            size={16}
          ></FaCheck>
        }
      ></CustomButton>
    );
  };

  handleTitleChange = (event) => {
    this.props.updateListTitle(
      { title: event.target.value },
      (returnedData) => {
        this.setState({
          title: returnedData.title,
        });
      }
    );
  };

  renderListTitle = () => {
    return (
      <Card.Header style={this.state.listStyle.listHeader}>
        <TextareaAutosize
          value={this.state.title}
          className="form-control mousetrap"
          style={
            this.state.focusedOnListTitle
              ? {
                  ...this.state.listStyle.listTitle,
                  ...this.state.listStyle.listTitleFocus,
                }
              : this.state.listStyle.listTitle
          }
          onChange={this.handleTitleChange}
          placeholder="List Title"
          inputRef={this.listTitle}
          onFocus={() => {
            this.setState({
              focusedOnListTitle: true,
            });
            Mousetrap.bind("enter", (event) => {
              event.preventDefault();
              this.listTitle.current.blur();
            });
          }}
          onBlur={() => {
            this.setState({
              focusedOnListTitle: false,
            });
            Mousetrap.reset();
          }}
        ></TextareaAutosize>
      </Card.Header>
    );
  };

  render() {
    return (
      <>
        {this.renderSelectIcon()}
        {this.renderListTitle()}
      </>
    );
  }
}

export default ListHeader;

ListHeader.propTypes = {
  hoveringList: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  updateListTitle: PropTypes.func.isRequired,
};
