import Modifier from 'ember-modifier';
import { inject as service } from '@ember/service';

export default class PortalTargetModifier extends Modifier {
  @service portal;
  didReceiveArguments() {
    const { namespace } = this.args.named;
    this.portal.registerTarget(this.element, { namespace });
  }

  willRemove() {
    const { namespace } = this.args.named;
    console.log('removing ', namespace)
    if (this.portal.getTarget(namespace) === this.element) {
      this.portal.unregisterTarget({ namespace });
    }
  }
}