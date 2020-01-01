import Modifier from 'ember-modifier';
import { inject as service } from '@ember/service';

/**
 * Sets up an event to close the target portal on
 */
export default class PortalCloseModifier extends Modifier {
  @service portal;

  /**
   * track event and handler
   */
  event = null;
  handler = null;

  /**
   * Setup event listener
   */
  addEventListener() {
    const [ portal ] = this.args.positional;
    const { event, target } = this.args.named;

    // modal can either be the string id or a modal-dialog instance
    const id = typeof portal === 'string' ? portal : portal.guid;
    // Store the current event and handler for when we need to remove them
    this.event = typeof event !== 'undefined' ? event : 'click';
    this.handler = () => this.portal.close(id, { target });

    this.element.addEventListener(this.event, this.handler);
  }

  /**
   * Teardown event listener
   */
  removeEventListener() {
    let { event, handler } = this;
    if (event && handler) {
      this.element.removeEventListener(event, handler);

      this.event = null;
      this.handler = null;
    }
  }

  /**
   * if portal is defined, setup listener
   */
  didReceiveArguments() {
    const [ portal ] = this.args.positional;
    if (typeof portal === 'undefined') {
      return;
    }
    this.removeEventListener();
    this.addEventListener();
  }
  
  /**
   * remove event listner
   */
  willRemove() {
    this.removeEventListener();
  }
}
