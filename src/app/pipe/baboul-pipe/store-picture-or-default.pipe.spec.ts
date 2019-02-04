import { StorePictureOrDefaultPipe } from './store-picture-or-default.pipe';

describe('StorePictureOrDefaultPipe', () => {
  it('create an instance', () => {
    const pipe = new StorePictureOrDefaultPipe();
    expect(pipe).toBeTruthy();
  });
});
