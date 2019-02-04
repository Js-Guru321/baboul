import { NegozioModule } from './negozio.module';

describe('NegozioModule', () => {
  let negozioModule: NegozioModule;

  beforeEach(() => {
    negozioModule = new NegozioModule();
  });

  it('should create an instance', () => {
    expect(negozioModule).toBeTruthy();
  });
});
