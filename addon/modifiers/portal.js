import Modifier from 'ember-modifier';
import { inject as service } from '@ember/service';

export default class ModalTargetModifier extends Modifier {
  @service portal;
  didReceiveArguments() {
    const [ id, instance ] = this.args.positional;
    const { namespace } = this.args.named;
    this.portal.registerPortal(id, instance, namespace);
  }

  willRemove() {
    const [ id ] = this.args.positional;
    const { namespace } = this.args.named;
    this.portal.unregisterPortal(id, namespace);
  }
}