import { LogoutModule } from './logout.module';

describe('LogoutModule', () => {
  let loginModule: LogoutModule;

  beforeEach(() => {
    loginModule = new LogoutModule();
  });

  it('should create an instance', () => {
    expect(loginModule).toBeTruthy();
  });
});
