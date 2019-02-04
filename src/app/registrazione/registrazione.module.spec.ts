import { RegistrazioneModule } from './registrazione.module';

describe('SearchModule', () => {
  let registrazioneModule: RegistrazioneModule;

  beforeEach(() => {
      registrazioneModule = new RegistrazioneModule();
  });

  it('should create an instance', () => {
    expect(registrazioneModule).toBeTruthy();
  });
});
