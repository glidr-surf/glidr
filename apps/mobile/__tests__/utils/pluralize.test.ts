import { pluralize } from '../../src/utils/pluralize';

describe('pluralize', () => {
  it('uses singular for 1', () => expect(pluralize(1, 'opinion')).toBe('1 opinion'));
  it('uses plural for 0 and n>1', () => {
    expect(pluralize(0, 'opinion')).toBe('0 opinions');
    expect(pluralize(3, 'opinion')).toBe('3 opinions');
  });
  it('honours an explicit plural', () => expect(pluralize(2, 'foot', 'feet')).toBe('2 feet'));
});
