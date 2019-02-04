import { PreferitiModule } from './preferiti.module';

describe('PreferitiModule', () => {
  let preferitiModule: PreferitiModule;

  beforeEach(() => {
    preferitiModule = new PreferitiModule();
  });

  it('should create an instance', () => {
    expect(preferitiModule).toBeTruthy();
  });
});
