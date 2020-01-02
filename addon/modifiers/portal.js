import Modifier from 'ember-modifier';
import { inject as service } from '@ember/service';

/**
 * element modifier that automatically registers and unregisters a
 * portal with the portal serice
 */
export default class PortalTargetModifier extends Modifier {
  @service portal;

  portalId = null;
  portalTarget = null;
  /**
   * register this portal with the portal service
   */
  didReceiveArguments() {
    let { portalId, portalTarget } = this;
    if (portalId || portalTarget) {
      this.portal.unregisterPortal(portalId, portalTarget); 
    }
    // console.log('args', this.args)
    const [ id, instance ] = this.args.positional;
    const { target } = this.args.named;
    this.portalId = id;
    this.portalTarget = target;
    this.portal.registerPortal(id, instance, target);
  }

  /**
   * unregister this portal with the portal service
   */
  willRemove() {
    const [ id ] = this.args.positional;
    const { target } = this.args.named;
    this.portal.unregisterPortal(id, target);
    this.portalId = null;
    this.portalTarget = null;
  }
}