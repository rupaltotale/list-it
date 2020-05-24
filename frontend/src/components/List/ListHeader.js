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
    this.listStyle = new ListStyle();
    this.listTitle = React.createRef();
    this.state = {
      hoveringList: this.props.hoveringList,
      title: this.props.title,
      focusedOnListTitle: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.hoveringList !== prevState.hoveringList) {
      return {
        hoveringList: nextProps.hoveringList,
      };
    }
    return null;
  }

  renderSelectIcon = () => {
    return (
      <CustomButton
        style={
          this.state.hoveringList
            ? this.listStyle.listSelectShow
            : this.listStyle.listSelectHide
        }
        icon={
          <FaCheck style={this.listStyle.listSelectIcon} size={16}></FaCheck>
        }
      ></CustomButton>
    );
  };

  handleTitleChange = (event) => {
    this.setState(
      {
        title: event.target.value,
      },
      () => {
        this.setState({ title: this.props.updateList(this.state.title) });
      }
    );
  };

  renderListTitle = () => {
    return (
      <Card.Header style={this.listStyle.listHeader}>
        <TextareaAutosize
          value={this.state.title}
          className="form-control mousetrap"
          style={
            this.state.focusedOnListTitle
              ? {
                  ...this.listStyle.listTitle,
                  ...this.listStyle.listTitleFocus,
                }
              : this.listStyle.listTitle
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
  updateList: PropTypes.func.isRequired,
};
