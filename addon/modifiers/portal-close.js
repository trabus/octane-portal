import Modifier from 'ember-modifier';
import { inject as service } from '@ember/service';

export default class ModalCloseModifier extends Modifier {
  @service portal;

  event = null;
  handler = null;

  // methods for reuse
  addEventListener() {
    const [ portal ] = this.args.positional;
    const { event, namespace } = this.args.named;

    // modal can either be the string id or a modal-dialog instance
    const id = typeof portal === 'string' ? portal : portal.guid;
    // Store the current event and handler for when we need to remove them
    this.event = typeof event !== 'undefined' ? event : 'click';
    this.handler = () => this.portal.close(id, { namespace });

    this.element.addEventListener(this.event, this.handler);
  }

  removeEventListener() {
    let { event, handler } = this;
    if (event && handler) {
      this.element.removeEventListener(event, handler);

      this.event = null;
      this.handler = null;
    }
  }

  // lifecycle hooks
  didReceiveArguments() {
    const [ portal ] = this.args.positional;
    if (typeof portal === 'undefined') {
      return;
    }
    this.removeEventListener();
    this.addEventListener();
  }

  willRemove() {
    this.removeEventListener();
  }
}
