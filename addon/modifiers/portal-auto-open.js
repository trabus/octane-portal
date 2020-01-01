import Modifier from 'ember-modifier';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop'

export default class PortalAutoOpenModifier extends Modifier {
  @service portal;

  get canOpen() {
    const { canOpen } = this.args.named;
    return typeof canOpen === 'undefined' || canOpen;
  }

  @action
  open() {
    const [ portalId ] = this.args.positional;
    portalId && this.portal.open(portalId);
  }

  didReceiveArguments() {
    this.canOpen && scheduleOnce('afterRender', this, this.open);
  }
}