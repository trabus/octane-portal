/* eslint-disable no-console */
import Service from '@ember/service';
import { action } from '@ember/object';
import { assert } from '@ember/debug';
const warn = console.warn.bind(console);
function developerLog(message) {
  warn(message);
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

  /**
   * Get the target namespace, using default if not defined
   * @param {String} namespace 
   */
  @action
  getNamespace(namespace) {
    return typeof namespace !== 'undefined' ? namespace : 'default';
  }

  /**
   * Get target for the namespace
   * @param {String} namespace 
   */
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
      developerLog(`The portal ${id} could not be opened, its canOpen property is false.`);
      return false;
    }
    if (item && item.isOpen) {
      developerLog(`The portal ${id} is already open.`);
      return false;
    }
    item && item.open();
    if (!targetElement) {
      developerLog(`The portal ${id} could not be opened, there is no targetElement to render into. Please add a \`{{portal-target}}\` element modifier somewhere where it is rendered at the same time as the intended modal. To ensure a target is always present, use the \`application.hbs\` for portals invoked through the service.`)
    }
    if (!item) {
      if (typeof id !== 'string') {
        developerLog('The portal service `open` action requires a string id to look up a currently registered portal instance. Please check that an id is passed as a string.');
      } else {
        developerLog(`The portal ${id} does not exist or has not registered with the portal service. Please check to see if the portal is currently rendered in the current route or parent(s).`);
      }
    }
  }

  /**
   * Close a specific portal by id
   * If the id === "all", any open portals will be closed
   * @param {String} id 
   */
  @action
  close(id, { namespace }) {
    const key = this.getNamespace(namespace);
    if (id && this.isRegistered(id, key)) {
      const item = this._portals.get(key).get(id);
      item.isOpen && item.close();
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
   * Registers a portal instance by id
   * @param {String} id 
   * @param {Portal} item 
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
   * Unregisters a portal instance by id
   * @param {String} id 
   */
  @action
  unregisterPortal(id, namespace) {
    const key = this.getNamespace(namespace);
    if (this.isRegistered(id, key)) {
      this._portals.get(key).delete(id);
    }
  }

  /**
   * Register a target with the defined namespace
   * @param {Element} element 
   * @param {String} namespace 
   */
  @action
  registerTarget(element, { namespace }) {
    const key = this.getNamespace(namespace);
    this._targets.set(key, element);
  }

  /**
   * Unregisters a target with the defined namespace
   * @param {String} namespace 
   */
  @action
  unregisterTarget({ namespace }) {
    const key = this.getNamespace(namespace);
    if (this._targets.has(key)) {
      this._targets.delete(key);
    }
  }
}
