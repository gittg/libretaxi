/* eslint-disable no-new, no-unused-vars */
import test from 'ava';
import routes from '../../../src/routes'; // to aviod circular dependencies
import DriverCheckin from '../../../src/actions/menu/driver/checkin';
import { i18n } from '../../spec-support';

const user = { userKey: 'cli_1' };

test('can be constructed with default parameters', t => {
  new DriverCheckin({ i18n, user });
  t.pass();
});

test('should return composite response on get', t => {
  const action = new DriverCheckin({ i18n, user });
  const response = action.get();
  t.is(response.type, 'composite');
  t.is(response.responses[0].type, 'text');
  t.is(response.responses[0].message, i18n.__('driver-checkin.provide_location'));
  t.is(response.responses[1].type, 'request-location');
  t.is(response.responses[1].buttonText, i18n.__('global.location_button_text'));
});

test('should return composite response on post', t => {
  const action = new DriverCheckin({ i18n, user });
  const response = action.post([37.421955, -122.084058]);
  t.is(response.type, 'if');
  t.is(response.condition.type, 'location');
  t.deepEqual(response.condition.value, [37.421955, -122.084058]);
  t.is(response.ok.type, 'composite');
  t.is(response.ok.responses[0].type, 'update-location');
  t.deepEqual(response.ok.responses[0].location, [37.421955, -122.084058]);
  t.is(response.ok.responses[1].type, 'user-state');
  t.deepEqual(response.ok.responses[1].state.location, [37.421955, -122.084058]);
  t.is(response.ok.responses[2].type, 'checkin');
  t.is(response.ok.responses[2].driverKey, 'cli_1');
  t.is(response.ok.responses[3].type, 'text');
  t.is(response.ok.responses[3].message, i18n.__('driver-checkin.ok'));
  t.is(response.ok.responses[4].type, 'redirect');
  t.is(response.ok.responses[4].path, 'driver-index');
  t.is(response.err.type, 'error');
  t.is(response.err.message, i18n.__('global.error_location'));
});
