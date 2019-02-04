import { SitemapModule } from './sitemap.module';

describe('SitemapModule', () => {
  let homeModule: SitemapModule;

  beforeEach(() => {
    homeModule = new SitemapModule();
  });

  it('should create an instance', () => {
    expect(homeModule).toBeTruthy();
  });
});
