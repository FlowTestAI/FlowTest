import React from 'react';
import ReactDOM from 'react-dom';

const modalRootEl = document.getElementById('modal-root');

const Modal = ({ children, open = false }) => {
  if (!open) return null;

  /**
   * ToDo: Check whether we really need this portal or not
   * As per as documentation of headless UI, they are already using it under the hood for Dialog (Modal)
   * Ref: https://headlessui.com/react/dialog#rendering-to-a-portal
   */
  return ReactDOM.createPortal(children, modalRootEl);
};

export default Modal;
