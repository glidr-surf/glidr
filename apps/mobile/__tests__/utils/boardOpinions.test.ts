import { boardOpinionPhrase } from '../../src/utils/boardOpinions';

describe('boardOpinionPhrase', () => {
  it('handles 0/1/n', () => {
    expect(boardOpinionPhrase(0)).toBe('no board opinions yet');
    expect(boardOpinionPhrase(1)).toBe('an opinion on one board');
    expect(boardOpinionPhrase(5)).toBe('opinions on 5 boards');
  });
});
