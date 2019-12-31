import Modifier from 'ember-modifier';
import { inject as service } from '@ember/service';

export default class PortalTargetModifier extends Modifier {
  @service portal;

  /**
   * register target element with portal service
   */
  didReceiveArguments() {
    const { namespace } = this.args.named;
    this.portal.registerTarget(this.element, { namespace });
  }
  
  /**
   * unregister target with portal service
   */
  willRemove() {
    const { namespace } = this.args.named;
    if (this.portal.getTarget(namespace) === this.element) {
      this.portal.unregisterTarget({ namespace });
    }
  }
}