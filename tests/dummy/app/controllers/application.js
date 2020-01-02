import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @tracked portalTarget = "foo";

  @action
  changeTarget(val) {
    this.portalTarget = val;
  }

}
