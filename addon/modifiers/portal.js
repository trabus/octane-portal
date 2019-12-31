import Modifier from 'ember-modifier';
import { inject as service } from '@ember/service';

/**
 * element modifier that automatically registers and unregisters a
 * portal with the portal serice
 */
export default class ModalTargetModifier extends Modifier {
  @service portal;
  /**
   * register this portal with the portal service
   */
  didReceiveArguments() {
    const [ id, instance ] = this.args.positional;
    const { namespace } = this.args.named;
    this.portal.registerPortal(id, instance, namespace);
  }

  /**
   * unregister this portal with the portal service
   */
  willRemove() {
    const [ id ] = this.args.positional;
    const { namespace } = this.args.named;
    this.portal.unregisterPortal(id, namespace);
  }
}