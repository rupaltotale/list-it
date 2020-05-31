import React from "react";
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
  FaTags,
} from "react-icons/fa";

class ListFooter extends React.Component {
  constructor(props) {
    super(props);
    this.listStyle = this.props.style;
    this.colorButtonRef = React.createRef();
    this.state = {
      hoveringColorIcon: false,
      showDeleteModal: false,
      hoveringList: this.props.hoveringList,
      renderingColorDropDown: false,
    };
  }

  setFocusToColorButton(bool) {
    if (this.colorButtonRef) {
      if (bool) {
        this.colorButtonRef.current.focus();
      } else {
        this.colorButtonRef.current.blur();
      }
    }
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
    if (this.state.hoveringColorIcon) {
      this.setState(
        {
          renderingColorDropDown: true,
        },
        () => {
          this.props.shouldRenderColorDropDown(true);
        }
      );
    } else {
      this.setState(
        {
          renderingColorDropDown: false,
        },
        () => {
          this.props.shouldRenderColorDropDown(false);
        }
      );
    }
  };

  renderFooterButtons = (buttons) => {
    let createdButtons = [];
    buttons.forEach((button) => {
      createdButtons.push(
        <div
          style={
            this.state.hoveringList
              ? this.listStyle.listFooterButtonDivShow
              : this.listStyle.listFooterButtonDivHide
          }
          {...button.buttonDivProps}
        >
          <CustomButton
            style={this.listStyle.listFooterButton}
            styleOnHover={this.listStyle.listFooterButtonHover}
            onClick={button.onClick}
            onClickOutside={button.onClickOutside}
            onFocus={button.onFocus}
            onBlur={button.onBlur}
            icon={button.icon}
            onHover={button.onHover}
            buttonRef={button.ref}
          />
        </div>
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
      <>
        {this.renderDeleteModal()}
        <Card.Footer
          style={this.listStyle.listFooter(this.state.renderingColorDropDown)}
        >
          <div style={this.listStyle.listFooterButtonRow}>
            {this.renderFooterButtons([
              { icon: <FaTags size={18}></FaTags> },
              { icon: <FaUserPlus size={18}></FaUserPlus> },
              {
                icon: <FaPalette size={18}></FaPalette>,
                ref: this.colorButtonRef,
                buttonDivProps: {
                  onMouseOver: () => {
                    if (!this.state.hoveringColorIcon) {
                      this.setState(
                        {
                          hoveringColorIcon: true,
                        },
                        () => {
                          this.shouldShowColors();
                          this.setFocusToColorButton(true);
                        }
                      );
                    }
                  },
                  onMouseLeave: () => {
                    this.setState(
                      {
                        hoveringColorIcon: false,
                      },
                      () => {
                        this.shouldShowColors();
                        this.setFocusToColorButton(false);
                      }
                    );
                  },
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
