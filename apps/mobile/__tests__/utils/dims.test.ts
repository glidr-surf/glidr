import { formatLength, formatInches, formatVolume, lengthToInches, partsToInches } from '../../src/utils/dims';

describe('dims', () => {
  it('formats length feet/inches/half', () => {
    expect(formatLength(70.5)).toBe(`5'10½"`);
    expect(formatLength(72)).toBe(`6'0"`);
  });
  it('formats inches to nearest fraction', () => {
    expect(formatInches(20.25, 8)).toBe('20¼"');
    expect(formatInches(2.5625, 16)).toBe('2 9/16"');
    expect(formatInches(19, 8)).toBe('19"');
  });
  it('formats volume', () => expect(formatVolume(30)).toBe('30L'));
  it('builds inches from parts', () => {
    expect(lengthToInches(5, 10, true)).toBe(70.5);
    expect(partsToInches(20, 2, 8)).toBe(20.25);
  });
});
