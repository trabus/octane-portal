import Component from '@glimmer/component';
import { action } from '@ember/object'
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { later } from '@ember/runloop';

/**
 * A component to provide a portal to render content into
 * a target element from anywhere in an app. Content is
 * hidden until a `{{portal-open "id"}}` element modifier is
 * triggered. Content will remain visible until a
 * `{{portal-close "id"}}` element modifier is triggered.
 */
export default class PortalComponent extends Component {
  @service portal;

  /**
   * open state
   */
  @tracked isOpen = false;
  
  /**
   * portal close duration, allows for animation to complete
   */
  defaultCloseDuration = 1;

  /**
   * unique id for portal
   */
  get guid() {
    return this.args.id || 'portal-' + guidFor(this);
  }
  
  /**
   * portal target
   */
  get target() {
    return this.args.target || 'default';
  }

  /**
   * target element to render into using `{{-in-element}}`
   */
  get targetElement() {
    return this.isOpen ? this.portal.getTargetElement(this.target) : null;
  }

  /**
   * boolean determining if portal can open
   */
  get canOpen() {
    return typeof this.args.canOpen !== 'undefined' ? this.args.canOpen : true;
  }

  /**
   * duration to wait before closing portal
   * generally used for allowing animation to complete
   */
  get closeDuration() {
    return this.args.closeDuration || this.defaultCloseDuration;
  }

  /**
   * Close portal after close duration
   * executes `onClose` action if passed
   */
  @action
  close() {
    later(this, function () {
      this.isOpen=false;
      if (this.args.onClose) {
        this.args.onClose();
      }
    }, this.closeDuration);
  }

  /**
   * Open portal
   * executes `onOpen` action if passed
   */
  @action
  open() {
    // portal service checks canOpen status before invoking this
    this.isOpen = true;
    if (this.args.onOpen) {
      this.args.onOpen();
    }
  }
}
