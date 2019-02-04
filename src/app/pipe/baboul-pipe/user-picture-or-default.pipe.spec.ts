import { UserPictureOrDefaultPipe } from './user-picture-or-default.pipe';

describe('UserPictureOrDefaultPipe', () => {
  it('create an instance', () => {
    const pipe = new UserPictureOrDefaultPipe();
    expect(pipe).toBeTruthy();
  });
});
