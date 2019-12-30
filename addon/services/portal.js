/* eslint-disable no-console */
import Service from '@ember/service';
import { action } from '@ember/object';
import { assert } from '@ember/debug';
// import developerLog from 'octane-modal/utils/developer-log';
function developerLog(message) {
  console.warn(message);
}

/**
 * Provides registry to track currently rendered modals
 * 
 * this._targets = { default: element }
 * this._portals = { default: {
 *  portalId: instance
 * }}
 */
export default class PortalService extends Service {
  constructor() {
    super(...arguments)
    // map of targets by namespace
    this._targets = new Map();
    // maps of portals by id, by namespace
    this._portals = new Map();
  }
  @action
  getNamespace(namespace) {
    return typeof namespace !== 'undefined' ? namespace : 'default';
  }
  @action
  getTarget(namespace) {
    const key = this.getNamespace(namespace);
    return this._targets.get(key);
  }
  /**
   * Open a specific modal-dialog that has registered with modal service
   * @param {String} id
   */
  @action
  open(id, { namespace }) {
    const key = this.getNamespace(namespace);
    // get modal-dialog instance from registry
    const item = this._portals.get(key).get(id);
    const targetElement = this._targets.get(key);
    // open 
    if (item && !item.canOpen) {
      developerLog(`The modal-dialog ${id} could not be opened, its canOpen property is false.`);
      return false;
    }
    item && item.open();
    if (!targetElement) {
      developerLog(`The modal-dialog ${id} could not be opened, there is no targetElement to render into. Please add a \`<ModalTarget />\` element somewhere where it is rendered at the same time as the intended modal. To ensure a target is always present, use the \`application.hbs\` for modals invoked through the service.`)
    }
    if (!item) {
      if (typeof id !== 'string') {
        developerLog('The modal service `openModal` action requires a string id to look up a currently registered modal instance. Please check that an id is passed as a string.');
      } else {
        developerLog(`The modal-dialog ${id} does not exist or has not registered with the modal service. Please check to see if the modal is currently rendered in the current route or parent(s).`);
      }
    }
  }
  /**
   * Close a specific modal-dialog by id
   * If the id === "all", any open modals will be closed
   * @param {String} id 
   */
  @action
  close(id, { namespace }) {
    const key = this.getNamespace(namespace);
    if (id && this.isRegistered(id, key)) {
      const item = this._portals.get(key).get(id);
      item.close();
      console.log('item close')
    // close all registered modals
    } else if (id === 'all') {
      this._registry.forEach((i) => {
        if (i.isOpen) {
         i.close();
        }
      });
    }
  }
  
  /**
   * Checks if id is registered with modal service
   * @param {String} id 
   */
  @action
  isRegistered(id, namespace) {
    return this._portals.get(namespace).has(id);
  }

  /**
   * Registers a modal-dialog instance by id
   * @param {String} id 
   * @param {ModalDialog} item 
   */
  @action
  registerPortal(id, item, namespace) {
    const key = this.getNamespace(namespace);
    // if namespace doesn't exist, create one
    if (!this._portals.has(key)) this._portals.set(key, new Map());
    let portal = this._portals.get(key)
    // throw an error if we've got a duplicate
    assert(`Could not register portal:${id}. The portal service already has a portal registered under the id: ${id}. Check your templates for duplicate invocation of {{portal @id="${id}"}} instances.`, !this.isRegistered(id, key))
    portal.set(id, item);
  }

  /**
   * Unregisters a modal-dialog instance by id
   * @param {String} id 
   */
  @action
  unregisterPortal(id, namespace) {
    const key = this.getNamespace(namespace);
    if (this.isRegistered(id, key)) {
      this._portals.get(key).delete(id);
    }
  }

  @action
  registerTarget(element, { namespace }) {
    const key = this.getNamespace(namespace);
    this._targets.set(key, element);
  }

  @action
  unregisterTarget({ namespace }) {
    const key = this.getNamespace(namespace);
    if (this._targets.has(key)) {
      this._targets.delete(key);
    }
  }
}
