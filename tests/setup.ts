import { registerFsMatchers } from './custom-matchers/fs-matchers';

beforeAll(() => {
  registerFsMatchers();
});
