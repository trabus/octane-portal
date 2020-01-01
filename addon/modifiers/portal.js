import Modifier from 'ember-modifier';
import { inject as service } from '@ember/service';

/**
 * element modifier that automatically registers and unregisters a
 * portal with the portal serice
 */
export default class PortalTargetModifier extends Modifier {
  @service portal;
  /**
   * register this portal with the portal service
   */
  didReceiveArguments() {
    const [ id, instance ] = this.args.positional;
    const { target } = this.args.named;
    this.portal.registerPortal(id, instance, target);
  }

  /**
   * unregister this portal with the portal service
   */
  willRemove() {
    const [ id ] = this.args.positional;
    const { target } = this.args.named;
    this.portal.unregisterPortal(id, target);
  }
}