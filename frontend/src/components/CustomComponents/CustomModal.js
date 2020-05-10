import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";

class CustomModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: this.props.showModal,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.showModal !== prevState.showModal) {
      return { showModal: nextProps.showModal };
    }
    return null;
  }

  renderModalFooter = () => {
    return <Modal.Footer>{this.props.footer}</Modal.Footer>;
  };

  renderModalBody = () => {
    return <Modal.Body>{this.props.body}</Modal.Body>;
  };

  renderModalHeader = () => {
    return (
      <Modal.Header closeButton>
        <Modal.Title>{this.props.title}</Modal.Title>
      </Modal.Header>
    );
  };

  renderModal = () => {
    return (
      <Modal
        show={this.state.showModal}
        onShow={this.props.onShow}
        onHide={this.props.onHide}
      >
        {this.renderModalHeader()}
        {this.renderModalBody()}
        {this.renderModalFooter()}
      </Modal>
    );
  };

  render() {
    return this.renderModal();
  }
}

export default CustomModal;

CustomModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  footer: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onShow: PropTypes.func,
  onHide: PropTypes.func,
};
