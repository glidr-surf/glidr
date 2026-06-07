export function boardOpinionPhrase(n: number): string {
  if (n <= 0) return 'no board opinions yet';
  if (n === 1) return 'an opinion on one board';
  return `opinions on ${n} boards`;
}
