import { starStates } from '../../src/components/Stars';

describe('starStates', () => {
  it('maps a whole rating to filled + empty', () => {
    expect(starStates(4)).toEqual(['full', 'full', 'full', 'full', 'empty']);
  });

  it('maps a .5 rating to a trailing half', () => {
    expect(starStates(4.5)).toEqual(['full', 'full', 'full', 'full', 'half']);
  });

  it('clamps a 5 rating to all full', () => {
    expect(starStates(5)).toEqual(['full', 'full', 'full', 'full', 'full']);
  });

  it('treats sub-.5 fractions as empty', () => {
    expect(starStates(4.3)).toEqual(['full', 'full', 'full', 'full', 'empty']);
  });

  it('handles zero', () => {
    expect(starStates(0)).toEqual(['empty', 'empty', 'empty', 'empty', 'empty']);
  });
});
