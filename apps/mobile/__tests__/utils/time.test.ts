import { formatRelativeTime } from '../../src/utils/time';

describe('formatRelativeTime', () => {
  it('returns "just now" for times less than a minute ago', () => {
    const now = new Date().toISOString();
    expect(formatRelativeTime(now)).toBe('just now');
  });

  it('returns minutes for times less than an hour ago', () => {
    const date = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('15m ago');
  });

  it('returns hours for times less than a day ago', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('3h ago');
  });

  it('returns days for times less than 30 days ago', () => {
    const date = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('5d ago');
  });

  it('returns months for times 30+ days ago', () => {
    const date = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('2mo ago');
  });
});
