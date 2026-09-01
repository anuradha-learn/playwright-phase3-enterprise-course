// tests/authentication/login.validation.spec.ts

import { test } from '@playwright/test';

test.describe(
  'Authentication — login validation @authentication',
  () => {

    test.skip(
      'user with invalid credentials sees error message @regression @authentication',
      async () => {}
    );

    test.skip(
      'user with empty username sees validation error @regression @authentication',
      async () => {}
    );

    test.skip(
      'user with empty password sees validation error @regression @authentication',
      async () => {}
    );

    test.skip(
      'locked account displays appropriate message @regression @authentication',
      async () => {}
    );

});