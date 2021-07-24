import React from "react";
import { Button } from "antd";
import Modal from "antd/lib/modal/Modal";

import "./delete-modal.less";

const DeleteModal = ({ isVisible, onCancel, title, onDelete }) => (
  <Modal
    visible={isVisible}
    footer={null}
    onCancel={onCancel}
    className="modal"
  >
    <div className="modal-title">{title}</div>
    <div>
      <Button type="primary" ghost onClick={onDelete}>
        Delete
      </Button>
      <Button type="primary" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  </Modal>
);

export default DeleteModal;
