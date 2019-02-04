import { SearchResultModule } from './search-result.module';

describe('SearchResultModule', () => {
  let searchResultModule: SearchResultModule;

  beforeEach(() => {
    searchResultModule = new SearchResultModule();
  });

  it('should create an instance', () => {
    expect(searchResultModule).toBeTruthy();
  });
});
