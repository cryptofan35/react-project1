import React from "react";
import { Button } from "antd";
import Modal from "antd/lib/modal/Modal";

import "./index.less";

const ConfirmModal = ({ isVisible, onCancel, title, footer = null, cancelLabel = 'Cancel', confirmLabel = 'Confirm', onConfirm }) => (
  <Modal
    visible={isVisible}
    footer={footer}
    onCancel={onCancel}
    className="modal"
  >
    <div className="modal-title">{title}</div>
    <div>
      <Button type="primary" ghost onClick={onConfirm}>
        {confirmLabel}
      </Button>
      <Button type="primary" onClick={onCancel}>
        {cancelLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmModal;
