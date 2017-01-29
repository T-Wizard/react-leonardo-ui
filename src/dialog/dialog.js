import React, { Component } from 'react';

import Portal from '../portal';
import { luiClassName, filterProps } from '../util';

const FADE_DURATION = 200;

const DIALOG_STATE = {
  opening: 0,
  open: 1,
  closing: 2,
  closed: 3
};

const modifiers = ['variant'];

let currentId = 0;

class Dialog extends Component {
  constructor(props) {
    super(props);
    this.portalId = `rlui-dialog-${currentId}`;
    this.state = {
      dialogState: props.show ? DIALOG_STATE.opening : DIALOG_STATE.closed
    };
    currentId++;

    this.keyUpListener = this.keyUpListener.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.show && nextProps.show) {
      this.setState({
        dialogState: DIALOG_STATE.opening
      });
    } else if (this.props.show && !nextProps.show) {
      this.setState({
        dialogState: DIALOG_STATE.closing
      });
    }
  }
  componentDidUpdate() {
    if (this.state.dialogState === DIALOG_STATE.opening) {
      setTimeout(() => {
        this.setState({ dialogState: DIALOG_STATE.open });
        if (typeof this.props.onEscape === 'function') {
          window.addEventListener('keyup', this.keyUpListener);
        }
        if (typeof this.props.onOpen === 'function') {
          this.props.onOpen();
        }
      }, 0);
    } else if (this.state.dialogState === DIALOG_STATE.closing) {
      setTimeout(() => {
        this.setState({ dialogState: DIALOG_STATE.closed });
        if (typeof this.props.onEscape === 'function') {
          window.removeEventListener('keyup', this.keyUpListener);
        }
        if (typeof this.props.onClose === 'function') {
          this.props.onClose();
        }
      }, FADE_DURATION);
    }
  }
  keyUpListener(e) {
    if (e.keyCode === 27) {
      this.props.onEscape();
    }
  }
  render() {
    const dialogState = this.state.dialogState;

    let className = luiClassName('dialog', {
      props: this.props,
      modifiers
    });
    let backgroundClassName = 'lui-modal-background';
    if (dialogState === DIALOG_STATE.opening || dialogState === DIALOG_STATE.closing) {
      className += ' lui-fade';
      backgroundClassName += ' lui-fade';
    }

    const passProps = filterProps(this.props, modifiers, 'onEscape', 'show', 'onOpen', 'onClose');

    return (
      dialogState !== DIALOG_STATE.closed ?
        <Portal portalId={this.portalId}>
          <div className="lui-dialog-container">
            <div className={backgroundClassName} />
            <div className={className} tabIndex="-1" {...passProps}>
              {this.props.children}
            </div>
          </div>
        </Portal>
        : null
    );
  }
}

export default Dialog;