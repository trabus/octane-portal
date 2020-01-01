import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, doubleClick } from '@ember/test-helpers';
import Service from '@ember/service';
import { action } from '@ember/object'
import hbs from 'htmlbars-inline-precompile';

module('Integration | Modifier | portal-close', function(hooks) {
  setupRenderingTest(hooks);

  test('it triggers the close action with id', async function(assert) {
    assert.expect(1);
    class PortalService extends Service {
      @action
      close(id) {
        assert.equal(id, "test");
      }
    }
    
    this.owner.unregister('service:portal');
    this.owner.register('service:portal', PortalService);
    await render(hbs`<div data-test-close {{portal-close "test"}}></div>`);
    await click('[data-test-close]');
  });

  test('event can be set', async function(assert) {
    assert.expect(1);
    class PortalService extends Service {
      @action
      close(id) {
        assert.equal(id, "test");
      }
    }
    
    this.owner.unregister('service:portal');
    this.owner.register('service:portal', PortalService);
    await render(hbs`<div data-test-close {{portal-close "test" event="dblclick"}}></div>`);
    await doubleClick('[data-test-close]');
  });
});
