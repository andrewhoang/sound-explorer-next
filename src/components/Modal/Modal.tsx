import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { ModalProps } from "./Modal.props";

import styles from "./Modal.module.scss";

// https://hackernoon.com/its-a-focus-trap-699a04d66fb5
import FocusLock from "react-focus-lock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import cn from "classnames";

const Modal = (props: ModalProps) => {
  const { isOpen, onClose, title, children, className, ...rest } = props;

  const overflowRef = useRef();

  // keep around the children so when we close, we can fade out with the content
  const childrenCache = useRef();

  const [modalContainer, setModalContainer] = useState();
  useEffect(() => {
    const container = document.createElement("div");
    container.setAttribute("class", "modal-container");
    // @ts-ignore
    document.querySelector("body").appendChild(container);
    // @ts-ignore
    setModalContainer(container);
    return () => {
      container.remove();
    };
  }, []);

  // if children is a funciton, render it with some state
  const content = children;

  if (content) {
    // @ts-ignore
    childrenCache.current = content;
  }

  // listen for esc if the modal is open
  useEffect(() => {
    // @ts-ignore
    const keydownHandler = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      // always open with the modal scrolled to the top
      if (overflowRef.current) {
        // @ts-ignore
        overflowRef.current.scrollTo(0, 0);
      }

      window.addEventListener("keydown", keydownHandler);
      return () => window.removeEventListener("keydown", keydownHandler);
    } else {
      window.removeEventListener("keydown", keydownHandler);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    // @ts-ignore
    document.querySelector("body").classList.toggle("modal-open", isOpen);
    if (document.querySelector(".js-page-content-wrapper")) {
      // @ts-ignore
      document
        .querySelector(".js-page-content-wrapper")
        // @ts-ignore
        .setAttribute("aria-hidden", isOpen);
    }
  }, [isOpen]);

  const classes = cn(styles.modal, className, {
    [styles.isOpen]: isOpen,
  });

  const modalNode = (
    // @ts-ignore
    <div className={classes} ref={overflowRef} {...rest}>
      <div className={styles.modalBoxHolder}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div className={styles.modalOverlay} onClick={onClose} />
        <FocusLock
          disabled={!isOpen}
          returnFocus={true}
          className={styles.modalBox}
          // @ts-ignore
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.modalTitle}>
            {title}
            <button
              type="button"
              className={styles.modalClose}
              onClick={onClose}
              aria-label="Close modal"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <div className={styles.modalContent}>{childrenCache.current}</div>
        </FocusLock>
      </div>
    </div>
  );

  return modalContainer
    ? ReactDOM.createPortal(modalNode, modalContainer)
    : null;
};

export default Modal;
