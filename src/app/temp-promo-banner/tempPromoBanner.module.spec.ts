import { TempPromoBannerModule } from './tempPromoBanner.module';

describe('TempPromoBannerModule', () => {
  let tempPromoBannerModule: TempPromoBannerModule;

  beforeEach(() => {
      tempPromoBannerModule = new TempPromoBannerModule();
  });

  it('should create an instance', () => {
    expect(tempPromoBannerModule).toBeTruthy();
  });
});
