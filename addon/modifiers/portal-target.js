import Modifier from 'ember-modifier';
import { inject as service } from '@ember/service';

export default class PortalTargetModifier extends Modifier {
  @service portal;

  /**
   * register target element with portal service
   */
  didReceiveArguments() {
    const { name } = this.args.named;
    this.portal.registerTarget(this.element, { name });
  }
  
  /**
   * unregister target with portal service
   */
  willRemove() {
    const { name } = this.args.named;
    if (this.portal.getTarget(name) === this.element) {
      this.portal.unregisterTarget({ name });
    }
  }
}