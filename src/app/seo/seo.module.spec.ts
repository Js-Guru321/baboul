import { SeoModule } from './seo.module';

describe('SeoModule', () => {
  let homeModule: SeoModule;

  beforeEach(() => {
    homeModule = new SeoModule();
  });

  it('should create an instance', () => {
    expect(homeModule).toBeTruthy();
  });
});
