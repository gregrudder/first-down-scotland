export function scoreHistoryPath(scoreA: number, scoreB: number): string {
  const params = new URLSearchParams({
    a: String(scoreA),
    b: String(scoreB),
  });
  return `/score-history?${params.toString()}`;
}
