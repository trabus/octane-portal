import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, doubleClick } from '@ember/test-helpers';
import Service from '@ember/service';
import { action } from '@ember/object';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Modifier | portal-open', function(hooks) {
  setupRenderingTest(hooks);

  test('it triggers the open action with id', async function(assert) {
    assert.expect(1);
    class PortalService extends Service {
      @action
      open(id) {
        assert.equal(id, "test");
      }
    }
    
    this.owner.unregister('service:portal');
    this.owner.register('service:portal', PortalService);
    await render(hbs`<div data-test-open {{portal-open "test"}}></div>`);
    await click('[data-test-open]');
  });

  test('event can be set', async function(assert) {
    assert.expect(1);
    class PortalService extends Service {
      @action
      open(id) {
        assert.equal(id, "test");
      }
    }
    
    this.owner.unregister('service:portal');
    this.owner.register('service:portal', PortalService);
    await render(hbs`<div data-test-open {{portal-open "test" event="dblclick"}}></div>`);
    await doubleClick('[data-test-open]');
  });
});
