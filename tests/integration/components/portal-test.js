import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | portal', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`
      <button data-test-open type="button" {{portal-open "test"}}>open</button>
      <Portal @id="test">
        template block text
        <button data-test-close type="button" {{portal-close "test"}}>close</button>
      </Portal>
      <div {{portal-target}}></div>
    `);

    assert.dom(this.element).hasText('open');

    await click('[data-test-open]');

    assert.dom(this.element).hasText('open template block text close')
  });

  test('canOpen controls opening', async function(assert) {
    this.set('canOpen', false);
    await render(hbs`
      <button data-test-open type="button" {{portal-open "test"}}>open</button>
      <Portal @id="test" @canOpen={{this.canOpen}}>
        template block text
        <button data-test-close type="button" {{portal-close "test"}}>close</button>
      </Portal>
      <div {{portal-target}}></div>
    `);

    await click('[data-test-open]');
    assert.dom(this.element).hasText('open');

    this.set('canOpen', true);
    await click('[data-test-open]');
    assert.dom(this.element).hasText('open template block text close')
  });
});
