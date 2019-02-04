import { BaboulPipeModule } from './baboul-pipe.module';

describe('BaboulPipeModule', () => {
  let baboulModule: BaboulPipeModule;

  beforeEach(() => {
    baboulModule = new BaboulPipeModule();
  });

  it('should create an instance', () => {
    expect(baboulModule).toBeTruthy();
  });
});
