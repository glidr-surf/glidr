import { typeStyles } from '../../src/theme/typography';

describe('typeStyles readable floor', () => {
  it('bodyM is at least 15px', () => {
    expect(typeStyles.bodyM.fontSize).toBe(15);
  });

  it('bodyL is at least 17px', () => {
    expect(typeStyles.bodyL.fontSize).toBe(17);
  });
});
