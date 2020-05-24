import React from "react";
import ListStyle from "./ListStyle";
import PropTypes from "prop-types";
import * as Mousetrap from "Mousetrap";
import CustomButton from "../CustomComponents/Button/CustomButton";
import CustomModal from "../CustomComponents/CustomModal";
import { Card, Button } from "react-bootstrap";
import {
  FaPalette,
  FaBell,
  FaUserPlus,
  FaImages,
  FaTrashAlt,
} from "react-icons/fa";

class ListFooter extends React.Component {
  constructor(props) {
    super(props);
    this.listStyle = new ListStyle();
    this.state = {
      focusingColorIcon: false,
      hoveringColorIcon: false,
      showDeleteModal: false,
      hoveringList: this.props.hoveringList,
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

  deleteList = () => {
    this.toggleDeleteModal();
    this.props.deleteList();
  };

  toggleDeleteModal = () => {
    this.setState(
      {
        showDeleteModal: !this.state.showDeleteModal,
      },
      this.renderDeleteModal
    );
  };

  renderDeleteModal = () => {
    return (
      <CustomModal
        showModal={this.state.showDeleteModal}
        onShow={() => {
          Mousetrap.bind("enter", () => {
            this.deleteList();
            Mousetrap.reset();
          });
        }}
        onHide={() => {
          this.toggleDeleteModal();
          Mousetrap.reset();
        }}
        title={
          <>
            {"Delete "}
            <em>{this.state.title}</em>{" "}
          </>
        }
        body={
          "Are you sure you want to delete this list? This action cannot be undone."
        }
        footer={
          <Button
            variant="danger"
            onClick={() => {
              this.deleteList();
              Mousetrap.reset();
            }}
          >
            Delete
          </Button>
        }
      ></CustomModal>
    );
  };

  shouldShowColors = () => {
    if (this.state.focusingColorIcon || this.state.hoveringColorIcon) {
      this.props.shouldRenderColorDropDown(true);
    } else {
      this.props.shouldRenderColorDropDown(false);
    }
  };

  renderFooterButtons = (buttons) => {
    let createdButtons = [];
    buttons.forEach((button) => {
      createdButtons.push(
        <CustomButton
          style={this.listStyle.listIconButton}
          styleOnHover={this.listStyle.listIconButtonHover}
          variantOnHover="light"
          onClick={button.onClick}
          onClickOutside={button.onClickOutside}
          onFocus={button.onFocus}
          onBlur={button.onBlur}
          icon={button.icon}
          onHover={button.onHover}
        />
      );
    });
    return (
      <>
        {createdButtons.map((createdButton, i) => {
          return (
            <div
              key={i}
              style={
                this.state.hoveringList
                  ? this.listStyle.listFooterButtonDivShow
                  : this.listStyle.listFooterButtonDivHide
              }
            >
              {createdButton}
            </div>
          );
        })}
      </>
    );
  };

  render() {
    return (
      <>
        {this.renderDeleteModal()}
        <Card.Footer style={this.listStyle.listFooter}>
          <div style={this.listStyle.listFooterButtonRow}>
            {this.renderFooterButtons([
              { icon: <FaBell size={18}></FaBell> },
              { icon: <FaUserPlus size={18}></FaUserPlus> },
              {
                icon: <FaPalette size={18}></FaPalette>,
                onFocus: () => {
                  this.setState(
                    {
                      focusingColorIcon: true,
                    },
                    this.shouldShowColors
                  );
                },
                onBlur: () => {
                  this.setState(
                    {
                      focusingColorIcon: false,
                    },
                    this.shouldShowColors
                  );
                },
                onHover: (bool) => {
                  this.setState(
                    {
                      hoveringColorIcon: bool,
                    },
                    this.shouldShowColors
                  );
                },
              },
              { icon: <FaImages size={18}></FaImages> },
              {
                icon: <FaTrashAlt size={18}></FaTrashAlt>,
                onClick: () => {
                  this.toggleDeleteModal();
                },
              },
            ])}
          </div>
        </Card.Footer>
      </>
    );
  }
}

export default ListFooter;

ListFooter.propTypes = {
  deleteList: PropTypes.func.isRequired,
  hoveringList: PropTypes.bool.isRequired,
  shouldRenderColorDropDown: PropTypes.func,
};
