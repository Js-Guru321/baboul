import { VetrinaModule } from './vetrina.module';

describe('VetrinaModule', () => {
  let vetrinaModule: VetrinaModule;

  beforeEach(() => {
    vetrinaModule = new VetrinaModule();
  });

  it('should create an instance', () => {
    expect(vetrinaModule).toBeTruthy();
  });
});
