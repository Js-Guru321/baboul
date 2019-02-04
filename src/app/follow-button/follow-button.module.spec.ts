import { FollowButtonModule } from './follow-button.module';

describe('FollowButtonModule', () => {
  let followButtonModule: FollowButtonModule;

  beforeEach(() => {
    followButtonModule = new FollowButtonModule();
  });

  it('should create an instance', () => {
    expect(followButtonModule).toBeTruthy();
  });
});
