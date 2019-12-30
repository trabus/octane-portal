import Component from '@glimmer/component';
import { action } from '@ember/object'
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { later } from '@ember/runloop';

export default class PortalComponent extends Component {
  @service portal;

  @tracked isOpen = false;
  @tracked targetElement = null;
  closeDuration = 10;

  get guid(){
    return this.args.id || 'modal-' + guidFor(this);
  }
  get canOpen() {
    return typeof this.args.canOpen !== 'undefined' ? this.args.canOpen : true;
  }

  @action
  close() {
    this.isOpen=false;
    later(this, function () {
      this.targetElement = null;
      if (this.args.onClose) {
        this.args.onClose();
      }
    }, this.closeDuration);
  }

  @action
  open() {
    // modal service checks canOpen status before invoking this
    this.isOpen = true;
    if (this.args.onOpen) {
      this.args.onOpen();
    }
    let namespace = this.args.namespace;
    this.targetElement = this.portal.getTarget(namespace);
  }
}
